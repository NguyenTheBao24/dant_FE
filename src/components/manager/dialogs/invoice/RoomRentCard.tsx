import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"
import { Home } from "lucide-react"
import { RoomInfo } from "../../../../types/invoice.types"

interface RoomRentCardProps {
    room: RoomInfo
}

export function RoomRentCard({ room }: RoomRentCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center">
                    <Home className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Tiền phòng</h3>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">
                                Tiền thuê phòng hàng tháng
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Phòng {room?.so_can || `Phòng ${room?.id}`}
                            </p>
                        </div>
                        <span className="text-xl font-bold text-blue-700">
                            {(room?.gia_thue || 0).toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
