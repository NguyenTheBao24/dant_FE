import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerSidebar } from "@/components/manager/dashboard/sidebar";
import { OverviewPage } from "@/components/manager/pages/overview-page";
import { TenantsPage } from "@/components/manager/pages/tenants-page";
import { RoomsPage } from "@/components/manager/pages/rooms-page";
import { NotificationsPage } from "@/components/manager/pages/notifications-page";
import { InvoicesPage } from "@/components/manager/pages/invoices-page";

interface ManagerDashboardProps {
  selectedHostel?: any;
}

export function ManagerDashboard({ selectedHostel }: ManagerDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [occupiedRoomsCount, setOccupiedRoomsCount] = useState(0);

  useEffect(() => {
    if (selectedHostel?.can_ho) {
      // Count occupied rooms
      const occupied = selectedHostel.can_ho.filter(
        (room: any) =>
          room.trang_thai === "da_thue" || room.trang_thai === "occupied"
      ).length;
      setOccupiedRoomsCount(occupied);
    }
  }, [selectedHostel]);

  const handleLogout = () => {
    // Show confirmation
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Clear any stored authentication data
      localStorage.removeItem("manager_token");
      localStorage.removeItem("manager_user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Show success message
      alert("Đăng xuất thành công!");

      // Navigate to login page
      navigate("/auth/login");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPage
            selectedHostel={selectedHostel}
            occupiedRoomsCount={occupiedRoomsCount}
          />
        );
      case "tenants":
        return <TenantsPage selectedHostel={selectedHostel} />;
      case "rooms":
        return <RoomsPage selectedHostel={selectedHostel} />;
      case "notifications":
        return <NotificationsPage selectedHostel={selectedHostel} />;
      case "invoices":
        return <InvoicesPage selectedHostel={selectedHostel} />;
      case "contracts":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Quản lý hợp đồng
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển</p>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Báo cáo
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Cài đặt
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển</p>
            </div>
          </div>
        );
      default:
        return (
          <OverviewPage
            selectedHostel={selectedHostel}
            occupiedRoomsCount={occupiedRoomsCount}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ManagerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedHostel={selectedHostel}
        occupiedRoomsCount={occupiedRoomsCount}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">{renderActiveTab()}</div>
      </div>
    </div>
  );
}
