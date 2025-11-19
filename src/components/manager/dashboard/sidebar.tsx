import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { LogoutButton } from "@/components/manager/dashboard/logout-button";
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  FileText,
  Settings,
  Home,
  User,
  Bell,
} from "lucide-react";

interface ManagerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedHostel: any;
  occupiedRoomsCount: number;
  onLogout: () => void;
}

export function ManagerSidebar({
  activeTab,
  onTabChange,
  selectedHostel,
  occupiedRoomsCount,
  onLogout,
}: ManagerSidebarProps) {
  const totalRooms = selectedHostel?.can_ho?.length || 0;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0;

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Manager Dashboard</h2>
        <p className="text-sm text-gray-600">Quản lý khu trọ</p>
      </div>

      {/* Hostel Info Card */}
      {selectedHostel && (
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Thông tin khu trọ</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên:</span>
                <span className="font-medium">
                  {selectedHostel.ten_toa ||
                    selectedHostel.ten ||
                    selectedHostel.name ||
                    "Không có tên"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="font-medium truncate ml-2">
                  {selectedHostel.dia_chi ||
                    selectedHostel.address ||
                    "Không có địa chỉ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng phòng:</span>
                <span className="font-medium">{totalRooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đã thuê:</span>
                <span className="font-medium text-green-600">
                  {occupiedRoomsCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tỷ lệ:</span>
                <span className="font-medium text-blue-600">
                  {occupancyRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="space-y-2">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${
            activeTab === "overview"
              ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : "hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => onTabChange("overview")}
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          <span className="font-semibold">Tổng quan</span>
        </Button>

        <Button
          variant={activeTab === "tenants" ? "default" : "ghost"}
          className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${
            activeTab === "tenants"
              ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : "hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => onTabChange("tenants")}
        >
          <Users className="mr-3 h-5 w-5" />
          <span className="font-semibold">Quản lý khách thuê</span>
        </Button>

        <Button
          variant={activeTab === "rooms" ? "default" : "ghost"}
          className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${
            activeTab === "rooms"
              ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : "hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => onTabChange("rooms")}
        >
          <Home className="mr-3 h-5 w-5" />
          <span className="font-semibold">Quản lý phòng</span>
        </Button>

        <Button
          variant={activeTab === "invoices" ? "default" : "ghost"}
          className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${
            activeTab === "invoices"
              ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : "hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => onTabChange("invoices")}
        >
          <FileText className="mr-3 h-5 w-5" />
          <span className="font-semibold">Quản lý hóa đơn</span>
        </Button>

        <Button
          variant={activeTab === "notifications" ? "default" : "ghost"}
          className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${
            activeTab === "notifications"
              ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
              : "hover:bg-gray-100 hover:shadow-md"
          }`}
          onClick={() => onTabChange("notifications")}
        >
          <Bell className="mr-3 h-5 w-5" />
          <span className="font-semibold">Thông báo</span>
        </Button>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-200">
        <LogoutButton onLogout={onLogout} />
      </div>
    </div>
  );
}
