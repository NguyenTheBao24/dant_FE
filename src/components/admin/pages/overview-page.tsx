import { StatsCard } from "@/components/admin/dashboard/stats-card"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, AreaChart, Area,
    ResponsiveContainer, Legend
} from "recharts"
import {
    DollarSign, Users, TrendingUp, Building2, Calendar, Home,
    MapPin, Phone, Mail, User
} from "lucide-react"
import { useState, useEffect } from "react"
import { listCanHoByToaNha } from "@/services/can-ho.service"
import { listKhachThue } from "@/services/khach-thue.service"
import { listHopDongByToaNha } from "@/services/hop-dong.service"

interface RoomRevenue {
    roomNumber: string
    roomType: string
    tenantName: string
    monthlyRent: number
    monthsRented: number
    totalRevenue: number
    moveInDate: string | null
    status: string
}

interface RevenueByRoomType {
    roomType: string
    count: number
    totalRevenue: number
    avgRevenue: number
}

interface MonthlyStats {
    month: string
    revenue: number
    expenses: number
    profit: number
    occupancy: number
}

interface TenantStats {
    total: number
    active: number
    inactive: number
    withAccount: number
    withoutAccount: number
}

interface RoomStats {
    total: number
    occupied: number
    available: number
    maintenance: number
    occupancyRate: number
}

interface OverviewPageProps {
    selectedHostel: any
    occupiedRoomsCount: number
}

export function OverviewPage({ selectedHostel, occupiedRoomsCount }: OverviewPageProps) {
    const [roomRevenues, setRoomRevenues] = useState<RoomRevenue[]>([])
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0)
    const [revenueByRoomType, setRevenueByRoomType] = useState<RevenueByRoomType[]>([])
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
    const [tenantStats, setTenantStats] = useState<TenantStats>({
        total: 0,
        active: 0,
        inactive: 0,
        withAccount: 0,
        withoutAccount: 0
    })
    const [roomStats, setRoomStats] = useState<RoomStats>({
        total: 0,
        occupied: 0,
        available: 0,
        maintenance: 0,
        occupancyRate: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    // Load data khi selectedHostel thay đổi
    useEffect(() => {
        const loadOverviewData = async () => {
            if (!selectedHostel?.id) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            try {
                // Load tất cả dữ liệu cần thiết
                const [canHoData, khachThueData, hostelContracts] = await Promise.all([
                    listCanHoByToaNha(selectedHostel.id),
                    listKhachThue(),
                    listHopDongByToaNha(selectedHostel.id)
                ])

                // Lọc dữ liệu theo tòa nhà được chọn
                const hostelCanHo = canHoData

                // Lấy danh sách khách thuê thông qua hợp đồng
                const hostelTenantIds = [...new Set(hostelContracts.map((contract: any) => contract.khach_thue_id))]
                const hostelTenants = khachThueData.filter((tenant: any) =>
                    hostelTenantIds.includes(tenant.id)
                )

                // Tính toán thống kê phòng - sử dụng logic giống Dashboard
                const activeContractsCount = hostelContracts.filter((contract: any) => contract.trang_thai === 'hieu_luc').length
                const totalRooms = hostelCanHo.length
                const maintenanceRooms = hostelCanHo.filter((room: any) => room.trang_thai === 'sua_chua').length
                const occupiedRooms = activeContractsCount
                const availableRooms = totalRooms - occupiedRooms - maintenanceRooms

                const roomStatsData = {
                    total: totalRooms,
                    occupied: occupiedRooms,
                    available: Math.max(0, availableRooms), // Đảm bảo không âm
                    maintenance: maintenanceRooms,
                    occupancyRate: totalRooms > 0 ?
                        Math.round((occupiedRooms / totalRooms) * 100) : 0
                }
                setRoomStats(roomStatsData)

                // Tính toán thống kê khách thuê
                const activeTenants = hostelTenants.filter((tenant: any) => {
                    // Kiểm tra tenant có hợp đồng hiệu lực không
                    const activeContract = hostelContracts.find((contract: any) =>
                        contract.khach_thue_id === tenant.id && contract.trang_thai === 'hieu_luc'
                    )
                    return activeContract
                })

                const tenantStatsData = {
                    total: hostelTenants.length,
                    active: activeTenants.length,
                    inactive: hostelTenants.length - activeTenants.length,
                    withAccount: hostelTenants.filter((tenant: any) => tenant.tai_khoan_id).length,
                    withoutAccount: hostelTenants.filter((tenant: any) => !tenant.tai_khoan_id).length
                }
                setTenantStats(tenantStatsData)

                // Tính toán doanh thu theo phòng
                const roomRevenueData: RoomRevenue[] = []
                let totalRevenue = 0

                // Chỉ tính doanh thu từ các hợp đồng hiệu lực
                const activeContracts = hostelContracts.filter((contract: any) => contract.trang_thai === 'hieu_luc')

                activeContracts.forEach((contract: any) => {
                    const tenant = contract.khach_thue || hostelTenants.find((t: any) => t.id === contract.khach_thue_id)
                    const room = contract.can_ho || hostelCanHo.find((r: any) => r.id === contract.can_ho_id)

                    if (tenant && room) {
                        const monthlyRent = room.gia_thue || 0

                        // Tính số tháng thuê từ ngày bắt đầu đến hiện tại
                        const startDate = new Date(contract.ngay_bat_dau)
                        const currentDate = new Date()
                        const monthsRented = Math.max(1, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))

                        const totalRoomRevenue = monthlyRent * monthsRented
                        totalRevenue += monthlyRent // Chỉ tính doanh thu tháng hiện tại

                        roomRevenueData.push({
                            roomNumber: room.so_can || `P${room.id}`,
                            roomType: room.loai_can_ho || 'Phòng đơn',
                            tenantName: tenant.ho_ten || 'Chưa cập nhật',
                            monthlyRent,
                            monthsRented,
                            totalRevenue: totalRoomRevenue,
                            moveInDate: contract.ngay_bat_dau,
                            status: 'active' // Chỉ hiển thị các hợp đồng hiệu lực
                        })
                    }
                })

                setRoomRevenues(roomRevenueData)
                setTotalMonthlyRevenue(totalRevenue)

                // Tính toán doanh thu theo loại phòng
                const revenueByType: { [key: string]: RevenueByRoomType } = {}

                // Tính cho tất cả phòng (kể cả phòng trống)
                hostelCanHo.forEach(room => {
                    const roomType = room.loai_can_ho || 'Phòng đơn'
                    if (!revenueByType[roomType]) {
                        revenueByType[roomType] = {
                            roomType,
                            count: 0,
                            totalRevenue: 0,
                            avgRevenue: 0
                        }
                    }
                    revenueByType[roomType].count++

                    // Chỉ tính doanh thu cho phòng đã thuê
                    if (room.trang_thai === 'da_thue') {
                        const roomRevenue = roomRevenueData.find(r => r.roomNumber === room.so_can)
                        if (roomRevenue) {
                            revenueByType[roomType].totalRevenue += roomRevenue.monthlyRent
                        }
                    }
                })

                // Tính trung bình
                Object.values(revenueByType).forEach(type => {
                    type.avgRevenue = type.count > 0 ? type.totalRevenue / type.count : 0
                })

                setRevenueByRoomType(Object.values(revenueByType))

                // Tạo dữ liệu thống kê hàng tháng (12 tháng gần nhất)
                const monthlyStatsData: MonthlyStats[] = []
                const currentDate = new Date()

                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
                    const monthName = date.toLocaleDateString('vi-VN', { month: 'short' })

                    // Tính doanh thu giả định (có thể thay thế bằng dữ liệu thực)
                    const monthlyRevenue = totalRevenue + Math.random() * 1000000
                    const monthlyExpenses = monthlyRevenue * 0.3 // Giả định chi phí = 30% doanh thu

                    monthlyStatsData.push({
                        month: monthName,
                        revenue: Math.round(monthlyRevenue),
                        expenses: Math.round(monthlyExpenses),
                        profit: Math.round(monthlyRevenue - monthlyExpenses),
                        occupancy: roomStatsData.occupancyRate
                    })
                }
                setMonthlyStats(monthlyStatsData)

            } catch (error) {
                console.error('Failed to load overview data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadOverviewData()
    }, [selectedHostel?.id, occupiedRoomsCount])

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn tòa nhà</h3>
                    <p className="text-gray-500">Vui lòng chọn một tòa nhà để xem tổng quan</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu</h3>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        )
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
                        Thống kê tổng quan khu trọ <span className="font-semibold">{selectedHostel.name}</span>
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                        <p className="text-sm font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Thông tin cơ bản tòa nhà */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-800">
                        <MapPin className="mr-2 h-5 w-5" />
                        Thông tin tòa nhà
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="mb-2">
                                <h4 className="font-semibold text-gray-700">Thông tin quản lý</h4>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{selectedHostel.manager?.name || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{selectedHostel.manager?.phone || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{selectedHostel.manager?.email || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{selectedHostel.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Thống kê cơ bản</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Tổng số phòng:</span>
                                    <span className="font-medium">{roomStats.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phòng đã thuê:</span>
                                    <span className="font-medium text-green-600">{roomStats.occupied}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phòng trống:</span>
                                    <span className="font-medium text-blue-600">{roomStats.available}</span>
                                </div>
                                {roomStats.maintenance > 0 && (
                                    <div className="flex justify-between">
                                        <span>Phòng sửa chữa:</span>
                                        <span className="font-medium text-orange-600">{roomStats.maintenance}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Tỷ lệ lấp đầy:</span>
                                    <span className="font-medium text-purple-600">{roomStats.occupancyRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Trạng thái & Khuyến nghị</h4>
                            <div className="space-y-2">
                                <Badge
                                    variant={roomStats.occupancyRate >= 80 ? "default" : roomStats.occupancyRate >= 60 ? "secondary" : "destructive"}
                                    className="w-full justify-center"
                                >
                                    {roomStats.occupancyRate >= 80 ? 'Hoạt động tốt' :
                                        roomStats.occupancyRate >= 60 ? 'Hoạt động bình thường' : 'Cần cải thiện'}
                                </Badge>
                                <div className="text-xs text-gray-500 text-center space-y-1">
                                    <div>{roomStats.available} phòng còn trống</div>
                                    {roomStats.maintenance > 0 && (
                                        <div className="text-orange-600">{roomStats.maintenance} phòng đang sửa chữa</div>
                                    )}
                                    {roomStats.occupancyRate < 60 && (
                                        <div className="text-red-600 font-medium">Cần tăng cường marketing</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                    value={totalMonthlyRevenue.toLocaleString('vi-VN') + '₫'}
                    change={`Từ ${roomStats.occupied} phòng đã thuê`}
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-green-100 to-green-200"
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
                    gradient="bg-gradient-to-br from-orange-100 to-orange-200"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Doanh thu & Chi phí theo tháng">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [
                                    `${Number(value).toLocaleString('vi-VN')}₫`,
                                    name === 'revenue' ? 'Doanh thu' : name === 'expenses' ? 'Chi phí' : 'Lợi nhuận'
                                ]}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                            <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Phân bổ doanh thu theo loại phòng">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueByRoomType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="totalRevenue"
                            >
                                {revenueByRoomType.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')}₫`} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Chi tiết theo loại phòng */}
            {revenueByRoomType.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                            Doanh thu theo loại phòng
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Phân tích doanh thu chi tiết theo từng loại phòng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {revenueByRoomType.map((type, index) => (
                                <div key={type.roomType} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{type.roomType}</h3>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {type.count} phòng
                                        </Badge>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        {type.totalRevenue.toLocaleString('vi-VN')}₫
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Trung bình: {type.avgRevenue.toLocaleString('vi-VN')}₫/phòng
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${(type.totalRevenue / Math.max(...revenueByRoomType.map(t => t.totalRevenue))) * 100}%`,
                                                backgroundColor: COLORS[index % COLORS.length]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bảng doanh thu chi tiết theo phòng */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                                <Home className="mr-2 h-5 w-5 text-green-600" />
                                Doanh thu chi tiết theo phòng
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                Thống kê doanh thu hàng tháng của từng phòng đã thuê
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            {roomRevenues.length} phòng đã thuê
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Đang tải dữ liệu doanh thu...</p>
                        </div>
                    ) : roomRevenues.length === 0 ? (
                        <div className="p-8 text-center">
                            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có phòng nào được thuê</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-b-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                                        <TableHead className="font-semibold text-gray-900 py-4">Số phòng</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Loại phòng</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Khách thuê</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Giá thuê/tháng</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Số tháng thuê</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Tổng doanh thu</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Ngày vào</TableHead>
                                        <TableHead className="font-semibold text-gray-900 py-4">Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roomRevenues.map((room, index) => (
                                        <TableRow key={room.roomNumber} className={`hover:bg-green-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <TableCell className="font-semibold text-gray-900 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                        <Home className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <span>{room.roomNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                                    {room.roomType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-medium text-gray-900">{room.tenantName}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-semibold text-green-600">
                                                    {room.monthlyRent.toLocaleString('vi-VN')}₫
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-700 font-medium">{room.monthsRented}</span>
                                                    <span className="text-gray-500 ml-1">tháng</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-bold text-green-700 text-lg">
                                                    {room.totalRevenue.toLocaleString('vi-VN')}₫
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-gray-600">
                                                    {room.moveInDate ? new Date(room.moveInDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge
                                                    variant={room.status === "active" ? "default" : "secondary"}
                                                    className={room.status === "active"
                                                        ? "bg-green-100 text-green-800 border-green-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                                    }
                                                >
                                                    {room.status === "active" ? "Đang thuê" : "Hết hạn"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}