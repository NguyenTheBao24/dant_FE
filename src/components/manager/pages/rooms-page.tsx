import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import {
    Home,
    Users,
    DollarSign,
    Square,
    Calendar,
    Plus,
    Edit,
    Eye
} from "lucide-react"

interface RoomsPageProps {
    selectedHostel: any
}

export function RoomsPage({ selectedHostel }: RoomsPageProps) {
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (selectedHostel?.can_ho) {
            setRooms(selectedHostel.can_ho)
            setIsLoading(false)
        } else {
            setRooms([])
            setIsLoading(false)
        }
    }, [selectedHostel])

    const getRoomType = (dienTich: number, giaThue: number) => {
        if (dienTich >= 45 || giaThue >= 6000000) {
            return { type: 'VIP', color: 'bg-purple-100 text-purple-800' }
        } else if (dienTich >= 30 || giaThue >= 4000000) {
            return { type: 'Đôi', color: 'bg-blue-100 text-blue-800' }
        }
        return { type: 'Đơn', color: 'bg-green-100 text-green-800' }
    }

    const getStatusBadge = (trangThai: string) => {
        switch (trangThai) {
            case 'da_thue':
            case 'occupied':
                return <Badge className="bg-red-100 text-red-800">Đã thuê</Badge>
            case 'trong':
            case 'available':
                return <Badge className="bg-green-100 text-green-800">Trống</Badge>
            case 'sua_chua':
            case 'maintenance':
                return <Badge className="bg-yellow-100 text-yellow-800">Sửa chữa</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{trangThai}</Badge>
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn khu trọ</h3>
                    <p className="text-gray-500">Vui lòng chọn một khu trọ để xem danh sách phòng</p>
                </div>
            </div>
        )
    }

    const occupiedRooms = rooms.filter((room: any) =>
        room.trang_thai === 'da_thue' || room.trang_thai === 'occupied'
    ).length

    const availableRooms = rooms.filter((room: any) =>
        room.trang_thai === 'trong' || room.trang_thai === 'available'
    ).length

    const maintenanceRooms = rooms.filter((room: any) =>
        room.trang_thai === 'sua_chua' || room.trang_thai === 'maintenance'
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Quản lý phòng
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Danh sách phòng của khu trọ <span className="font-semibold">
                            {selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'Không có tên'}
                        </span>
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm phòng mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Tổng phòng</p>
                                <p className="text-2xl font-bold text-blue-700">{rooms.length}</p>
                            </div>
                            <Home className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Phòng trống</p>
                                <p className="text-2xl font-bold text-green-700">{availableRooms}</p>
                            </div>
                            <Home className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Phòng đã thuê</p>
                                <p className="text-2xl font-bold text-red-700">{occupiedRooms}</p>
                            </div>
                            <Users className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Đang sửa chữa</p>
                                <p className="text-2xl font-bold text-yellow-700">{maintenanceRooms}</p>
                            </div>
                            <Home className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rooms Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))
                ) : rooms.length === 0 ? (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có phòng nào</h3>
                                <p className="text-gray-500 mb-4">Khu trọ này chưa có phòng nào được tạo</p>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tạo phòng đầu tiên
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    rooms.map((room: any) => {
                        const roomType = getRoomType(room.dien_tich, room.gia_thue)
                        return (
                            <Card key={room.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{room.so_can || `Phòng ${room.id}`}</CardTitle>
                                        <Badge className={roomType.color}>{roomType.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Diện tích:</span>
                                        <span className="font-medium">{room.dien_tich}m²</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Giá thuê:</span>
                                        <span className="font-medium text-green-600">
                                            {formatCurrency(room.gia_thue)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        {getStatusBadge(room.trang_thai)}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Xem
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Edit className="h-3 w-3 mr-1" />
                                            Sửa
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
