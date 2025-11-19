import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
// import { Button } from "@/components/admin/ui/button"
import { listHopDongByToaNha } from "@/services/hop-dong.service";
// @ts-ignore
import { getThongBaoByToaNha } from "@/services/thong-bao.service";
// @ts-ignore
import {
  tinhDoanhThuThang,
  countHoaDonChuaThanhToanTrongThang,
} from "@/services/hoa-don.service";
// removed quick dialogs
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface OverviewPageProps {
  selectedHostel: any;
  occupiedRoomsCount: number;
}

export function OverviewPage({
  selectedHostel,
  occupiedRoomsCount,
}: OverviewPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeContracts: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedHostel?.id) return;

      setIsLoading(true);
      try {
        console.log("Loading overview data for toa nha ID:", selectedHostel.id);

        // Load hợp đồng từ tòa nhà
        const hopDongList = await listHopDongByToaNha(selectedHostel.id);
        console.log("Found hop dong list for overview:", hopDongList);

        // Tính toán stats từ dữ liệu thực
        const totalTenants = Array.from(
          new Set(
            (hopDongList || []).map(
              (hd: any) => hd.khach_thue_id || hd.khach_thue?.id
            )
          )
        ).length;
        const activeContracts = hopDongList.filter(
          (hopDong: any) => hopDong.trang_thai === "hieu_luc"
        ).length;

        // Doanh thu tháng (thực tế) từ bảng hóa đơn
        const now = new Date();
        const monthlyRevenue = await tinhDoanhThuThang(
          selectedHostel.id,
          now.getFullYear(),
          now.getMonth() + 1
        );

        // Hóa đơn chưa thanh toán trong tháng
        const pendingPayments = await countHoaDonChuaThanhToanTrongThang(
          selectedHostel.id,
          now.getFullYear(),
          now.getMonth() + 1
        );

        console.log("Calculated stats:", {
          totalTenants,
          activeContracts,
          pendingPayments,
          monthlyRevenue,
        });

        setStats({
          totalTenants,
          activeContracts,
          pendingPayments,
          monthlyRevenue,
        });

        // Thông báo gần đây
        const tb = await getThongBaoByToaNha(selectedHostel.id);
        setRecentNotifications((tb || []).slice(0, 2));
      } catch (error) {
        console.error("Error loading overview data:", error);
        setStats({
          totalTenants: 0,
          activeContracts: 0,
          pendingPayments: 0,
          monthlyRevenue: 0,
        });
        setRecentNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedHostel) {
      loadData();
    }
  }, [selectedHostel]);

  if (!selectedHostel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Chưa chọn khu trọ
          </h3>
          <p className="text-gray-500">
            Vui lòng chọn một khu trọ để xem tổng quan
          </p>
        </div>
      </div>
    );
  }

  const totalRooms = selectedHostel.can_ho?.length || 0;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Tổng quan khu trọ
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi hoạt động của khu trọ{" "}
            <span className="font-semibold">
              {selectedHostel.ten_toa ||
                selectedHostel.ten ||
                selectedHostel.name ||
                "Không có tên"}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("vi-VN")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Tổng khách thuê
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {isLoading ? "..." : stats.totalTenants}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.activeContracts} hợp đồng hoạt động
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Doanh thu tháng
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {isLoading
                    ? "..."
                    : stats.monthlyRevenue.toLocaleString("vi-VN")}
                  ₫
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Từ hóa đơn tháng này
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Tỷ lệ lấp đầy
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {occupancyRate}%
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {occupiedRoomsCount}/{totalRooms} phòng
                </p>
              </div>
              <Home className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Chờ thanh toán
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {isLoading ? "..." : stats.pendingPayments}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Hóa đơn chưa thanh toán trong tháng
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              Thông báo gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có thông báo</p>
              ) : (
                recentNotifications.map((tb: any) => (
                  <div
                    key={tb.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      tb.trang_thai === "chua_xu_ly"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    {tb.trang_thai === "chua_xu_ly" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {tb.tieu_de}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Phòng {tb.can_ho?.so_can || "N/A"} •{" "}
                        {new Date(tb.ngay_tao).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
