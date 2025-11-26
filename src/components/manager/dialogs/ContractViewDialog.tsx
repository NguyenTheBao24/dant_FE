import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import { FileText, Download, X } from 'lucide-react'
import { buildContractHtml } from '@/utils/tenant.utils'
import { generateAndDownloadPDF } from '@/utils/pdf.utils'

interface ContractViewDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    contract: any
}

export function ContractViewDialog({
    isOpen,
    onOpenChange,
    contract
}: ContractViewDialogProps) {
    if (!contract) return null

    const tenantInfo = contract?.khach_thue || {}
    const contractHtml = buildContractHtml({
        hostelName:
            contract?.toa_nha?.ten_toa || contract?.can_ho?.toa_nha?.ten_toa,
        roomNumber: contract?.can_ho?.so_can,
        tenantName: tenantInfo?.ho_ten,
        phone: tenantInfo?.sdt,
        email: tenantInfo?.email,
        startDate: contract?.ngay_bat_dau,
        endDate: contract?.ngay_ket_thuc,
        rentAmount: contract?.can_ho?.gia_thue || contract?.gia_thue,
        contractId: contract?.id,
        managerName: contract?.toa_nha?.quan_ly?.ho_ten,
        managerPhone: contract?.toa_nha?.quan_ly?.sdt,
        managerEmail: contract?.toa_nha?.quan_ly?.email
    })

    const handleDownload = async () => {
        try {
            const fileName = `hop-dong-${tenantInfo?.ho_ten || 'khach-thue'}-${contract?.can_ho?.so_can || 'phong'}.pdf`
            await generateAndDownloadPDF(contractHtml, fileName)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Có lỗi khi tạo PDF. Vui lòng thử lại.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center text-xl">
                            <FileText className="h-6 w-6 mr-2" />
                            Hợp đồng thuê phòng - Phòng {contract?.can_ho?.so_can || 'N/A'}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Contract Content */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <iframe
                            srcdoc={contractHtml}
                            className="w-full border-0"
                            style={{ minHeight: '800px' }}
                            title="Hợp đồng thuê phòng"
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button onClick={handleDownload} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Tải về PDF
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

