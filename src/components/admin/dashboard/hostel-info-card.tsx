import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { MapPin, User, Phone, Mail } from "lucide-react"

interface HostelInfoCardProps {
    selectedHostel: any
    roomStats: {
        total: number
        occupied: number
        available: number
        maintenance: number
        occupancyRate: number
    }
}

export function HostelInfoCard({ selectedHostel, roomStats }: HostelInfoCardProps) {
    return (
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
    )
}
