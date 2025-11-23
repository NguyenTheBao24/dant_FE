"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Plus } from "lucide-react"
import { listAvailableCanHoByToaNha, updateCanHoTrangThai, determineRoomType } from "@/services/can-ho.service"
import { createKhachThue } from "@/services/khach-thue.service"
import { createHopDong } from "@/services/hop-dong.service"
import { getToaNhaById } from "@/services/toa-nha.service"
import { buildContractHtml } from "@/utils/tenant.utils"
import { generateAndDownloadPDF, generatePDFForEmail } from "@/utils/pdf.utils"
// @ts-ignore
import { sendContractEmail } from "@/services/email.service"

interface AddTenantDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onAddTenant: (payload: any) => void
    selectedHostel?: any
}

export function AddTenantDialog({
    isOpen,
    onOpenChange,
    onAddTenant,
    selectedHostel
}: AddTenantDialogProps) {
    const [availableRooms, setAvailableRooms] = useState<any[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [roomSearchTerm, setRoomSearchTerm] = useState("")
    const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
    const [rentMonths, setRentMonths] = useState(12)
    const roomInputRef = useRef<HTMLInputElement>(null)

    // Load available rooms when selectedHostel changes
    useEffect(() => {
        async function loadAvailableRooms() {
            if (!selectedHostel?.id) {
                setAvailableRooms([])
                return
            }

            setIsLoadingRooms(true)
            try {
                const rooms = await listAvailableCanHoByToaNha(selectedHostel?.id)
                const mappedRooms = rooms.map((room: any) => ({
                    id: room.id,
                    room_number: room.so_can,
                    room_type: determineRoomType(room.dien_tich, room.gia_thue),
                    rent_amount: room.gia_thue,
                    status: room.trang_thai === 'trong' ? 'available' : 'occupied',
                    hostel_id: room.toa_nha_id
                }))
                setAvailableRooms(mappedRooms)
            } catch (error) {
                console.error('Failed to load available rooms:', error)
                setAvailableRooms([])
            } finally {
                setIsLoadingRooms(false)
            }
        }

        loadAvailableRooms()
    }, [selectedHostel?.id])

    // Lọc phòng theo từ khóa tìm kiếm
    const filteredRooms = availableRooms.filter((room: any) =>
        room.room_number.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(roomSearchTerm.toLowerCase())
    )

    // Xử lý chọn phòng
    const handleRoomSelect = (room: any) => {
        if (room.status !== 'available') {
            alert(`Phòng ${room.room_number} đã có người thuê. Vui lòng chọn phòng khác.`)
            return
        }

        setSelectedRoom(room)
        setRoomSearchTerm(room.room_number)
        setShowRoomSuggestions(false)
    }

    // Xử lý thay đổi input
    const handleRoomInputChange = (value: string) => {
        setRoomSearchTerm(value)
        setShowRoomSuggestions(true)
        setSelectedRoom(null)
    }

    // Xử lý click outside để đóng suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roomInputRef.current && !roomInputRef.current.contains(event.target as Node)) {
                setShowRoomSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSave = async () => {
        if (!onAddTenant) return

        const name = (document.getElementById('tenant-name') as HTMLInputElement)?.value || ''
        const address = (document.getElementById('address') as HTMLTextAreaElement)?.value || ''
        const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''
        const email = (document.getElementById('email') as HTMLInputElement)?.value || ''
        const cccd = (document.getElementById('cccd') as HTMLInputElement)?.value || ''

        // Kiểm tra xem đã chọn phòng chưa
        if (!selectedRoom) {
            alert('Vui lòng chọn phòng từ danh sách gợi ý')
            return
        }

        // Kiểm tra phòng còn trống không
        if (selectedRoom.status !== 'available') {
            alert(`Phòng ${selectedRoom.room_number} đã có người thuê. Vui lòng chọn phòng khác.`)
            return
        }

        // Validation cho email format
        if (email && email.trim() && !email.includes('@')) {
            alert('Email không hợp lệ')
            return
        }

        try {
            // Tạo khách thuê mới
            const khachThueData: any = {
                ho_ten: name,
                sdt: phone,
            }
            // Chỉ thêm các field optional nếu có giá trị
            if (address && address.trim()) {
                khachThueData.dia_chi = address.trim()
            }
            if (email && email.trim()) {
                khachThueData.email = email.trim()
            }
            if (cccd && cccd.trim()) {
                khachThueData.cccd = cccd.trim()
            }

            const newKhachThue = await createKhachThue(khachThueData)

            if (!newKhachThue?.id) {
                alert('Không thể tạo thông tin khách thuê')
                return
            }

            // Tạo hợp đồng thuê
            const today = new Date()
            const startDate = today.toISOString().split('T')[0]
            const endDate = new Date(today.getFullYear(), today.getMonth() + rentMonths, today.getDate()).toISOString().split('T')[0]

            const newHopDong = await createHopDong({
                can_ho_id: selectedRoom.id,
                khach_thue_id: newKhachThue.id,
                ngay_bat_dau: startDate,
                ngay_ket_thuc: endDate,
                trang_thai: 'hieu_luc'
            })

            if (!newHopDong?.id) {
                alert('Không thể tạo hợp đồng thuê')
                return
            }

            // Cập nhật trạng thái phòng thành "đã thuê"
            await updateCanHoTrangThai(selectedRoom.id, 'da_thue')

            // Gọi callback để cập nhật UI
            onAddTenant({
                name,
                roomNumber: selectedRoom.room_number,
                address,
                phone,
                rentMonths: rentMonths,
                roomId: selectedRoom.id,
                roomType: selectedRoom.room_type,
                rentAmount: selectedRoom.rent_amount,
                khachThueId: newKhachThue.id,
                hopDongId: newHopDong.id
            })

            alert('Đã tạo hợp đồng thuê thành công!')

            // Background: tạo PDF và gửi email hợp đồng (không chặn UI)
            if (email && email.trim()) {
                setTimeout(async () => {
                    try {
                        // Lấy thông tin tòa nhà đầy đủ với quản lý
                        const toaNha = selectedHostel?.id
                            ? await getToaNhaById(selectedHostel.id)
                            : selectedHostel

                        // Tạo HTML hợp đồng
                        const html = buildContractHtml({
                            hostelName: toaNha?.ten_toa || toaNha?.name || selectedHostel?.name || 'Khu trọ',
                            roomNumber: selectedRoom.room_number,
                            tenantName: name,
                            phone: phone,
                            email: email,
                            startDate: startDate,
                            endDate: endDate,
                            rentAmount: selectedRoom.rent_amount || 0,
                            contractId: newHopDong.id,
                            managerName: toaNha?.quan_ly?.ho_ten || selectedHostel?.manager?.name || 'Quản lý',
                            managerPhone: toaNha?.quan_ly?.sdt || selectedHostel?.manager?.phone || '',
                            managerEmail: toaNha?.quan_ly?.email || selectedHostel?.manager?.email || ''
                        })

                        // 1) Tạo và tải PDF xuống cho admin
                        await generateAndDownloadPDF(
                            html,
                            `hop-dong-${name}-${selectedRoom.room_number}.pdf`
                        )

                        // 2) Tạo PDF base64 (đã được tối ưu kích thước) và gửi qua email cho khách thuê
                        const { base64 } = await generatePDFForEmail(
                            html,
                            `hop-dong-${name}-${selectedRoom.room_number}.pdf`
                        )

                        await sendContractEmail({
                            toEmail: email.trim(),
                            tenantName: name,
                            contractPdfBase64: base64,
                            contractId: newHopDong.id,
                            hostelName: toaNha?.ten_toa || toaNha?.name || selectedHostel?.name || 'Khu trọ',
                            roomNumber: selectedRoom.room_number
                        })

                        console.log('Contract PDF sent via email successfully')
                    } catch (error) {
                        console.error('Error sending contract email:', error)
                        // Không hiển thị alert để không làm gián đoạn UX
                    }
                }, 500) // Delay 500ms để không chặn UI
            }
        } catch (error) {
            console.error('Failed to create rental contract:', error)

            // Xử lý lỗi cụ thể
            const errorObj = error as any
            if (errorObj?.code === '23505') {
                if (errorObj?.details?.includes('cccd')) {
                    alert('CCCD đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.')
                } else if (errorObj?.details?.includes('email')) {
                    alert('Email đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.')
                } else {
                    alert('Thông tin khách thuê đã tồn tại. Vui lòng kiểm tra lại.')
                }
            } else if (errorObj?.code === '409') {
                alert('Có lỗi xung đột dữ liệu. Vui lòng thử lại.')
            } else {
                alert('Có lỗi xảy ra khi tạo hợp đồng thuê. Vui lòng thử lại.')
            }
        }

        // Reset form
        setRoomSearchTerm("")
        setSelectedRoom(null)
        setShowRoomSuggestions(false)
        setRentMonths(12)
        onOpenChange(false)
    }

    const resetForm = () => {
        setRoomSearchTerm("")
        setSelectedRoom(null)
        setShowRoomSuggestions(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open)
            if (!open) {
                resetForm()
            }
        }}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khách thuê
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm khách thuê mới</DialogTitle>
                    <DialogDescription>Nhập thông tin khách thuê mới vào form bên dưới.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tenant-name">Tên khách thuê</Label>
                            <Input id="tenant-name" placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="room-number">Số phòng</Label>
                            <div className="relative" ref={roomInputRef}>
                                <Input
                                    id="room-number"
                                    placeholder={isLoadingRooms ? "Đang tải..." : "Gõ tên phòng để tìm kiếm..."}
                                    value={roomSearchTerm}
                                    onChange={(e) => handleRoomInputChange(e.target.value)}
                                    onFocus={() => setShowRoomSuggestions(true)}
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
                                                    onClick={() => handleRoomSelect(room)}
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
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ cư trú</Label>
                        <Textarea id="address" placeholder="123 Đường ABC, Quận XYZ, TP.HCM" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" placeholder="0123456789" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email (tùy chọn)</Label>
                            <Input id="email" type="email" placeholder="nguyenvana@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cccd">CCCD (tùy chọn)</Label>
                            <Input id="cccd" placeholder="123456789" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rent-months">Số tháng thuê</Label>
                        <Input
                            id="rent-months"
                            type="number"
                            placeholder="12"
                            value={rentMonths}
                            onChange={(e) => setRentMonths(Number(e.target.value) || 0)}
                        />
                    </div>
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
                    <div className="space-y-2">
                        <Label>Thông tin hợp đồng</Label>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="text-sm font-medium text-green-800">
                                Ngày bắt đầu: {new Date().toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-sm font-medium text-green-800">
                                Ngày kết thúc: {(() => {
                                    const today = new Date()
                                    const endDate = new Date(today.getFullYear(), today.getMonth() + rentMonths, today.getDate())
                                    return endDate.toLocaleDateString('vi-VN')
                                })()}
                            </div>
                            <div className="text-xs text-green-600">
                                Hợp đồng sẽ được tạo tự động khi lưu
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button type="button" onClick={handleSave}>Lưu khách thuê</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
