"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"

interface EditTenantDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    editForm: any
    setEditForm: (form: any) => void
    selectedEditRoom: any
    editRoomSearchTerm: string
    showEditRoomSuggestions: boolean
    setShowEditRoomSuggestions: (show: boolean) => void
    editRoomInputRef: any
    isLoadingRooms: boolean
    filteredEditRooms: any[]
    handleEditRoomInputChange: (value: string) => void
    handleEditRoomSelect: (room: any) => void
    onSave: () => void
    onReset: () => void
}

export function EditTenantDialog({
    isOpen,
    onOpenChange,
    editForm,
    setEditForm,
    selectedEditRoom,
    editRoomSearchTerm,
    showEditRoomSuggestions,
    setShowEditRoomSuggestions,
    editRoomInputRef,
    isLoadingRooms,
    filteredEditRooms,
    handleEditRoomInputChange,
    handleEditRoomSelect,
    onSave,
    onReset
}: EditTenantDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open)
            if (!open) {
                onReset()
            }
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa khách thuê</DialogTitle>
                    <DialogDescription>Cập nhật tất cả thông tin và lưu một lần.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Tên khách thuê</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="edit-room-number">Số phòng</Label>
                            <div className="relative" ref={editRoomInputRef}>
                                <Input
                                    id="edit-room-number"
                                    placeholder="Gõ tên phòng để tìm kiếm..."
                                    value={editRoomSearchTerm}
                                    onChange={(e) => handleEditRoomInputChange(e.target.value)}
                                    onFocus={() => setShowEditRoomSuggestions(true)}
                                    className="w-full"
                                />

                                {/* Suggestions dropdown cho form chỉnh sửa */}
                                {showEditRoomSuggestions && editRoomSearchTerm && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {isLoadingRooms ? (
                                            <div className="px-3 py-2 text-sm text-gray-500">Đang tải danh sách phòng...</div>
                                        ) : filteredEditRooms.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy phòng phù hợp</div>
                                        ) : (
                                            filteredEditRooms.map((room) => (
                                                <div
                                                    key={room.id}
                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                                    onClick={() => handleEditRoomSelect(room)}
                                                >
                                                    <div className="font-medium text-gray-900">{room.room_number}</div>
                                                    <div className="text-gray-600">
                                                        {room.room_type}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Hiển thị phòng đã chọn trong form chỉnh sửa */}
                                {selectedEditRoom && (
                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                        <div className="text-sm font-medium text-green-800">
                                            Đã chọn: {selectedEditRoom.room_number}
                                        </div>
                                        <div className="text-xs text-green-600">
                                            {selectedEditRoom.room_type}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-address">Địa chỉ cư trú</Label>
                        <Textarea
                            id="edit-address"
                            value={editForm.address}
                            onChange={e => setEditForm((f: any) => ({ ...f, address: e.target.value }))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Số điện thoại</Label>
                            <Input
                                id="edit-phone"
                                value={editForm.phone}
                                onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-emergency-phone">SĐT khẩn cấp</Label>
                            <Input
                                id="edit-emergency-phone"
                                value={editForm.emergencyPhone}
                                onChange={e => setEditForm((f: any) => ({ ...f, emergencyPhone: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-rent-months">Số tháng thuê</Label>
                            <Input
                                id="edit-rent-months"
                                type="number"
                                value={editForm.rentMonths}
                                onChange={e => setEditForm((f: any) => ({ ...f, rentMonths: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={onSave}>Lưu thay đổi</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
