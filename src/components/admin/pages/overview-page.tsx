import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { HostelInfoCard } from "@/components/admin/dashboard/hostel-info-card";
import { RevenueCharts } from "@/components/admin/dashboard/revenue-charts";
import { RevenueByType } from "@/components/admin/dashboard/revenue-by-type";
import { RoomRevenueTable } from "@/components/admin/dashboard/room-revenue-table";
import { useOverviewData } from "@/hooks/useOverviewData";
import { DollarSign, Users, Building2 } from "lucide-react";

interface OverviewPageProps {
  selectedHostel: any;
  occupiedRoomsCount: number;
  chartData?: any;
}

export function OverviewPage({
  selectedHostel,
  occupiedRoomsCount,
}: OverviewPageProps) {
  const {
    roomRevenues,
    totalMonthlyRevenue,
    revenueByRoomType,
    monthlyStats,
    currentMonthExpenses,
    tenantStats,
    roomStats,
    isLoading,
  } = useOverviewData(selectedHostel, occupiedRoomsCount);

  if (!selectedHostel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Chưa chọn tòa nhà
          </h3>
          <p className="text-gray-500">
            Vui lòng chọn một tòa nhà để xem tổng quan
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Đang tải dữ liệu
          </h3>
          <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-600">
            Tổng quan khu trọ
          </h2>
          <p className="text-gray-600 mt-1">
            Thống kê tổng quan khu trọ{" "}
            <span className="font-semibold">{selectedHostel.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
            <p className="text-sm font-medium">
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Thông tin cơ bản tòa nhà */}
      <HostelInfoCard selectedHostel={selectedHostel} roomStats={roomStats} />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng khách thuê"
          value={tenantStats.total.toString()}
          change={`${tenantStats.active} đang hoạt động`}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-100 to-blue-200"
        />
        <StatsCard
          title="Doanh thu tháng"
          value={totalMonthlyRevenue.toLocaleString("vi-VN") + "₫"}
          change={`Từ ${roomStats.occupied} phòng đã thuê`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-100 to-green-200"
        />
        <StatsCard
          title="Chi phí tháng"
          value={(currentMonthExpenses || 0).toLocaleString("vi-VN") + "₫"}
          change={`Tính từ bảng chi_tieu`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-orange-100 to-orange-200"
        />
        <StatsCard
          title="Tỷ lệ lấp đầy"
          value={`${roomStats.occupancyRate}%`}
          change={`${roomStats.occupied}/${roomStats.total} phòng`}
          icon={Building2}
          gradient="bg-gradient-to-br from-purple-100 to-purple-200"
        />
        <StatsCard
          title="Tài khoản đã cấp"
          value={tenantStats.withAccount.toString()}
          change={`${tenantStats.withoutAccount} chưa cấp`}
          icon={Users}
          gradient="bg-gradient-to-br from-slate-100 to-slate-200"
        />
      </div>

      {/* Charts */}
      <RevenueCharts monthlyStats={monthlyStats} />

      {/* Doanh thu theo loại phòng */}
      <RevenueByType revenueByRoomType={revenueByRoomType} />

      {/* Bảng doanh thu chi tiết theo phòng */}
      <RoomRevenueTable roomRevenues={roomRevenues} isLoading={isLoading} />
    </div>
  );
}
