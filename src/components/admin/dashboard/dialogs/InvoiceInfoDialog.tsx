import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Badge } from '@/components/admin/ui/badge'
import { Receipt } from 'lucide-react'
// @ts-ignore
import { getPaymentStatusLabel, getPaymentStatusColor } from '@/utils/translations'

interface InvoiceInfoDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    invoice: any
}

export function InvoiceInfoDialog({ isOpen, onOpenChange, invoice }: InvoiceInfoDialogProps) {
    if (!invoice) return null
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                        Thông tin hóa đơn
                    </DialogTitle>
                </DialogHeader>
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Mã hóa đơn:</span>
                            <span className="font-medium">{invoice.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phòng:</span>
                            <span className="font-medium">{invoice.room_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Khách thuê:</span>
                            <span className="font-medium">{invoice.tenant_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Ngày tạo:</span>
                            <span className="font-medium">{new Date(invoice.ngay_tao).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-semibold text-green-700">{(invoice.so_tien || 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Trạng thái:</span>
                            <Badge variant="outline" className={getPaymentStatusColor(invoice.trang_thai)}>
                                {getPaymentStatusLabel(invoice.trang_thai)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
