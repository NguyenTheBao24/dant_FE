import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { MessageSquare, Send, X } from 'lucide-react'
// @ts-ignore
import { createThongBao } from '@/services/thong-bao.service'

interface SendNotificationDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    userInfo: any
    userContracts: any[]
}

export function SendNotificationDialog({
    isOpen,
    onOpenChange,
    userInfo,
    userContracts
}: SendNotificationDialogProps) {
    const [formData, setFormData] = useState({
        tieu_de: '',
        noi_dung: '',
        loai_thong_bao: 'phan_anh',
        can_ho_id: null as number | null,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const activeContract = userContracts.find(contract => contract.trang_thai === 'hieu_luc')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.tieu_de.trim() || !formData.noi_dung.trim()) {
            setError('Vui lòng điền đầy đủ tiêu đề và nội dung')
            return
        }

        if (!activeContract) {
            setError('Không tìm thấy hợp đồng hiệu lực')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // Validate các trường bắt buộc
            const toaNhaId = activeContract.can_ho?.toa_nha_id || activeContract.toa_nha_id
            const canHoId = activeContract.can_ho_id || activeContract.can_ho?.id

            console.log('SendNotificationDialog - activeContract:', activeContract)
            console.log('SendNotificationDialog - toaNhaId:', toaNhaId)
            console.log('SendNotificationDialog - canHoId:', canHoId)
            console.log('SendNotificationDialog - userInfo.id:', userInfo?.id)

            if (!userInfo?.id) {
                setError('Không tìm thấy thông tin khách thuê')
                setIsSubmitting(false)
                return
            }

            if (!toaNhaId) {
                setError('Không tìm thấy thông tin tòa nhà. Vui lòng liên hệ quản trị viên.')
                setIsSubmitting(false)
                return
            }

            if (!canHoId) {
                setError('Không tìm thấy thông tin phòng. Vui lòng liên hệ quản trị viên.')
                setIsSubmitting(false)
                return
            }

            const notificationData = {
                khach_thue_id: userInfo.id,
                toa_nha_id: toaNhaId,
                can_ho_id: canHoId,
                tieu_de: formData.tieu_de.trim(),
                noi_dung: formData.noi_dung.trim(),
                loai_thong_bao: formData.loai_thong_bao
            }

            console.log('SendNotificationDialog - notificationData:', notificationData)

            const result = await createThongBao(notificationData)

            if (result) {
                alert('Gửi thông báo thành công!')
                setFormData({ tieu_de: '', noi_dung: '', loai_thong_bao: 'phan_anh', can_ho_id: null })
                onOpenChange(false)
            }
        } catch (error: any) {
            console.error('Error sending notification:', error)
            setError('Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                        Gửi thông báo cho quản lý
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeContract && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Thông tin hợp đồng</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-600">Phòng:</span>
                                    <span className="ml-2 font-medium">{activeContract.can_ho?.so_can || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-blue-600">Tòa nhà:</span>
                                    <span className="ml-2 font-medium">{activeContract.toa_nha?.ten_toa || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.tieu_de}
                            onChange={(e) => handleInputChange('tieu_de', e.target.value)}
                            placeholder="Nhập tiêu đề thông báo..."
                            className="w-full"
                            maxLength={255}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại thông báo
                        </label>
                        <Select
                            value={formData.loai_thong_bao}
                            onValueChange={(value) => handleInputChange('loai_thong_bao', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn loại thông báo" />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                align="start"
                                sideOffset={4}
                                className="z-50 min-w-[var(--radix-select-trigger-width)] w-[var(--radix-select-trigger-width)]"
                            >
                                <SelectItem value="sua_chua">Sửa chữa</SelectItem>
                                <SelectItem value="phan_anh">Phản ánh</SelectItem>
                                <SelectItem value="khac">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.noi_dung}
                            onChange={(e) => handleInputChange('noi_dung', e.target.value)}
                            placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                            className="w-full min-h-[120px]"
                            maxLength={2000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.noi_dung.length}/2000 ký tự
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.tieu_de.trim() || !formData.noi_dung.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Gửi thông báo
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}


