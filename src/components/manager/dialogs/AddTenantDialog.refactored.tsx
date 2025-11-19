"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Label } from "@/components/admin/ui/label"
import { Plus } from "lucide-react"

// Import types
import { AddTenantDialogProps } from "../../../types/tenant.types"

// Import custom hook
import { useAddTenant } from "../../../hooks/useAddTenant"

// Import utils
import { validateTenantForm } from "../../../utils/tenant.utils"

// Import components
import {
    RoomSearchInput,
    TenantFormFields,
    RoomRentInfo,
    ContractInfo
} from "./tenant"

export function AddTenantDialog({
    isOpen,
    onOpenChange,
    onAddTenant,
    selectedHostel
}: AddTenantDialogProps) {
    const {
        // State
        roomSearchTerm,
        isLoadingRooms,
        showRoomSuggestions,
        filteredRooms,
        availableRooms,
        selectedRoom,
        formData,
        roomInputRef,

        // Actions
        handleRoomSelect,
        handleRoomInputChange,
        handleFormFieldChange,
        handleSave,
        resetForm
    } = useAddTenant({ selectedHostel, onAddTenant })

    const validateAndSave = async () => {
        const validation = validateTenantForm(formData, selectedRoom)
        if (!validation.isValid) {
            alert(validation.errorMessage)
            return
        }
        await handleSave()
    }

    const handleDialogChange = (open: boolean) => {
        onOpenChange(open)
        if (!open) {
            resetForm()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
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
                    {/* Room Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="room-number">Số phòng</Label>
                        <RoomSearchInput
                            roomSearchTerm={roomSearchTerm}
                            isLoadingRooms={isLoadingRooms}
                            showRoomSuggestions={showRoomSuggestions}
                            filteredRooms={filteredRooms}
                            availableRooms={availableRooms}
                            selectedRoom={selectedRoom}
                            roomInputRef={roomInputRef}
                            onRoomInputChange={handleRoomInputChange}
                            onRoomSelect={handleRoomSelect}
                            onFocus={() => { }} // Handled in hook
                        />
                    </div>

                    {/* Tenant Form Fields */}
                    <TenantFormFields
                        formData={formData}
                        onFormFieldChange={handleFormFieldChange}
                    />

                    {/* Room Rent Information */}
                    <RoomRentInfo selectedRoom={selectedRoom} />

                    {/* Contract Information */}
                    <ContractInfo rentMonths={formData.rentMonths} />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button type="button" onClick={validateAndSave}>
                        Lưu khách thuê
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
