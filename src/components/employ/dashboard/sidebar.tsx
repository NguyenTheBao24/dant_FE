import { Button } from "@/components/admin/ui/button"
import { Card, CardContent } from "@/components/admin/ui/card"
import {
    LayoutDashboard,
    FileText,
    Receipt,
    User,
    LogOut,
    UserCircle,
    Bell,
    Home
} from "lucide-react"

interface EmploySidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
    userInfo: any
    onLogout: () => void
}

export function EmploySidebar({
    activeTab,
    onTabChange,
    userInfo,
    onLogout
}: EmploySidebarProps) {
    // const activeContracts = userInfo?.hop_dong?.filter((contract: any) => 
    //     contract.trang_thai === 'hieu_luc'
    // ).length || 0
    const activeContracts = 0 // Tạm thời set = 0

    return (
        <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <UserCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Khách Thuê Dashboard</h2>
                <p className="text-sm text-gray-600">Quản lý thông tin cá nhân</p>
            </div>

            {/* User Info Card */}
            {userInfo && (
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                            <User className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-green-800">Thông tin cá nhân</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Họ tên:</span>
                                <span className="font-medium">{userInfo.ho_ten || 'Không có tên'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">SĐT:</span>
                                <span className="font-medium">{userInfo.sdt || 'Không có SĐT'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium truncate ml-2">{userInfo.email || 'Không có email'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hợp đồng:</span>
                                <span className="font-medium text-green-600">{activeContracts}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="space-y-2">
                <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "overview"
                        ? "bg-green-600 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-100 hover:shadow-md"
                        }`}
                    onClick={() => onTabChange("overview")}
                >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Tổng quan</span>
                </Button>

                <Button
                    variant={activeTab === "invoices" ? "default" : "ghost"}
                    className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "invoices"
                        ? "bg-green-600 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-100 hover:shadow-md"
                        }`}
                    onClick={() => onTabChange("invoices")}
                >
                    <Receipt className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Hóa đơn</span>
                </Button>

                <Button
                    variant={activeTab === "room-info" ? "default" : "ghost"}
                    className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "room-info"
                        ? "bg-green-600 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-100 hover:shadow-md"
                        }`}
                    onClick={() => onTabChange("room-info")}
                >
                    <Home className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Thông tin phòng</span>
                </Button>

                <Button
                    variant={activeTab === "notifications" ? "default" : "ghost"}
                    className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "notifications"
                        ? "bg-green-600 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-100 hover:shadow-md"
                        }`}
                    onClick={() => onTabChange("notifications")}
                >
                    <Bell className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Thông báo</span>
                </Button>

                <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "profile"
                        ? "bg-green-600 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-100 hover:shadow-md"
                        }`}
                    onClick={() => onTabChange("profile")}
                >
                    <User className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Hồ sơ cá nhân</span>
                </Button>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200">
                <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl"
                    onClick={onLogout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-semibold">Đăng xuất</span>
                </Button>
            </div>
        </div>
    )
}
