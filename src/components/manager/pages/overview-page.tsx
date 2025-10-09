import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import {
    Users,
    Home,
    DollarSign,
    TrendingUp,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react"

interface OverviewPageProps {
    selectedHostel: any
    occupiedRoomsCount: number
}

export function OverviewPage({ selectedHostel, occupiedRoomsCount }: OverviewPageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeContracts: 0,
        pendingPayments: 0,
        monthlyRevenue: 0
    })

    useEffect(() => {
        // Simulate data loading
        const loadData = async () => {
            setIsLoading(true)
            try {
                // Mock data - replace with actual API calls
                await new Promise(resolve => setTimeout(resolve, 1000))
                setStats({
                    totalTenants: 45,
                    activeContracts: 42,
                    pendingPayments: 8,
                    monthlyRevenue: 12500000
                })
            } catch (error) {
                console.error('Error loading overview data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (selectedHostel) {
            loadData()
        }
    }, [selectedHostel])

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn khu trọ</h3>
                    <p className="text-gray-500">Vui lòng chọn một khu trọ để xem tổng quan</p>
                </div>
            </div>
        )
    }

    const totalRooms = selectedHostel.can_ho?.length || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Tổng quan khu trọ
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Quản lý và theo dõi hoạt động của khu trọ <span className="font-semibold">{selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'Không có tên'}</span>
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Tổng khách thuê</p>
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
                                <p className="text-sm font-medium text-green-600">Doanh thu tháng</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {isLoading ? "..." : stats.monthlyRevenue.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    <TrendingUp className="h-3 w-3 inline mr-1" />
                                    +12% so với tháng trước
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
                                <p className="text-sm font-medium text-purple-600">Tỷ lệ lấp đầy</p>
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
                                <p className="text-sm font-medium text-orange-600">Chờ thanh toán</p>
                                <p className="text-2xl font-bold text-orange-700">
                                    {isLoading ? "..." : stats.pendingPayments}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                    Cần theo dõi
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            Thao tác nhanh
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                            <Users className="mr-2 h-4 w-4" />
                            Thêm khách thuê mới
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Ghi nhận thanh toán
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <Home className="mr-2 h-4 w-4" />
                            Cập nhật trạng thái phòng
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                            Thông báo gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-800">
                                        Phòng A101 chưa thanh toán tiền thuê tháng này
                                    </p>
                                    <p className="text-xs text-yellow-600 mt-1">2 ngày trước</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-800">
                                        Hợp đồng mới được ký kết - Phòng B205
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">1 tuần trước</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hostel Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin khu trọ</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Thông tin cơ bản</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tên khu trọ:</span>
                                    <span className="font-medium">{selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'Không có tên'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Địa chỉ:</span>
                                    <span className="font-medium">{selectedHostel.dia_chi || selectedHostel.address || 'Không có địa chỉ'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="font-medium">{selectedHostel.so_dien_thoai || selectedHostel.phone || 'Không có số điện thoại'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Thống kê phòng</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng số phòng:</span>
                                    <span className="font-medium">{totalRooms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phòng đã thuê:</span>
                                    <span className="font-medium text-green-600">{occupiedRoomsCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phòng trống:</span>
                                    <span className="font-medium text-blue-600">{totalRooms - occupiedRoomsCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tỷ lệ lấp đầy:</span>
                                    <span className="font-medium text-purple-600">{occupancyRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
