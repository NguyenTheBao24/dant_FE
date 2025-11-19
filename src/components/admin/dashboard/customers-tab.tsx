"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { AddTenantDialog } from "./dialogs/AddTenantDialog"
import { EditTenantDialog } from "./dialogs/EditTenantDialog"
import { TenantDetailsDialog } from "./dialogs/TenantDetailsDialog"
import { TenantTable } from "./TenantTable"
import { useRooms } from "@/hooks/useRooms.js"
import { useTenantAccount } from "@/hooks/useTenantAccount.js"
import { useTenantForm } from "@/hooks/useTenantForm.js"

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

    // Custom hooks
    const { availableRooms, isLoadingRooms } = useRooms(selectedHostel)
    const { hasAccount, createAccount } = useTenantAccount()
    const {
        editForm,
        setEditForm,
        editRoomSearchTerm,
        showEditRoomSuggestions,
        setShowEditRoomSuggestions,
        selectedEditRoom,
        editRoomInputRef,
        handleEditRoomSelect,
        handleEditRoomInputChange,
        initializeEditForm,
        resetEditForm
    } = useTenantForm()

    // Lọc phòng cho form chỉnh sửa
    const filteredEditRooms = availableRooms.filter((room: any) =>
        room.room_number.toLowerCase().includes(editRoomSearchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(editRoomSearchTerm.toLowerCase())
    )

    const openEdit = (tenant: any) => {
        setEditingTenant(tenant)
        initializeEditForm(tenant, availableRooms)
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
        const updatedTenant = {
            ...editingTenant,
            name: editForm.name,
            room_number: editForm.roomNumber,
            room_id: selectedEditRoom?.id,
            phone: editForm.phone,
            emergency_phone: editForm.emergencyPhone,
            months_rented: Number(editForm.rentMonths || 0),
            rent_amount: selectedEditRoom?.rent_amount,
            roomNumber: editForm.roomNumber,
            address: editForm.address,
            emergencyPhone: editForm.emergencyPhone,
            rentMonths: Number(editForm.rentMonths || 0),
        }

        onEditTenant(updatedTenant)
        setIsEditOpen(false)
        setEditingTenant(null)
        resetEditForm()
    }

    const openDetails = (tenant: any) => {
        setViewingTenant(tenant)
        setIsDetailsOpen(true)
    }

    const handleCreateAccount = async (tenant: any) => {
        await createAccount(tenant, (updatedTenant: any) => {
            // Thông báo cho component cha cập nhật state
            if (onEditTenant) {
                onEditTenant(updatedTenant)
            }

            // Cập nhật viewingTenant nếu đang xem chi tiết khách thuê này
            if (viewingTenant && viewingTenant.id === tenant.id) {
                setViewingTenant(updatedTenant)
            }
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách thuê</h2>
                    <p className="text-gray-600">Quản lý thông tin và hợp đồng thuê của khách hàng</p>
                </div>
                <AddTenantDialog
                    isOpen={isAddTenantOpen}
                    onOpenChange={onAddTenantOpenChange}
                    onAddTenant={onAddTenant || (() => { })}
                    selectedHostel={selectedHostel}
                />
            </div>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-lg">
                        <TenantTable
                            filteredTenants={filteredTenants}
                            onEditTenant={openEdit}
                            onDeleteTenant={onDeleteTenant || (() => { })}
                            onViewDetails={openDetails}
                            onCreateAccount={handleCreateAccount}
                            hasAccount={hasAccount}
                        />
                    </div>
                </CardContent>
            </Card>

            <EditTenantDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                editForm={editForm}
                setEditForm={setEditForm}
                selectedEditRoom={selectedEditRoom}
                editRoomSearchTerm={editRoomSearchTerm}
                showEditRoomSuggestions={showEditRoomSuggestions}
                setShowEditRoomSuggestions={setShowEditRoomSuggestions}
                editRoomInputRef={editRoomInputRef}
                isLoadingRooms={isLoadingRooms}
                filteredEditRooms={filteredEditRooms}
                handleEditRoomInputChange={handleEditRoomInputChange}
                handleEditRoomSelect={handleEditRoomSelect}
                onSave={saveEdit}
                onReset={resetEditForm}
            />

            <TenantDetailsDialog
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                viewingTenant={viewingTenant}
            />
        </div>
    )
}
