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
import { validateTenantForm, buildContractHtml } from "../../../utils/tenant.utils"
import { generateAndDownloadPDF, generatePDFForEmail } from "../../../utils/pdf.utils"
// @ts-ignore
import { sendContractEmail } from "../../../services/email.service"

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
    const isBackgroundRunningRef = (typeof window !== 'undefined') ? (window as any).__contract_bg_ref || { current: false } : { current: false }
    // store ref globally to avoid strict-mode double invoke triggering twice
    if (typeof window !== 'undefined' && !(window as any).__contract_bg_ref) {
        ; (window as any).__contract_bg_ref = isBackgroundRunningRef
    }
    const handleShowContract = async (data: any) => {
        const { hopDong, khachThue, room, contractInfo, hostel } = data
        const html = buildContractHtml({
            hostelName: hostel?.ten_toa || hostel?.name,
            roomNumber: room.room_number,
            tenantName: khachThue.ho_ten,
            phone: khachThue.sdt,
            email: khachThue.email,
            startDate: contractInfo.startDate,
            rentAmount: Number(room.rent_amount || 0),
            contractId: hopDong.id,
            managerName: selectedHostel?.quan_ly?.ho_ten || selectedHostel?.managerName,
            managerPhone: selectedHostel?.quan_ly?.sdt || selectedHostel?.managerPhone,
            managerEmail: selectedHostel?.quan_ly?.email || selectedHostel?.managerEmail
        })

        // Background: tạo PDF để tải xuống và gửi email, không chặn UI, không alert
        setTimeout(async () => {
            if (isBackgroundRunningRef.current) return
            isBackgroundRunningRef.current = true
            try {
                // 1) Tạo và tải PDF xuống cho người quản lý
                await generateAndDownloadPDF(
                    html,
                    `hop-dong-${khachThue.ho_ten}-${room.room_number}.pdf`
                )

                // 2) Tạo PDF base64 và gửi qua email cho khách thuê
                const { base64 } = await generatePDFForEmail(
                    html,
                    `hop-dong-${khachThue.ho_ten}-${room.room_number}.pdf`
                )
                await sendContractEmail({
                    toEmail: khachThue.email,
                    tenantName: khachThue.ho_ten,
                    contractPdfBase64: base64,
                    contractId: hopDong.id,
                    hostelName: hostel?.ten_toa || hostel?.name,
                    roomNumber: room.room_number
                })
            } catch (error) {
                console.error('Background contract email error:', error)
            } finally { isBackgroundRunningRef.current = false }
        }, 0)
    }

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
        , isSaving
    } = useAddTenant({ selectedHostel, onAddTenant, onContractCreated: handleShowContract })

    const validateAndSave = async () => {
        const validation = validateTenantForm(formData, selectedRoom)
        if (!validation.isValid) {
            alert(validation.errorMessage)
            return
        }
        await handleSave()
        // Đóng dialog ngay, hiển thị thông báo thành công nhẹ
        onOpenChange(false)
        try {
            // @ts-ignore
            if (window?.toast) {
                // @ts-ignore
                window.toast.success('Đã thêm khách thuê thành công')
            }
        } catch { }
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
                    <Button type="button" onClick={validateAndSave} disabled={isSaving}>
                        Lưu khách thuê
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
