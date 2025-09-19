"use client"

import { Plus, MoreHorizontal, Edit, Trash2, FileText, Download } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { useState } from "react"

interface CustomersTabProps {
    filteredTenants: any[]
    isAddTenantOpen: boolean
    onAddTenantOpenChange: (open: boolean) => void
    onAddTenant?: (payload: any) => void
    onEditTenant?: (tenant: any) => void
    onExportTenant?: (tenant: any) => void
    onDeleteTenant?: (tenant: any) => void
    onGenerateContract: (tenant: any) => void
}

export function CustomersTab({
    filteredTenants,
    isAddTenantOpen,
    onAddTenantOpenChange,
    onAddTenant,
    onEditTenant,
    onExportTenant,
    onDeleteTenant,
    onGenerateContract,
}: CustomersTabProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingTenant, setEditingTenant] = useState<any | null>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        roomNumber: "",
        address: "",
        phone: "",
        emergencyPhone: "",
        rentMonths: "",
    })

    const openEdit = (tenant: any) => {
        setEditingTenant(tenant)
        setEditForm({
            name: tenant.name || "",
            roomNumber: tenant.roomNumber || "",
            address: tenant.address || "",
            phone: tenant.phone || "",
            emergencyPhone: tenant.emergencyPhone || "",
            rentMonths: String(tenant.rentMonths ?? ""),
        })
        setIsEditOpen(true)
    }

    const saveEdit = () => {
        if (!editingTenant || !onEditTenant) return
        onEditTenant({
            ...editingTenant,
            name: editForm.name,
            roomNumber: editForm.roomNumber,
            address: editForm.address,
            phone: editForm.phone,
            emergencyPhone: editForm.emergencyPhone,
            rentMonths: Number(editForm.rentMonths || 0),
        })
        setIsEditOpen(false)
        setEditingTenant(null)
    }
    const handleSave = () => {
        if (!onAddTenant) return
        const name = (document.getElementById('tenant-name') as HTMLInputElement)?.value || ''
        const roomNumber = (document.querySelector('[data-room-select]') as HTMLInputElement)?.dataset.value || ''
        const address = (document.getElementById('address') as HTMLTextAreaElement)?.value || ''
        const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''
        const emergencyPhone = (document.getElementById('emergency-phone') as HTMLInputElement)?.value || ''
        const rentMonths = (document.getElementById('rent-months') as HTMLInputElement)?.value || '0'
        onAddTenant({ name, roomNumber, address, phone, emergencyPhone, rentMonths })
        onAddTenantOpenChange(false)
    }
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách thuê</h2>
                    <p className="text-gray-600">Quản lý thông tin và hợp đồng thuê của khách hàng</p>
                </div>
                <Dialog open={isAddTenantOpen} onOpenChange={onAddTenantOpenChange}>
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
                                <div className="space-y-2">
                                    <Label htmlFor="room-number">Số phòng</Label>
                                    <Select onValueChange={(v) => {
                                        const trigger = document.querySelector('[data-room-select]') as HTMLElement
                                        if (trigger) trigger.dataset.value = v
                                    }}>
                                        <SelectTrigger data-room-select>
                                            <SelectValue placeholder="Chọn phòng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A101">A101</SelectItem>
                                            <SelectItem value="A102">A102</SelectItem>
                                            <SelectItem value="B201">B201</SelectItem>
                                            <SelectItem value="B202">B202</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <TableHead className="font-semibold text-gray-900 py-4">SĐT khẩn cấp</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Thời hạn thuê</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTenants.map((tenant, index) => (
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
                                                {tenant.roomNumber}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-gray-600 py-4">{tenant.address}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center text-gray-700">

                                                {tenant.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center text-gray-700">

                                                {tenant.emergencyPhone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center">
                                                <span className="text-gray-700 font-medium">{tenant.rentMonths}</span>
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

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
                            <div className="space-y-2">
                                <Label htmlFor="edit-room-number">Số phòng</Label>
                                <Input id="edit-room-number" value={editForm.roomNumber} onChange={e => setEditForm(f => ({ ...f, roomNumber: e.target.value }))} />
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

