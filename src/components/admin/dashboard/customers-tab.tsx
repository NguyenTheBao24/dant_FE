"use client"

import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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
import { getAvailableRoomsByHostel } from "@/services/rooms.service"

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
    const [availableRooms, setAvailableRooms] = useState<any[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [roomSearchTerm, setRoomSearchTerm] = useState("")
    const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
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

    // State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState("")
    const [searchField, setSearchField] = useState("all") // all, name, room, phone, status, address, rentMonths

    // Hàm lấy nhãn trường tìm kiếm
    const getFieldLabel = (field: string) => {
        switch (field) {
            case 'name': return 'Tên'
            case 'room': return 'Số phòng'
            case 'phone': return 'Số điện thoại'
            case 'status': return 'Trạng thái'
            case 'address': return 'Địa chỉ'
            case 'rentMonths': return 'Thời hạn thuê'
            default: return 'Tất cả'
        }
    }

    // Load danh sách phòng còn trống khi selectedHostel thay đổi
    useEffect(() => {
        const loadAvailableRooms = async () => {
            if (!selectedHostel?.id) {
                setAvailableRooms([])
                return
            }

            setIsLoadingRooms(true)
            try {
                const rooms = await getAvailableRoomsByHostel(selectedHostel.id)
                console.log('Loaded available rooms:', rooms)
                setAvailableRooms(rooms || [])
            } catch (error) {
                console.error('Failed to load available rooms:', error)
                // Không set empty array, để service tự xử lý fallback
                setAvailableRooms([])
            } finally {
                setIsLoadingRooms(false)
            }
        }

        loadAvailableRooms()
    }, [selectedHostel])

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

    // Lọc khách thuê dựa trên tìm kiếm
    const searchFilteredTenants = filteredTenants.filter(tenant => {
        if (!searchTerm) return true

        const searchLower = searchTerm.toLowerCase()

        switch (searchField) {
            case 'name':
                return tenant.name?.toLowerCase().includes(searchLower)
            case 'room':
                return (tenant.room_number || tenant.roomNumber)?.toLowerCase().includes(searchLower)
            case 'phone':
                return tenant.phone?.includes(searchTerm) ||
                    (tenant.emergency_phone || tenant.emergencyPhone)?.includes(searchTerm)
            case 'status':
                return tenant.status?.toLowerCase().includes(searchLower)
            case 'address':
                return tenant.address?.toLowerCase().includes(searchLower)
            case 'rentMonths':
                return (tenant.months_rented || tenant.rentMonths)?.toString().includes(searchTerm)
            case 'all':
            default:
                return (
                    tenant.name?.toLowerCase().includes(searchLower) ||
                    (tenant.room_number || tenant.roomNumber)?.toLowerCase().includes(searchLower) ||
                    tenant.phone?.includes(searchTerm) ||
                    (tenant.emergency_phone || tenant.emergencyPhone)?.includes(searchTerm) ||
                    tenant.status?.toLowerCase().includes(searchLower) ||
                    tenant.address?.toLowerCase().includes(searchLower) ||
                    (tenant.months_rented || tenant.rentMonths)?.toString().includes(searchTerm)
                )
        }
    })

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
    const handleSave = () => {
        if (!onAddTenant) return
        const name = (document.getElementById('tenant-name') as HTMLInputElement)?.value || ''
        const address = (document.getElementById('address') as HTMLTextAreaElement)?.value || ''
        const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''
        const emergencyPhone = (document.getElementById('emergency-phone') as HTMLInputElement)?.value || ''
        const rentMonths = (document.getElementById('rent-months') as HTMLInputElement)?.value || '0'

        // Kiểm tra xem đã chọn phòng chưa
        if (!selectedRoom) {
            alert('Vui lòng chọn phòng từ danh sách gợi ý')
            return
        }

        onAddTenant({
            name,
            roomNumber: selectedRoom.room_number,
            address,
            phone,
            emergencyPhone,
            rentMonths,
            roomId: selectedRoom.id,
            roomType: selectedRoom.room_type,
            rentAmount: selectedRoom.rent_amount
        })

        // Reset form
        setRoomSearchTerm("")
        setSelectedRoom(null)
        setShowRoomSuggestions(false)
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input id="phone" placeholder="0123456789" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergency-phone">SĐT khẩn cấp</Label>
                                    <Input id="emergency-phone" placeholder="0987654321" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rent-months">Số tháng thuê</Label>
                                    <Input id="rent-months" type="number" placeholder="12" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rent-amount">Tiền thuê/tháng</Label>
                                    <Input id="rent-amount" type="number" placeholder="3500000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contract-start">Ngày bắt đầu</Label>
                                    <Input id="contract-start" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contract-end">Ngày kết thúc</Label>
                                    <Input id="contract-end" type="date" />
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
                                {searchFilteredTenants.length} khách thuê
                            </Badge>
                        </div>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Tìm kiếm khách thuê..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Tìm theo:</span>
                            <select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="name">Tên</option>
                                <option value="room">Số phòng</option>
                                <option value="phone">Số điện thoại</option>
                                <option value="status">Trạng thái</option>
                                <option value="address">Địa chỉ</option>
                                <option value="rentMonths">Thời hạn thuê</option>
                            </select>
                        </div>
                    </div>

                    {/* Hiển thị kết quả tìm kiếm */}
                    {searchTerm && (
                        <div className="mt-2 text-sm text-gray-600">
                            Tìm thấy {searchFilteredTenants.length} kết quả cho "{searchTerm}"
                            {searchField !== 'all' && ` trong ${getFieldLabel(searchField)}`}
                        </div>
                    )}
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
                                    <TableHead className="font-semibold text-gray-900 py-4">SĐT khẩn cấp</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Thời hạn thuê</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {searchFilteredTenants.map((tenant, index) => (
                                    <TableRow key={tenant.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <TableCell className="font-semibold text-gray-900 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-blue-600 font-semibold text-sm">{tenant.name.charAt(0)}</span>
                                                </div>
                                                <span>{tenant.name}</span>
                                            </div>
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
                                            <div className="flex items-center text-gray-700">
                                                {tenant.emergency_phone || tenant.emergencyPhone}
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
                                                    <DropdownMenuItem onClick={() => openEdit(tenant)} className="hover:bg-blue-50">
                                                        <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                                        <span className="text-gray-700">Chỉnh sửa</span>
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
        </div>
    )
}

