import { Card, CardContent } from "@/components/admin/ui/card"
import { RoomInfo, HopDongInfo } from "../../../../types/invoice.types"

interface RoomInfoCardProps {
    room: RoomInfo
    hopDong: HopDongInfo | null
}

export function RoomInfoCard({ room, hopDong }: RoomInfoCardProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Phòng</label>
                        <p className="text-lg font-semibold text-blue-600">
                            {room.so_can || `Phòng ${room.id}`}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Khách thuê</label>
                        <p className="text-lg font-semibold">
                            {hopDong?.khach_thue?.ho_ten || 'Chưa có khách thuê'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Giá thuê phòng</label>
                        <p className="text-lg font-semibold text-green-600">
                            {(room.gia_thue || 0).toLocaleString('vi-VN')}₫/tháng
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
