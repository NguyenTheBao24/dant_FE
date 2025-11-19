import { Input } from "@/components/admin/ui/input"
import { Room } from "../../../../types/tenant.types"

interface RoomSearchInputProps {
    roomSearchTerm: string
    isLoadingRooms: boolean
    showRoomSuggestions: boolean
    filteredRooms: Room[]
    availableRooms: Room[]
    selectedRoom: Room | null
    roomInputRef: React.RefObject<HTMLDivElement | null>
    onRoomInputChange: (value: string) => void
    onRoomSelect: (room: Room) => void
    onFocus: () => void
}

export function RoomSearchInput({
    roomSearchTerm,
    isLoadingRooms,
    showRoomSuggestions,
    filteredRooms,
    availableRooms,
    selectedRoom,
    roomInputRef,
    onRoomInputChange,
    onRoomSelect,
    onFocus
}: RoomSearchInputProps) {
    return (
        <div className="relative" ref={roomInputRef}>
            <Input
                id="room-number"
                placeholder={isLoadingRooms ? "Đang tải..." : "Gõ tên phòng để tìm kiếm..."}
                value={roomSearchTerm}
                onChange={(e) => onRoomInputChange(e.target.value)}
                onFocus={onFocus}
                className="w-full"
            />

            {/* Suggestions dropdown */}
            {showRoomSuggestions && roomSearchTerm && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingRooms ? (
                        <div className="px-3 py-2 text-sm text-gray-500">Đang tải danh sách phòng...</div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            {availableRooms.length === 0
                                ? "Không có phòng trống nào"
                                : "Không tìm thấy phòng phù hợp"
                            }
                        </div>
                    ) : (
                        filteredRooms.map((room) => (
                            <div
                                key={room.id}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                onClick={() => onRoomSelect(room)}
                            >
                                <div className="font-medium text-gray-900">{room.room_number}</div>
                                <div className="text-gray-600">
                                    {room.room_type} - {room.rent_amount?.toLocaleString('vi-VN')}đ/tháng
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Hiển thị phòng đã chọn */}
            {selectedRoom && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm font-medium text-green-800">
                        Đã chọn: {selectedRoom.room_number}
                    </div>
                    <div className="text-xs text-green-600">
                        {selectedRoom.room_type}
                    </div>
                </div>
            )}
        </div>
    )
}
