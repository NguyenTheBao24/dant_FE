import { StatsCard } from "@/components/admin/dashboard/stats-card"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { DollarSign, Users, TrendingUp, Building2, Calendar, Home } from "lucide-react"
import { useState, useEffect } from "react"

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
}

interface OverviewPageProps {
    selectedHostel: any
    chartData: {
        revenue: any[]
        expenseCategories: any[]
    }
}

export function OverviewPage({ selectedHostel, chartData }: OverviewPageProps) {
    const [roomRevenues, setRoomRevenues] = useState<RoomRevenue[]>([])
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0)
    const [revenueByRoomType, setRevenueByRoomType] = useState<RevenueByRoomType[]>([])
    const [isLoading, setIsLoading] = useState(true)


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-blue-600">
                        Tổng quan
                    </h2>
                    <p className="text-gray-600">Thống kê tổng quan khu trọ {selectedHostel?.name || 'Chưa chọn tòa nhà'}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Tổng khách thuê"
                    value="24"
                    change="+12% so với tháng trước"
                    icon={Users}
                    gradient="bg-gradient-to-br from-blue-100 to-blue-200"
                />
                <StatsCard
                    title="Doanh thu tháng"
                    value={totalMonthlyRevenue.toLocaleString('vi-VN') + '₫'}
                    change="+8% so với tháng trước"
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-green-100 to-green-200"
                />
                <StatsCard
                    title="Tỷ lệ lấp đầy"
                    value={`${selectedHostel?.rooms ? Math.round(((selectedHostel?.occupancy || 0) / selectedHostel.rooms) * 100) : 0}%`}
                    change="+5% so với tháng trước"
                    icon={Building2}
                    gradient="bg-gradient-to-br from-purple-100 to-purple-200"
                />
                <StatsCard
                    title="Tăng trưởng"
                    value="+15.2%"
                    change="Tăng đều trong 3 tháng"
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-orange-100 to-orange-200"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Xu hướng doanh thu">
                    <LineChart data={chartData.revenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="expense" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ChartCard>

                <ChartCard title="Phân bổ chi phí">
                    <PieChart>
                        <Pie
                            data={chartData.expenseCategories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.expenseCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                    </PieChart>
                </ChartCard>
            </div>

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

            {/* Thống kê doanh thu theo loại phòng */}
            {revenueByRoomType.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                            Doanh thu theo loại phòng
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Phân tích doanh thu theo từng loại phòng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {revenueByRoomType.map((type) => (
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
                                        Trung bình: {(type.totalRevenue / type.count).toLocaleString('vi-VN')}₫/phòng
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
