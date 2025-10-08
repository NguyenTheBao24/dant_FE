import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { createChiTieu, updateChiTieu } from "@/services/chi-tieu.service"
import { Calendar, DollarSign, Tag, FileText } from "lucide-react"

interface ExpenseDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    selectedHostel: any
    expenseData?: any
    isEdit?: boolean
}

const EXPENSE_TYPES = [
    "Điện nước",
    "Bảo trì",
    "Vệ sinh",
    "An ninh",
    "Marketing",
    "Thuế",
    "Bảo hiểm",
    "Lương quản lý",
    "Khác"
]

export function ExpenseDialog({
    isOpen,
    onClose,
    onSuccess,
    selectedHostel,
    expenseData,
    isEdit = false
}: ExpenseDialogProps) {
    const [formData, setFormData] = useState<{
        ngay: string
        loai_chi: string
        so_tien: string
        mo_ta: string
    }>({
        ngay: '',
        loai_chi: '',
        so_tien: '',
        mo_ta: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (isEdit && expenseData) {
            setFormData({
                ngay: expenseData.ngay || '',
                loai_chi: expenseData.loai_chi || '',
                so_tien: expenseData.so_tien?.toString() || '',
                mo_ta: expenseData.mo_ta || ''
            })
        } else {
            // Set ngày hiện tại cho chi tiêu mới
            const today = new Date().toISOString().split('T')[0]
            setFormData({
                ngay: today,
                loai_chi: '',
                so_tien: '',
                mo_ta: ''
            })
        }
        setErrors({})
    }, [isEdit, expenseData, isOpen])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.ngay) {
            newErrors.ngay = 'Vui lòng chọn ngày'
        }

        if (!formData.loai_chi) {
            newErrors.loai_chi = 'Vui lòng chọn loại chi'
        }

        if (!formData.so_tien) {
            newErrors.so_tien = 'Vui lòng nhập số tiền'
        } else if (isNaN(Number(formData.so_tien)) || Number(formData.so_tien) <= 0) {
            newErrors.so_tien = 'Số tiền phải là số dương'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        try {
            const submitData = {
                toa_nha_id: selectedHostel.id,
                ngay: formData.ngay,
                loai_chi: formData.loai_chi,
                so_tien: Number(formData.so_tien),
                mo_ta: formData.mo_ta || undefined
            }

            if (isEdit && expenseData) {
                await updateChiTieu(expenseData.id, submitData)
            } else {
                await createChiTieu(submitData)
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving expense:', error)
            alert('Có lỗi xảy ra khi lưu chi tiêu. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl font-bold">
                        <DollarSign className="mr-2 h-5 w-5 text-red-600" />
                        {isEdit ? 'Sửa chi tiêu' : 'Thêm chi tiêu mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Cập nhật thông tin chi tiêu' : 'Thêm chi tiêu mới cho khu trọ'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ngày */}
                    <div className="space-y-2">
                        <Label htmlFor="ngay" className="flex items-center text-sm font-medium">
                            <Calendar className="mr-2 h-4 w-4" />
                            Ngày chi tiêu *
                        </Label>
                        <Input
                            id="ngay"
                            type="date"
                            value={formData.ngay}
                            onChange={(e) => handleInputChange('ngay', e.target.value)}
                            className={errors.ngay ? 'border-red-500' : ''}
                        />
                        {errors.ngay && (
                            <p className="text-sm text-red-600">{errors.ngay}</p>
                        )}
                    </div>

                    {/* Loại chi */}
                    <div className="space-y-2">
                        <Label htmlFor="loai_chi" className="flex items-center text-sm font-medium">
                            <Tag className="mr-2 h-4 w-4" />
                            Loại chi tiêu *
                        </Label>
                        <Select
                            value={formData.loai_chi}
                            onValueChange={(value) => handleInputChange('loai_chi', value)}
                        >
                            <SelectTrigger className={errors.loai_chi ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Chọn loại chi tiêu" />
                            </SelectTrigger>
                            <SelectContent>
                                {EXPENSE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.loai_chi && (
                            <p className="text-sm text-red-600">{errors.loai_chi}</p>
                        )}
                    </div>

                    {/* Số tiền */}
                    <div className="space-y-2">
                        <Label htmlFor="so_tien" className="flex items-center text-sm font-medium">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Số tiền (VNĐ) *
                        </Label>
                        <Input
                            id="so_tien"
                            type="number"
                            placeholder="Nhập số tiền"
                            value={formData.so_tien}
                            onChange={(e) => handleInputChange('so_tien', e.target.value)}
                            className={errors.so_tien ? 'border-red-500' : ''}
                        />
                        {errors.so_tien && (
                            <p className="text-sm text-red-600">{errors.so_tien}</p>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="mo_ta" className="flex items-center text-sm font-medium">
                            <FileText className="mr-2 h-4 w-4" />
                            Mô tả (tùy chọn)
                        </Label>
                        <Textarea
                            id="mo_ta"
                            placeholder="Nhập mô tả chi tiết về chi tiêu..."
                            value={formData.mo_ta}
                            onChange={(e) => handleInputChange('mo_ta', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
