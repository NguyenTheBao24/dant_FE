"use client"

import { MoreHorizontal, Edit, Trash2, UserPlus, Eye, DollarSign } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/admin/ui/dropdown"

interface TenantTableProps {
    filteredTenants: any[]
    onEditTenant: (tenant: any) => void
    onDeleteTenant: (tenant: any) => void
    onViewDetails: (tenant: any) => void
    onCreateAccount: (tenant: any) => void
    hasAccount: (tenant: any) => boolean
    onUpdateRoomPrice?: (tenant: any) => void
}

export function TenantTable({
    filteredTenants,
    onEditTenant,
    onDeleteTenant,
    onViewDetails,
    onCreateAccount,
    hasAccount,
    onUpdateRoomPrice
}: TenantTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900 py-4">Tên khách thuê</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Phòng</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Email</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Điện thoại</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Thời hạn thuê</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTenants.map((tenant, index) => (
                    <TableRow key={`${tenant.id}-${tenant.room_number || tenant.roomNumber || index}`} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <TableCell className="font-semibold text-gray-900 py-4">
                            <span>{tenant.name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                {tenant.room_number || tenant.roomNumber}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600 py-4">{tenant.email || 'Chưa cập nhật'}</TableCell>
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
                                    <DropdownMenuItem onClick={() => onViewDetails(tenant)} className="hover:bg-green-50">
                                        <Eye className="mr-2 h-4 w-4 text-green-600" />
                                        <span className="text-gray-700">Xem chi tiết</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => onEditTenant(tenant)} className="hover:bg-blue-50">
                                        <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                        <span className="text-gray-700">Chỉnh sửa</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => onCreateAccount(tenant)}
                                        className="hover:bg-purple-50"
                                        disabled={hasAccount(tenant)}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4 text-purple-600" />
                                        <span className="text-gray-700">
                                            {hasAccount(tenant) ? 'Đã có tài khoản' : 'Cấp tài khoản'}
                                        </span>
                                    </DropdownMenuItem>

                                    {onUpdateRoomPrice && (
                                        <DropdownMenuItem
                                            onClick={() => onUpdateRoomPrice(tenant)}
                                            className="hover:bg-yellow-50"
                                        >
                                            <DollarSign className="mr-2 h-4 w-4 text-yellow-600" />
                                            <span className="text-gray-700">Thay đổi giá phòng</span>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem onClick={() => onDeleteTenant(tenant)} className="text-red-600 hover:bg-red-50">
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
    )
}
