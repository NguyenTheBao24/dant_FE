import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Receipt, Save, X } from "lucide-react"

// Import types
import { CreateInvoiceDialogProps } from "../../../types/invoice.types"

// Import custom hook
import { useInvoiceCalculator } from "../../../hooks/useInvoiceCalculator"

// Import utils
import { validateInvoiceForm } from "../../../utils/invoice.utils"

// Import components
import {
    RoomInfoCard,
    MeterInputCard,
    RoomRentCard,
    ServiceCard,
    TotalCard,
    ErrorAlert
} from "./invoice"

// Import services
// @ts-ignore
import { createHoaDon } from "@/services/hoa-don.service"

export function CreateInvoiceDialog({
    isOpen,
    onOpenChange,
    room,
    selectedHostel,
    onInvoiceCreated
}: CreateInvoiceDialogProps) {
    const {
        isLoading,
        bangGia,
        hopDong,
        invoiceData,
        handleInputChange
    } = useInvoiceCalculator({ isOpen, room, selectedHostel })

    const validateForm = () => {
        const validation = validateInvoiceForm(invoiceData, hopDong, bangGia)
        if (!validation.isValid) {
            alert(validation.errorMessage)
            return false
        }
        return true
    }

    const handleSave = async () => {
        if (!validateForm()) return

        try {
            const hoaDonPayload = {
                hop_dong_id: invoiceData.hop_dong_id,
                so_tien: invoiceData.tong_tien
            }

            console.log('Creating invoice:', hoaDonPayload)
            const createdInvoice = await createHoaDon(hoaDonPayload)
            console.log('Invoice created:', createdInvoice)

            alert('Tạo hóa đơn thành công!')
            onInvoiceCreated()
            onOpenChange(false)

        } catch (error: any) {
            console.error('Error creating invoice:', error)
            alert('Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại.')
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    if (!room || !selectedHostel) return null

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center">
                            <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                            Tạo hóa đơn thanh toán
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Đang tải dữ liệu...</span>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center">
                        <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                        Tạo hóa đơn thanh toán tháng {invoiceData.thang}/{invoiceData.nam}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Thông tin phòng và khách thuê */}
                    <RoomInfoCard room={room} hopDong={hopDong} />

                    {/* Error alert nếu không có hợp đồng */}
                    {!hopDong && (
                        <ErrorAlert message="Phòng này chưa có hợp đồng hiệu lực. Không thể tạo hóa đơn." />
                    )}

                    {/* Form tạo hóa đơn */}
                    {hopDong && bangGia && (
                        <>
                            {/* Chỉ số điện nước */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MeterInputCard
                                    type="electricity"
                                    invoiceData={invoiceData}
                                    bangGia={bangGia}
                                    onInputChange={handleInputChange}
                                />
                                <MeterInputCard
                                    type="water"
                                    invoiceData={invoiceData}
                                    bangGia={bangGia}
                                    onInputChange={handleInputChange}
                                />
                            </div>

                            {/* Tiền phòng */}
                            <RoomRentCard room={room} />

                            {/* Dịch vụ dùng chung */}
                            <ServiceCard invoiceData={invoiceData} bangGia={bangGia} />

                            {/* Tổng cộng */}
                            <TotalCard invoiceData={invoiceData} bangGia={bangGia} room={room} />
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hopDong || !bangGia}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Tạo hóa đơn
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
