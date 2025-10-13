import { Label } from "@/components/admin/ui/label"
import { Room } from "../../../../types/tenant.types"

interface RoomRentInfoProps {
    selectedRoom: Room | null
}

export function RoomRentInfo({ selectedRoom }: RoomRentInfoProps) {
    return (
        <div className="space-y-2">
            <Label>Tiền thuê/tháng</Label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm font-medium text-blue-800">
                    {selectedRoom ? `${selectedRoom.rent_amount?.toLocaleString('vi-VN')}đ/tháng` : 'Chưa chọn phòng'}
                </div>
                <div className="text-xs text-blue-600">
                    {selectedRoom ? `Phòng ${selectedRoom.room_number} - ${selectedRoom.room_type}` : 'Vui lòng chọn phòng trước'}
                </div>
            </div>
        </div>
    )
}
