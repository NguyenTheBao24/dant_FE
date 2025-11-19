"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Label } from "@/components/admin/ui/label"
import { Badge } from "@/components/admin/ui/badge"
import { UserPlus, Building2, Calendar, Key } from "lucide-react"

interface TenantDetailsDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    viewingTenant: any
}

export function TenantDetailsDialog({
    isOpen,
    onOpenChange,
    viewingTenant
}: TenantDetailsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 py-2">
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
