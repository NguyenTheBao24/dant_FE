"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/admin/dashboard/header";
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar";
import { CustomersTab } from "@/components/admin/dashboard/customers-tab";
import { OverviewPage } from "@/components/admin/pages/overview-page";
import { ContactPage } from "@/components/admin/pages/contact-page";
import { NotificationsPage } from "@/components/admin/pages/notifications-page";
import { AddHostelPage } from "@/components/admin/pages/add-hostel-page";
import { ExpensesPage } from "@/components/admin/pages/expenses-page";
import { ResetInvoicesPage } from "@/components/admin/pages/reset-invoices-page";

// Removed old data imports - using Supabase data instead
import {
  createToaNha,
  deleteToaNha,
  listToaNha,
} from "@/services/toa-nha.service";
import { updateToaNha } from "@/services/toa-nha.service";
import { createQuanLy, updateQuanLy } from "@/services/quan-ly.service";
import { createTaiKhoan } from "@/services/tai-khoan.service";
import {
  createFixedCanHoForToaNha,
  countCanHoByToaNha,
} from "@/services/can-ho.service";
import { listHopDongByToaNha } from "@/services/hop-dong.service";
import { getThongBaoByToaNha } from "@/services/thong-bao.service";
import { listHoaDonChuaThanhToanTrongThang } from "@/services/hoa-don.service";
import { NotificationManagerDialog } from "@/components/manager/dialogs/NotificationManagerDialog";
import { NotificationViewDialog } from "@/components/admin/dialogs/NotificationViewDialog";
import { useManagerNotificationRealtime } from "@/hooks/useNotificationRealtime";
import { InvoiceInfoDialog } from "@/components/admin/dashboard/dialogs/InvoiceInfoDialog";
import {
  deleteKhachThue,
  updateKhachThue,
} from "@/services/khach-thue.service";
import { deleteHopDong, updateHopDong } from "@/services/hop-dong.service";
// Removed old dashboard tables (notifications, revenue_data, expense_categories)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [hostelList, setHostelList] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    revenue: [],
    expenseCategories: [],
    notifications: [],
  });
  const [dialogState, setDialogState] = useState({
    open: false,
    kind: null,
    data: null,
  });

  const handleSelectNotification = n => {
    // type 'order' => invoice; others => chat/manager
    if (n?.type === "order") {
      setDialogState({ open: true, kind: "invoice", data: n._source || n });
    } else {
      // Admin chỉ xem thông báo, không thể nhắn tin
      // Truyền đầy đủ dữ liệu từ _source
      const notificationData = n._source || n;
      setDialogState({ open: true, kind: "chat", data: notificationData });
    }
  };

  // Tính tổng số phòng đã thuê = số khách thuê active của tòa nhà hiện tại
  const occupiedRoomsCount = selectedHostel
    ? tenants
      .filter(
        tenant => (tenant.hostel_id || tenant.hostelId) === selectedHostel.id
      )
      .filter(tenant => tenant.status === "active").length
    : 0;

  // Tự động cập nhật occupancy khi tenants thay đổi
  useEffect(() => {
    if (selectedHostel?.id) {
      const totalRooms = selectedHostel.rooms || 0;
      const newOccupancy =
        totalRooms > 0
          ? Math.round((occupiedRoomsCount / totalRooms) * 100)
          : 0;

      // Cập nhật selectedHostel với occupancy mới
      setSelectedHostel(prev => ({
        ...prev,
        occupancy: newOccupancy,
      }));

      // Cập nhật hostelList với occupancy mới
      setHostelList(prev =>
        prev.map(hostel =>
          hostel.id === selectedHostel.id
            ? { ...hostel, occupancy: newOccupancy }
            : hostel
        )
      );
    }
  }, [occupiedRoomsCount, selectedHostel?.id]);

  const filteredTenants = tenants
    .filter(
      tenant =>
        selectedHostel &&
        (tenant.hostel_id || tenant.hostelId) === selectedHostel.id
    )
    .filter(tenant => tenant.status === "active") // Chỉ hiển thị tenant active
    .filter(
      tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tenant.room_number || tenant.roomNumber)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm)
    );

  const generateContract = tenant => {
    console.log(`Generating contract for ${tenant.name}`);
    alert(`Đang tạo hợp đồng thuê cho ${tenant.name}...`);
  };

  const editTenant = async updatedTenant => {
    try {
      // Chuẩn bị dữ liệu cập nhật, chỉ gửi các field có giá trị để tránh lỗi constraint
      const updateData = {
        ho_ten: updatedTenant.name,
        sdt: updatedTenant.phone,
        tai_khoan_id: updatedTenant.tai_khoan_id || null,
      };

      // Chỉ thêm email nếu có giá trị
      if (updatedTenant.email && updatedTenant.email.trim()) {
        updateData.email = updatedTenant.email.trim();
      }

      // Chỉ thêm cccd nếu có giá trị, tránh lỗi unique constraint
      if (updatedTenant.cccd && updatedTenant.cccd.trim()) {
        updateData.cccd = updatedTenant.cccd.trim();
      }

      // Cập nhật thông tin khách thuê trong schema mới
      await updateKhachThue(updatedTenant.id, updateData);

      // Cập nhật hợp đồng nếu có thay đổi phòng
      if (updatedTenant.hop_dong_id && updatedTenant.room_id) {
        await updateHopDong(updatedTenant.hop_dong_id, {
          can_ho_id: updatedTenant.room_id,
        });
      }

      // Cập nhật state với thông tin tài khoản mới nếu có
      setTenants(prev =>
        prev.map(t =>
          t.id === updatedTenant.id ? { ...t, ...updatedTenant } : t
        )
      );
    } catch (error) {
      console.error("Failed to update tenant:", error);

      // Xử lý lỗi cụ thể cho user
      const errorObj = error;
      if (errorObj?.code === "23505") {
        if (errorObj?.details?.includes("cccd")) {
          alert(
            "CCCD đã tồn tại trong hệ thống. Vui lòng kiểm tra lại CCCD hoặc để trống nếu chưa có."
          );
        } else if (errorObj?.details?.includes("email")) {
          alert(
            "Email đã tồn tại trong hệ thống. Vui lòng kiểm tra lại email hoặc để trống nếu chưa có."
          );
        } else {
          alert("Thông tin khách thuê đã tồn tại. Vui lòng kiểm tra lại.");
        }
      } else {
        alert(
          "Có lỗi xảy ra khi cập nhật thông tin khách thuê. Vui lòng thử lại."
        );
      }

      // Fallback to local state
      setTenants(prev =>
        prev.map(t =>
          t.id === updatedTenant.id ? { ...t, ...updatedTenant } : t
        )
      );
    }
  };

  const exportTenant = tenant => {
    const csvHeader = [
      "id",
      "name",
      "roomNumber",
      "address",
      "phone",
      "emergencyPhone",
      "rentMonths",
      "status",
      "hostelId",
    ];
    const row = [
      tenant.id,
      tenant.name,
      tenant.room_number || tenant.roomNumber,
      tenant.address,
      tenant.phone,
      tenant.emergency_phone || tenant.emergencyPhone,
      tenant.months_rented || tenant.rentMonths,
      tenant.status,
      tenant.hostel_id || tenant.hostelId,
    ];
    const csv = `${csvHeader.join(",")}\n${row
      .map(v => `"${String(v).replaceAll('"', '""')}"`)
      .join(",")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tenant_${tenant.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteTenant = async tenant => {
    if (!confirm(`Xóa khách thuê "${tenant.name}"?`)) return;
    try {
      // Xóa khách thuê và hợp đồng từ schema mới
      if (tenant.hop_dong_id) {
        await deleteHopDong(tenant.hop_dong_id);
      }
      await deleteKhachThue(tenant.id);

      setTenants(prev => prev.filter(t => t.id !== tenant.id));
    } catch (error) {
      console.error("Failed to delete tenant:", error);
      // Fallback to local state
      setTenants(prev => prev.filter(t => t.id !== tenant.id));
    }
  };

  // Load all data from Supabase on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        // Load tòa nhà (schema mới)
        const toaNhaData = await listToaNha();
        const mappedHostels = await Promise.all(
          (toaNhaData || []).map(async t => {
            const totalRooms = await countCanHoByToaNha(t.id);
            // Tính số khách thuê active cho tòa nhà này
            const contracts = await listHopDongByToaNha(t.id);
            const activeTenantsCount = (contracts || []).filter(
              h => h.trang_thai === "hieu_luc"
            ).length;
            const occupancy =
              totalRooms > 0
                ? Math.round((activeTenantsCount / totalRooms) * 100)
                : 0;

            return {
              id: t.id,
              name: t.ten_toa,
              address: t.dia_chi,
              rooms: totalRooms,
              occupancy: occupancy,
              manager: t.quan_ly
                ? {
                  id: t.quan_ly.id,
                  name: t.quan_ly.ho_ten,
                  phone: t.quan_ly.sdt,
                  email: t.quan_ly.email,
                  avatar: "",
                  experience: "",
                  username: t.quan_ly.tai_khoan?.username,
                  role: t.quan_ly.tai_khoan?.role,
                  password: t.quan_ly.tai_khoan?.password,
                }
                : {
                  id: null,
                  name: "Chưa có quản lý",
                  phone: "",
                  email: "",
                  avatar: "",
                  experience: "",
                },
            };
          })
        );
        if (mappedHostels.length) {
          setHostelList(mappedHostels);
          setSelectedHostel(mappedHostels[0]);
        }

        // Bỏ gọi các bảng cũ (notifications, revenue_data, expense_categories)
        setChartData({
          revenue: [],
          expenseCategories: [],
          notifications: [],
        });
      } catch (error) {
        console.error("Failed to load data from Supabase:", error);
        // Use fallback data if Supabase fails
        const fallbackHostels = [
          {
            id: 1,
            name: "Khu trọ mẫu",
            address: "123 Đường mẫu, Quận 1, TP.HCM",
            rooms: 20,
            occupancy: 15,
            manager: {
              id: 1,
              name: "Quản lý mẫu",
              phone: "0901234567",
              email: "manager@example.com",
              avatar: "",
              experience: "3 năm",
            },
          },
        ];
        setHostelList(fallbackHostels);
        setSelectedHostel(fallbackHostels[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Load tenants (map từ hợp đồng) khi selectedHostel thay đổi
  useEffect(() => {
    const loadTenantsForHostel = async () => {
      if (!selectedHostel?.id) return;

      console.log(
        "Loading tenants for hostel (toa_nha):",
        selectedHostel?.id,
        selectedHostel?.name
      );

      try {
        const contracts = await listHopDongByToaNha(selectedHostel?.id);
        console.log("Contracts with account data:", contracts);
        const mapped = (contracts || [])
          .filter(h => h.trang_thai === "hieu_luc")
          .map(h => {
            // Tính số tháng thuê dựa trên ngày bắt đầu và kết thúc
            const startDate = new Date(h.ngay_bat_dau);
            const endDate = new Date(h.ngay_ket_thuc);
            const monthsRented = Math.ceil(
              (endDate - startDate) / (1000 * 60 * 60 * 24 * 30)
            );

            const tenantData = {
              id: h.khach_thue?.id,
              name: h.khach_thue?.ho_ten,
              phone: h.khach_thue?.sdt,
              email: h.khach_thue?.email,
              cccd: h.khach_thue?.cccd,
              room_number: h.can_ho?.so_can,
              status: "active",
              hostel_id: h.can_ho?.toa_nha_id,
              months_rented: monthsRented,
              emergency_phone: undefined,
              rent_amount: h.can_ho?.gia_thue,
              room_id: h.can_ho?.id,
              hop_dong_id: h.id,
              contract_start: h.ngay_bat_dau,
              contract_end: h.ngay_ket_thuc,
              tai_khoan_id: h.khach_thue?.tai_khoan_id,
              tai_khoan: h.khach_thue?.tai_khoan,
            };

            // Debug log để kiểm tra thông tin tài khoản
            if (h.khach_thue?.tai_khoan) {
              console.log(
                `Tenant ${h.khach_thue?.ho_ten} has account:`,
                h.khach_thue.tai_khoan
              );
            }

            return tenantData;
          });
        setTenants(mapped);
      } catch (error) {
        console.error("Failed to load tenants for hostel:", error);
      }
    };

    loadTenantsForHostel();
  }, [selectedHostel]);

  // Load notifications for admin when selectedHostel changes
  const loadNotifications = async () => {
    if (!selectedHostel?.id) return;
    try {
      const now = new Date();
      const unpaid = await listHoaDonChuaThanhToanTrongThang(
        selectedHostel.id,
        now.getFullYear(),
        now.getMonth() + 1
      );
      const tb = await getThongBaoByToaNha(selectedHostel.id);

      const unpaidMapped = (unpaid || []).map(u => ({
        id: `inv-${u.id}`,
        title: `Phòng ${u.room_number || ""} chưa thanh toán`,
        message: `${u.tenant_name ? u.tenant_name + " - " : ""}${(
          u.so_tien || 0
        ).toLocaleString("vi-VN")}₫`,
        time: new Date(u.ngay_tao).toLocaleDateString("vi-VN"),
        type: "order",
        _source: u,
      }));

      const tenantMapped = (tb || []).slice(0, 20).map(n => ({
        id: `tb-${n.id}`,
        title: n.tieu_de,
        message: n.noi_dung || "",
        time: new Date(n.ngay_tao).toLocaleDateString("vi-VN"),
        type: n.trang_thai === "chua_xu_ly" ? "report" : "employee",
        loai_thong_bao: n.loai_thong_bao || "khac",
        trang_thai: n.trang_thai,
        _source: n,
      }));

      setChartData(prev => ({
        ...prev,
        notifications: [...unpaidMapped, ...tenantMapped],
      }));
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setChartData(prev => ({ ...prev, notifications: [] }));
    }
  };

  // Subscribe to realtime notifications for admin
  useManagerNotificationRealtime(selectedHostel?.id, (event) => {
    console.log('📡 [ADMIN NOTIFICATION] Realtime event received:', event);
    if (event && event.event === 'INSERT') {
      console.log('📡 [ADMIN NOTIFICATION] New notification received, reloading list...');
      console.log('📡 [ADMIN NOTIFICATION] New notification data:', event.data);
      // Reload lại danh sách để đảm bảo có đầy đủ dữ liệu
      // Đợi một chút để đảm bảo database đã commit transaction
      setTimeout(() => {
        loadNotifications();
      }, 1000);
    } else if (event && event.event === 'UPDATE') {
      console.log('📡 [ADMIN NOTIFICATION] Notification updated:', event.data);
      // Cập nhật thông báo đã có trong danh sách
      setChartData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => {
          if (n.id === `tb-${event.data.id}`) {
            return {
              ...n,
              title: event.data.tieu_de,
              message: event.data.noi_dung || "",
              type: event.data.trang_thai === "chua_xu_ly" ? "report" : "employee",
              _source: event.data,
            };
          }
          return n;
        })
      }));
    }
  });

  useEffect(() => {
    loadNotifications();
  }, [selectedHostel?.id]);

  const handleManagerAction = async (action, manager) => {
    switch (action) {
      case "contact":
        window.open(`tel:${manager.phone}`);
        break;
      case "email":
        window.open(`mailto:${manager.email}`);
        break;
      case "settings":
        setSelectedManager(manager);
        setIsManagerDialogOpen(true);
        break;
      case "update_manager": {
        if (!selectedHostel) break;

        try {
          let managerId = selectedHostel?.manager?.id || null;
          let taiKhoanId = selectedHostel?.manager?.tai_khoan_id || null;
          // Tạo mới hoặc cập nhật bảng quan_ly
          if (managerId) {
            await updateQuanLy(managerId, {
              ho_ten: manager.name,
              sdt: manager.phone,
              email: manager.email,
            });
          } else {
            // Tạo tài khoản cho quản lý nếu chưa có
            if (!taiKhoanId) {
              const username = manager.email || `manager_${Date.now()}`;
              const account = await createTaiKhoan({
                username,
                password: "manager@123",
                role: "quan_ly",
              });
              taiKhoanId = account?.id || null;
            }
            const created = await createQuanLy({
              ho_ten: manager.name,
              sdt: manager.phone,
              email: manager.email,
              tai_khoan_id: taiKhoanId,
            });
            managerId = created?.id || null;
          }

          // Gán quản lý vào tòa nhà
          if (managerId) {
            await updateToaNha(selectedHostel?.id, { quan_ly_id: managerId });
          }
        } catch (error) {
          console.error("Failed to persist manager to quan_ly/toa_nha:", error);
        }

        // Cập nhật local state
        const updatedHostel = {
          ...selectedHostel,
          manager: { ...selectedHostel?.manager, ...manager },
        };
        setSelectedHostel(updatedHostel);
        setHostelList(prev =>
          prev.map(h => (h.id === updatedHostel.id ? updatedHostel : h))
        );
        break;
      }
      case "create_account": {
        if (!selectedHostel) break;
        try {
          // Nếu đã có tài khoản thì không cấp mới
          if (selectedHostel?.manager?.username) {
            alert("Quản lý đã có tài khoản, không cần cấp mới");
            break;
          }
          const username = manager.email || `manager_${Date.now()}`;
          const defaultPassword = "manager@123";
          const account = await createTaiKhoan({
            username,
            password: defaultPassword,
            role: "quan_ly",
          });

          // Cập nhật quan_ly.tai_khoan_id nếu đã có quản lý
          if (selectedHostel?.manager?.id) {
            await updateQuanLy(selectedHostel.manager.id, {
              tai_khoan_id: account.id,
            });
          }

          // Update local state để hiển thị ngay username/role
          const updatedHostel = {
            ...selectedHostel,
            manager: {
              ...selectedHostel?.manager,
              username: account.username,
              role: account.role,
              // Lưu tạm mật khẩu để có thể hiển thị theo nút toggle
              password: defaultPassword,
            },
          };
          setSelectedHostel(updatedHostel);
          setHostelList(prev =>
            prev.map(h => (h.id === updatedHostel.id ? updatedHostel : h))
          );
          alert("Đã cấp tài khoản cho quản lý");
        } catch (error) {
          console.error("Failed to create manager account:", error);
          alert(
            "Không thể cấp tài khoản. Vui lòng kiểm tra cấu hình Supabase và RLS."
          );
        }
        break;
      }
      case "reports":
        alert(`Xem báo cáo của ${manager.name}`);
        break;
      default:
        break;
    }
  };

  // chartData is now managed by state

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPage
            selectedHostel={selectedHostel}
            occupiedRoomsCount={occupiedRoomsCount}
            chartData={chartData}
          />
        );
      case "customers":
        return (
          <CustomersTab
            filteredTenants={filteredTenants}
            isAddTenantOpen={isAddTenantOpen}
            onAddTenantOpenChange={setIsAddTenantOpen}
            selectedHostel={selectedHostel}
            onAddTenant={async payload => {
              try {
                // Tạo tenant object từ payload (đã được xử lý trong customers-tab)
                const newTenant = {
                  id: payload.khachThueId, // Sử dụng ID từ khach_thue
                  name: payload.name,
                  room_number: payload.roomNumber,
                  phone: payload.phone,
                  months_rented: Number(payload.rentMonths || 0),
                  rent_amount: payload.rentAmount,
                  room_id: payload.roomId,
                  status: "active",
                  hostel_id: selectedHostel?.id,
                  hop_dong_id: payload.hopDongId, // ID của hợp đồng
                };

                // Thêm vào state để hiển thị ngay lập tức
                setTenants(prev => [...prev, newTenant]);
              } catch (error) {
                console.error(
                  "Failed to update UI after tenant creation:",
                  error
                );
                // Fallback to local state
                const nextId = tenants.length
                  ? Math.max(...tenants.map(t => t.id)) + 1
                  : 1;
                const newTenant = {
                  id: nextId,
                  name: payload.name,
                  roomNumber: payload.roomNumber,
                  address: payload.address,
                  phone: payload.phone,
                  rentMonths: Number(payload.rentMonths || 0),
                  status: "active",
                  hostelId: selectedHostel?.id,
                };
                setTenants(prev => [...prev, newTenant]);
              }
            }}
            onEditTenant={editTenant}
            onDeleteTenant={handleDeleteTenant}
          />
        );
      case "contact":
        return (
          <ContactPage
            selectedHostel={selectedHostel}
            onManagerAction={handleManagerAction}
          />
        );
      case "expenses":
        return <ExpensesPage selectedHostel={selectedHostel} />;
      case "analytics":
        return <AnalyticsPage chartData={chartData} />;
      case "notifications":
        return (
          <NotificationsPage
            notifications={chartData.notifications}
            onSelect={n => handleSelectNotification(n)}
          />
        );
      case "reset-invoices":
        return <ResetInvoicesPage />;
      case "add-hostel":
        return (
          <AddHostelPage
            hostels={hostelList}
            onDelete={async hostelId => {
              if (!confirm("Xóa khu trọ này?")) return;
              try {
                // nếu có quản lý gắn với tòa nhà, xóa cả quản lý và tài khoản
                const target = hostelList.find(h => h.id === hostelId);
                const managerId = target?.manager?.id;
                const accountId =
                  target?.manager?.tai_khoan_id ||
                  target?.manager?.tai_khoan?.id;

                await deleteToaNha(hostelId);

                // xóa quản lý và tài khoản nếu có
                try {
                  if (managerId) {
                    const { deleteQuanLy } = await import(
                      "@/services/quan-ly.service"
                    );
                    await deleteQuanLy(managerId);
                    // Thông báo cho các view khác (ContactPage) loại bỏ quản lý khỏi danh sách
                    window.dispatchEvent(
                      new CustomEvent("manager-removed", {
                        detail: { managerId },
                      })
                    );
                  }
                  if (accountId) {
                    const { deleteTaiKhoan } = await import(
                      "@/services/tai-khoan.service"
                    );
                    await deleteTaiKhoan(accountId);
                  }
                } catch (e) {
                  console.warn("Cleanup manager/account failed:", e);
                }
                const updated = hostelList.filter(h => h.id !== hostelId);
                setHostelList(updated);
                if (selectedHostel?.id === hostelId) {
                  setSelectedHostel(updated[0] || null);
                }
              } catch (error) {
                console.error("Failed to delete hostel:", error);
                alert("Lỗi khi xóa tòa nhà!");
              }
            }}
            onSubmit={async payload => {
              try {
                // payload từ AddHostelPage: { ten_toa, dia_chi, quan_ly_id }
                const created = await createToaNha({
                  ten_toa: payload.ten_toa,
                  dia_chi: payload.dia_chi,
                  quan_ly_id: payload.quan_ly_id || null,
                });
                if (!created) {
                  alert(
                    "Không thể tạo tòa nhà. Vui lòng kiểm tra kết nối Supabase."
                  );
                  return;
                }

                // Tạo căn hộ cố định sau khi tạo tòa nhà
                try {
                  const total = Number(payload.so_can_ho || 10);
                  await createFixedCanHoForToaNha(created.id, total);
                } catch (e) {
                  console.error("Không thể tạo căn hộ cố định:", e);
                }

                // Recalculate rooms after creation
                let roomsCount = 0;
                try {
                  roomsCount = await countCanHoByToaNha(created.id);
                } catch { }

                const mappedHostel = {
                  id: created.id,
                  name: created.ten_toa,
                  address: created.dia_chi,
                  rooms: roomsCount,
                  occupancy: 0, // Tòa nhà mới chưa có khách thuê
                  manager: {
                    id: created.quan_ly_id || null,
                    name: "Chưa có quản lý",
                    phone: "",
                    email: "",
                    avatar: "",
                    experience: "",
                  },
                };

                setHostelList(prev => [...prev, mappedHostel]);
                setSelectedHostel(mappedHostel);
                alert("Tạo tòa nhà thành công!");
              } catch (error) {
                console.error("Failed to create hostel:", error);

                // Fallback: create locally if Supabase fails
              }
            }}
            onUpdate={async (hostelId, payload) => {
              try {
                const updated = await updateToaNha(hostelId, {
                  ten_toa: payload.ten_toa,
                  dia_chi: payload.dia_chi,
                  quan_ly_id: payload.quan_ly_id ?? null,
                });

                setHostelList(prev =>
                  prev.map(hostel =>
                    hostel.id === hostelId
                      ? {
                        ...hostel,
                        name: updated?.ten_toa || payload.ten_toa,
                        address: updated?.dia_chi || payload.dia_chi,
                        manager: {
                          ...(hostel.manager || {}),
                          id:
                            payload.quan_ly_id ?? hostel.manager?.id ?? null,
                          name:
                            updated?.manager?.name ||
                            hostel.manager?.name ||
                            "Chưa phân công",
                        },
                      }
                      : hostel
                  )
                );

                if (selectedHostel?.id === hostelId) {
                  setSelectedHostel(prev => ({
                    ...prev,
                    name: updated?.ten_toa || payload.ten_toa,
                    address: updated?.dia_chi || payload.dia_chi,
                  }));
                }
                alert("Cập nhật khu trọ thành công!");
              } catch (error) {
                console.error("Failed to update hostel:", error);
                alert("Không thể cập nhật khu trọ. Vui lòng thử lại.");
              }
            }}
          />
        );
      default:
        return (
          <OverviewPage selectedHostel={selectedHostel} chartData={chartData} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        selectedHostel={selectedHostel}
        hostels={hostelList}
        searchTerm={searchTerm}
        onHostelChange={setSelectedHostel}
        onSearchChange={setSearchTerm}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar
          activeTab={activeTab}
          selectedHostel={selectedHostel}
          occupiedRoomsCount={occupiedRoomsCount}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 overflow-auto bg-white">
          <div className="p-6 lg:p-8">
            <div className="transition-all duration-500 ease-out transform animate-in fade-in-0 slide-in-from-bottom-4">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
      {/* Dialogs for notifications */}
      {/* Admin chỉ xem thông báo, không thể nhắn tin */}
      <NotificationViewDialog
        isOpen={dialogState.open && dialogState.kind === "chat"}
        onOpenChange={o => setDialogState(prev => ({ ...prev, open: o }))}
        notification={dialogState.data}
        selectedHostel={selectedHostel}
      />
      <InvoiceInfoDialog
        isOpen={dialogState.open && dialogState.kind === "invoice"}
        onOpenChange={o => setDialogState(prev => ({ ...prev, open: o }))}
        invoice={dialogState.data}
      />
    </div>
  );
}
