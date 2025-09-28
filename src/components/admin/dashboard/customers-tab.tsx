"use client"

import { Plus, MoreHorizontal, Edit, Trash2, UserPlus, Eye, Building2, Calendar, Key } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/admin/ui/dropdown"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { useState, useEffect, useRef } from "react"
import { listAvailableCanHoByToaNha, updateCanHoTrangThai } from "@/services/can-ho.service"
import { createKhachThue, updateKhachThue } from "@/services/khach-thue.service"
import { createHopDong } from "@/services/hop-dong.service"
import { createTaiKhoan } from "@/services/tai-khoan.service"

interface CustomersTabProps {
    filteredTenants: any[]
    isAddTenantOpen: boolean
    onAddTenantOpenChange: (open: boolean) => void
    onAddTenant?: (payload: any) => void
    onEditTenant?: (tenant: any) => void
    onDeleteTenant?: (tenant: any) => void
    selectedHostel?: any
}

export function CustomersTab({
    filteredTenants,
    isAddTenantOpen,
    onAddTenantOpenChange,
    onAddTenant,
    onEditTenant,
    onDeleteTenant,
    selectedHostel,
}: CustomersTabProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingTenant, setEditingTenant] = useState<any | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [viewingTenant, setViewingTenant] = useState<any | null>(null)
    const [availableRooms, setAvailableRooms] = useState<any[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [roomSearchTerm, setRoomSearchTerm] = useState("")
    const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
    const [rentMonths, setRentMonths] = useState(12)
    const roomInputRef = useRef<HTMLInputElement>(null)

    // State cho form chỉnh sửa
    const [editRoomSearchTerm, setEditRoomSearchTerm] = useState("")
    const [showEditRoomSuggestions, setShowEditRoomSuggestions] = useState(false)
    const [selectedEditRoom, setSelectedEditRoom] = useState<any | null>(null)
    const editRoomInputRef = useRef<HTMLInputElement>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        roomNumber: "",
        address: "",
        phone: "",
        emergencyPhone: "",
        rentMonths: "",
    })

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
                // Map can_ho data to expected format
                const mappedRooms = rooms.map((room: any) => ({
                    id: room.id,
                    room_number: room.so_can,
                    room_type: room.loai_can_ho || 'Phòng đơn',
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
    const filteredRooms = availableRooms.filter(room =>
        room.room_number.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(roomSearchTerm.toLowerCase())
    )

    // Lọc phòng cho form chỉnh sửa
    const filteredEditRooms = availableRooms.filter(room =>
        room.room_number.toLowerCase().includes(editRoomSearchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(editRoomSearchTerm.toLowerCase())
    )

    // Xử lý chọn phòng
    const handleRoomSelect = (room: any) => {
        // Kiểm tra phòng có còn trống không
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

    // Xử lý chọn phòng cho form chỉnh sửa
    const handleEditRoomSelect = (room: any) => {
        setSelectedEditRoom(room)
        setEditRoomSearchTerm(room.room_number)
        setShowEditRoomSuggestions(false)
    }

    // Xử lý thay đổi input cho form chỉnh sửa
    const handleEditRoomInputChange = (value: string) => {
        setEditRoomSearchTerm(value)
        setShowEditRoomSuggestions(true)
        setSelectedEditRoom(null)
    }

    // Xử lý click outside để đóng suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roomInputRef.current && !roomInputRef.current.contains(event.target as Node)) {
                setShowRoomSuggestions(false)
            }
            if (editRoomInputRef.current && !editRoomInputRef.current.contains(event.target as Node)) {
                setShowEditRoomSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const openEdit = (tenant: any) => {
        setEditingTenant(tenant)
        setEditForm({
            name: tenant.name || "",
            roomNumber: tenant.room_number || tenant.roomNumber || "", // Ưu tiên backend field
            address: tenant.address || "",
            phone: tenant.phone || "",
            emergencyPhone: tenant.emergency_phone || tenant.emergencyPhone || "", // Ưu tiên backend field
            rentMonths: String(tenant.months_rented ?? tenant.rentMonths ?? ""), // Ưu tiên backend field
        })

        // Khởi tạo phòng đã chọn nếu có
        const currentRoomNumber = tenant.room_number || tenant.roomNumber || ""
        if (currentRoomNumber) {
            setEditRoomSearchTerm(currentRoomNumber)
            // Tìm phòng hiện tại trong danh sách
            const currentRoom = availableRooms.find(room => room.room_number === currentRoomNumber)
            if (currentRoom) {
                setSelectedEditRoom(currentRoom)
            }
        } else {
            setEditRoomSearchTerm("")
            setSelectedEditRoom(null)
        }

        setIsEditOpen(true)
    }

    const saveEdit = () => {
        if (!editingTenant || !onEditTenant) return

        // Kiểm tra xem đã chọn phòng mới chưa
        if (selectedEditRoom && selectedEditRoom.room_number !== editForm.roomNumber) {
            // Cập nhật thông tin phòng từ phòng đã chọn
            editForm.roomNumber = selectedEditRoom.room_number
        }

        // Mapping dữ liệu để phù hợp với backend (Supabase)
        // Chỉ gửi các trường có trong schema của bảng tenants
        const updatedTenant = {
            ...editingTenant,
            name: editForm.name,
            room_number: editForm.roomNumber, // Backend sử dụng room_number
            room_id: selectedEditRoom?.id, // Cập nhật room_id nếu có
            phone: editForm.phone,
            emergency_phone: editForm.emergencyPhone, // Backend sử dụng emergency_phone
            months_rented: Number(editForm.rentMonths || 0), // Backend sử dụng months_rented
            rent_amount: selectedEditRoom?.rent_amount, // Cập nhật giá thuê từ phòng mới
            // Giữ lại các field frontend để hiển thị
            roomNumber: editForm.roomNumber,
            address: editForm.address, // Chỉ lưu local, không gửi lên Supabase
            emergencyPhone: editForm.emergencyPhone,
            rentMonths: Number(editForm.rentMonths || 0),
        }

        onEditTenant(updatedTenant)
        setIsEditOpen(false)
        setEditingTenant(null)

        // Reset form chỉnh sửa
        setEditRoomSearchTerm("")
        setSelectedEditRoom(null)
        setShowEditRoomSuggestions(false)
    }

    const openDetails = (tenant: any) => {
        setViewingTenant(tenant)
        setIsDetailsOpen(true)
    }

    // Helper function để kiểm tra khách thuê đã có tài khoản chưa
    const hasAccount = (tenant: any) => {
        return tenant.tai_khoan_id ||
            tenant.tai_khoan ||
            (tenant.tai_khoan && tenant.tai_khoan.id) ||
            (tenant.tai_khoan && tenant.tai_khoan.username)
    }

    const handleCreateAccount = async (tenant: any) => {
        try {
            // Kiểm tra xem khách thuê đã có tài khoản chưa - kiểm tra chặt chẽ hơn
            if (hasAccount(tenant)) {
                alert('Khách thuê đã có tài khoản. Không thể cấp tài khoản mới.')
                return
            }

            // Kiểm tra thêm bằng cách gọi API để xác nhận
            try {
                const { getKhachThueById } = await import('@/services/khach-thue.service')
                const currentTenant = await getKhachThueById(tenant.id)

                if (currentTenant && currentTenant.tai_khoan_id) {
                    alert('Khách thuê đã có tài khoản. Không thể cấp tài khoản mới.')
                    return
                }
            } catch (apiError) {
                console.warn('Could not verify account status from API:', apiError)
                // Tiếp tục nếu không thể kiểm tra từ API
            }

            // Tạo username duy nhất từ email hoặc tên + timestamp
            let username
            if (tenant.email && tenant.email.trim()) {
                // Sử dụng email nếu có
                username = tenant.email.trim()
            } else {
                // Tạo username từ tên + timestamp để đảm bảo duy nhất
                const nameSlug = tenant.name.toLowerCase()
                    .replace(/[^a-z0-9]/g, '')
                    .substring(0, 10)
                const timestamp = Date.now().toString().slice(-6)
                username = `${nameSlug}_${timestamp}`
            }
            const defaultPassword = '123'

            // Tạo tài khoản mới với retry logic
            let account = null
            let finalUsername = username
            let retryCount = 0
            const maxRetries = 3

            while (!account && retryCount < maxRetries) {
                try {
                    account = await createTaiKhoan({
                        username: finalUsername,
                        password: defaultPassword,
                        role: 'khach_thue'
                    })
                } catch (error) {
                    const errorObj = error as any
                    if (errorObj?.code === '23505' && retryCount < maxRetries - 1) {
                        // Username trùng lặp, tạo username mới
                        retryCount++
                        const randomSuffix = Math.random().toString(36).substring(2, 8)
                        finalUsername = `${username}_${randomSuffix}`
                        console.log(`Username conflict, retrying with: ${finalUsername}`)
                    } else {
                        throw error
                    }
                }
            }

            if (!account?.id) {
                alert('Không thể tạo tài khoản sau nhiều lần thử. Vui lòng thử lại.')
                return
            }

            // Cập nhật khách thuê với tai_khoan_id
            await updateKhachThue(tenant.id, { tai_khoan_id: account.id })

            // Cập nhật local state để hiển thị thông tin tài khoản mới ngay lập tức
            const updatedTenant = {
                ...tenant,
                tai_khoan_id: account.id,
                tai_khoan: {
                    id: account.id,
                    username: finalUsername,
                    password: defaultPassword,
                    role: 'khach_thue',
                    created_at: account.created_at,
                    is_active: account.is_active
                }
            }

            // Thông báo cho component cha cập nhật state
            if (onEditTenant) {
                onEditTenant(updatedTenant)
            }

            // Cập nhật viewingTenant nếu đang xem chi tiết khách thuê này
            if (viewingTenant && viewingTenant.id === tenant.id) {
                setViewingTenant(updatedTenant)
            }

            alert(`Đã cấp tài khoản thành công!\nUsername: ${finalUsername}\nPassword: ${defaultPassword}\n\nVui lòng thông báo cho khách thuê để đổi mật khẩu.`)
        } catch (error) {
            console.error('Failed to create account:', error)
            const errorObj = error as any
            if (errorObj?.code === '23505') {
                alert('Username đã tồn tại. Vui lòng thử lại.')
            } else {
                alert('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.')
            }
        }
    }
    const handleSave = async () => {
        if (!onAddTenant) return
        const name = (document.getElementById('tenant-name') as HTMLInputElement)?.value || ''
        const address = (document.getElementById('address') as HTMLTextAreaElement)?.value || ''
        const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''
        const email = (document.getElementById('email') as HTMLInputElement)?.value || ''
        const cccd = (document.getElementById('cccd') as HTMLInputElement)?.value || ''
        // Sử dụng state thay vì lấy từ DOM

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
            // Chỉ thêm email và cccd nếu có giá trị
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

            // Tính ngày kết thúc: ngày bắt đầu + số tháng thuê
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
        onAddTenantOpenChange(false)
    }
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách thuê</h2>
                    <p className="text-gray-600">Quản lý thông tin và hợp đồng thuê của khách hàng</p>
                </div>
                <Dialog open={isAddTenantOpen} onOpenChange={(open) => {
                    onAddTenantOpenChange(open)
                    if (!open) {
                        // Reset form khi đóng dialog
                        setRoomSearchTerm("")
                        setSelectedRoom(null)
                        setShowRoomSuggestions(false)
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
                            <Button variant="outline" onClick={() => onAddTenantOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="button" onClick={handleSave}>Lưu khách thuê</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Danh sách khách thuê</CardTitle>
                            <CardDescription className="text-gray-600 mt-1">Quản lý thông tin khách thuê trong khu trọ</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                {filteredTenants.length} khách thuê
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-900 py-4">Tên khách thuê</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Phòng</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Địa chỉ cư trú</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Điện thoại</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Thời hạn thuê</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTenants.map((tenant, index) => (
                                    <TableRow key={tenant.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <TableCell className="font-semibold text-gray-900 py-4">
                                            <span>{tenant.name}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                                {tenant.room_number || tenant.roomNumber}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-gray-600 py-4">{tenant.address || 'Chưa cập nhật'}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center text-gray-700">
                                                {tenant.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center">
                                                <span className="text-gray-700 font-medium">{tenant.months_rented || tenant.rentMonths}</span>
                                                <span className="text-gray-500 ml-1">tháng</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge
                                                variant={tenant.status === "active" ? "default" : "secondary"}
                                                className={tenant.status === "active"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : "bg-red-100 text-red-800 border-red-200"
                                                }
                                            >
                                                {tenant.status === "active" ? "Đang thuê" : "Hết hạn"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                                                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => openDetails(tenant)} className="hover:bg-green-50">
                                                        <Eye className="mr-2 h-4 w-4 text-green-600" />
                                                        <span className="text-gray-700">Xem chi tiết</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => openEdit(tenant)} className="hover:bg-blue-50">
                                                        <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                                        <span className="text-gray-700">Chỉnh sửa</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => handleCreateAccount(tenant)}
                                                        className="hover:bg-purple-50"
                                                        disabled={hasAccount(tenant)}
                                                    >
                                                        <UserPlus className="mr-2 h-4 w-4 text-purple-600" />
                                                        <span className="text-gray-700">
                                                            {hasAccount(tenant) ? 'Đã có tài khoản' : 'Cấp tài khoản'}
                                                        </span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => onDeleteTenant && onDeleteTenant(tenant)} className="text-red-600 hover:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open)
                if (!open) {
                    // Reset form chỉnh sửa khi đóng
                    setEditRoomSearchTerm("")
                    setSelectedEditRoom(null)
                    setShowEditRoomSuggestions(false)
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
                                <Input id="edit-name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
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
                            <Textarea id="edit-address" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Số điện thoại</Label>
                                <Input id="edit-phone" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-emergency-phone">SĐT khẩn cấp</Label>
                                <Input id="edit-emergency-phone" value={editForm.emergencyPhone} onChange={e => setEditForm(f => ({ ...f, emergencyPhone: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-rent-months">Số tháng thuê</Label>
                                <Input id="edit-rent-months" type="number" value={editForm.rentMonths} onChange={e => setEditForm(f => ({ ...f, rentMonths: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                        <Button onClick={saveEdit}>Lưu thay đổi</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog xem chi tiết khách thuê */}
            <Dialog open={isDetailsOpen} onOpenChange={(open) => setIsDetailsOpen(open)}>
                <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-xl font-bold text-gray-800">Thông tin chi tiết khách thuê</DialogTitle>
                        <DialogDescription className="text-gray-600">Xem tất cả thông tin liên quan đến khách thuê</DialogDescription>
                    </DialogHeader>
                    {viewingTenant && (
                        <div className="space-y-6 py-6">
                            {/* Thông tin cá nhân */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                                <h3 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                                    <UserPlus className="mr-3 h-5 w-5" />
                                    Thông tin cá nhân
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Họ và tên</Label>
                                        <div className="text-gray-900 font-semibold text-lg">{viewingTenant.name}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Số điện thoại</Label>
                                        <div className="text-gray-900 font-semibold text-lg">{viewingTenant.phone}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Email</Label>
                                        <div className="text-gray-900 font-medium">{viewingTenant.email || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">CCCD</Label>
                                        <div className="text-gray-900 font-medium">{viewingTenant.cccd || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Địa chỉ cư trú</Label>
                                        <div className="text-gray-900 font-medium">{viewingTenant.address || 'Chưa cập nhật'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin thuê phòng */}
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                                <h3 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                                    <Building2 className="mr-3 h-5 w-5" />
                                    Thông tin thuê phòng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Số phòng</Label>
                                        <div className="text-gray-900 font-medium">
                                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1 text-sm font-semibold">
                                                {viewingTenant.room_number || viewingTenant.roomNumber}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Loại phòng</Label>
                                        <div className="text-gray-900 font-medium">{viewingTenant.room_type || 'Phòng đơn'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Tiền thuê/tháng</Label>
                                        <div className="font-bold text-lg text-green-700">
                                            {viewingTenant.rent_amount ? `${viewingTenant.rent_amount.toLocaleString('vi-VN')}đ` : 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Thời hạn thuê</Label>
                                        <div className="text-gray-900 font-semibold text-lg">
                                            {viewingTenant.months_rented || viewingTenant.rentMonths || 0} tháng
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin hợp đồng */}
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
                                <h3 className="font-bold text-purple-800 mb-4 flex items-center text-lg">
                                    <Calendar className="mr-3 h-5 w-5" />
                                    Thông tin hợp đồng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Ngày bắt đầu</Label>
                                        <div className="text-gray-900 font-semibold text-lg">
                                            {viewingTenant.contract_start ? new Date(viewingTenant.contract_start).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Ngày kết thúc</Label>
                                        <div className="text-gray-900 font-semibold text-lg">
                                            {viewingTenant.contract_end ? new Date(viewingTenant.contract_end).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">Trạng thái hợp đồng</Label>
                                        <div>
                                            <Badge
                                                variant={viewingTenant.status === "active" ? "default" : "secondary"}
                                                className={viewingTenant.status === "active"
                                                    ? "bg-green-100 text-green-800 border-green-200 px-3 py-1 font-semibold"
                                                    : "bg-red-100 text-red-800 border-red-200 px-3 py-1 font-semibold"
                                                }
                                            >
                                                {viewingTenant.status === "active" ? "Hiệu lực" : "Hết hạn"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold text-gray-700">ID hợp đồng</Label>
                                        <div className="text-gray-900 font-medium font-mono bg-gray-100 px-2 py-1 rounded">
                                            {viewingTenant.hop_dong_id || 'Chưa có'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin tài khoản */}
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
                                <h3 className="font-bold text-orange-800 mb-4 flex items-center text-lg">
                                    <Key className="mr-3 h-5 w-5" />
                                    Thông tin tài khoản
                                </h3>
                                {viewingTenant.tai_khoan_id || viewingTenant.tai_khoan ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-semibold text-gray-700">Trạng thái tài khoản</Label>
                                            <div>
                                                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 px-3 py-1 font-semibold">
                                                    Đã có tài khoản
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-semibold text-gray-700">Role</Label>
                                            <div>
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 font-semibold">
                                                    {viewingTenant.tai_khoan?.role || 'khach_thue'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700 flex items-center">
                                                <span className="mr-2">👤</span>
                                                Username
                                            </Label>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-base font-semibold text-gray-800">
                                                        {viewingTenant.tai_khoan?.username || 'Chưa cập nhật'}
                                                    </span>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-colors"
                                                        onClick={() => {
                                                            if (viewingTenant.tai_khoan?.username) {
                                                                navigator.clipboard.writeText(viewingTenant.tai_khoan.username)
                                                                alert('Username đã được copy!')
                                                            }
                                                        }}
                                                        title="Copy username"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700 flex items-center">
                                                <span className="mr-2">🔐</span>
                                                Password
                                            </Label>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-base font-semibold text-gray-800">
                                                        {viewingTenant.tai_khoan?.password || 'Chưa cập nhật'}
                                                    </span>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded transition-colors"
                                                        onClick={() => {
                                                            if (viewingTenant.tai_khoan?.password) {
                                                                navigator.clipboard.writeText(viewingTenant.tai_khoan.password)
                                                                alert('Password đã được copy!')
                                                            }
                                                        }}
                                                        title="Copy password"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-semibold text-gray-700">Ngày tạo</Label>
                                            <div className="text-gray-900 font-medium">
                                                {viewingTenant.tai_khoan?.created_at ?
                                                    new Date(viewingTenant.tai_khoan.created_at).toLocaleDateString('vi-VN') :
                                                    'Chưa cập nhật'
                                                }
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</Label>
                                            <div>
                                                <Badge
                                                    variant={viewingTenant.tai_khoan?.is_active !== false ? "default" : "secondary"}
                                                    className={viewingTenant.tai_khoan?.is_active !== false
                                                        ? "bg-green-100 text-green-800 border-green-200 px-3 py-1 font-semibold"
                                                        : "bg-red-100 text-red-800 border-red-200 px-3 py-1 font-semibold"
                                                    }
                                                >
                                                    {viewingTenant.tai_khoan?.is_active !== false ? 'Hoạt động' : 'Bị khóa'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-4">
                                            <Key className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                            <p className="font-semibold text-lg">Chưa có tài khoản</p>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Khách thuê chưa được cấp tài khoản. Sử dụng nút "Cấp tài khoản" để tạo tài khoản mới.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="px-6 py-2">
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

