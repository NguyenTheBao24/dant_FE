import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { Home, Calendar } from "lucide-react"

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

interface RoomRevenueTableProps {
    roomRevenues: RoomRevenue[]
    isLoading: boolean
}

export function RoomRevenueTable({ roomRevenues, isLoading }: RoomRevenueTableProps) {
    return (
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
    )
}
