import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { getBangGiaByToaNha, upsertBangGia } from "@/services/bang-gia.service"
import {
    Zap,
    Droplets,
    Settings,
    Save,
    Loader2
} from "lucide-react"

interface PriceUpdateDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    selectedHostel: any
}

export function PriceUpdateDialog({
    isOpen,
    onClose,
    onSuccess,
    selectedHostel
}: PriceUpdateDialogProps) {
    const [formData, setFormData] = useState<{
        gia_dien: string
        gia_nuoc: string
        gia_dich_vu: string
    }>({
        gia_dien: '',
        gia_nuoc: '',
        gia_dich_vu: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Load existing prices
    const loadPrices = async () => {
        if (!selectedHostel?.id) return

        setIsLoading(true)
        try {
            console.log('Loading prices for hostel:', selectedHostel.id)
            const bangGia = await getBangGiaByToaNha(selectedHostel.id)
            console.log('Loaded bang gia:', bangGia)

            if (bangGia) {
                setFormData({
                    gia_dien: bangGia.gia_dien?.toString() || '',
                    gia_nuoc: bangGia.gia_nuoc?.toString() || '',
                    gia_dich_vu: bangGia.gia_dich_vu?.toString() || ''
                })
            }
        } catch (error) {
            console.error('Error loading prices:', error)
            // Nếu chưa có bảng giá, để trống form
            setFormData({
                gia_dien: '',
                gia_nuoc: '',
                gia_dich_vu: ''
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadPrices()
        }
    }, [isOpen, selectedHostel])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.gia_dien) {
            newErrors.gia_dien = 'Vui lòng nhập giá điện'
        } else if (isNaN(Number(formData.gia_dien)) || Number(formData.gia_dien) <= 0) {
            newErrors.gia_dien = 'Giá điện phải là số dương'
        }

        if (!formData.gia_nuoc) {
            newErrors.gia_nuoc = 'Vui lòng nhập giá nước'
        } else if (isNaN(Number(formData.gia_nuoc)) || Number(formData.gia_nuoc) <= 0) {
            newErrors.gia_nuoc = 'Giá nước phải là số dương'
        }

        if (!formData.gia_dich_vu) {
            newErrors.gia_dich_vu = 'Vui lòng nhập giá dịch vụ'
        } else if (isNaN(Number(formData.gia_dich_vu)) || Number(formData.gia_dich_vu) <= 0) {
            newErrors.gia_dich_vu = 'Giá dịch vụ phải là số dương'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSaving(true)
        try {
            const submitData = {
                gia_dien: Number(formData.gia_dien),
                gia_nuoc: Number(formData.gia_nuoc),
                gia_dich_vu: Number(formData.gia_dich_vu)
            }

            console.log('Submitting price data:', submitData, 'for hostel:', selectedHostel.id)
            const result = await upsertBangGia(selectedHostel.id, submitData)
            console.log('Price update result:', result)

            alert('Cập nhật bảng giá thành công!')
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving prices:', error)
            const errorMessage = error instanceof Error ? error.message : 'Vui lòng thử lại.'
            alert(`Có lỗi xảy ra khi lưu bảng giá: ${errorMessage}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Đang tải bảng giá</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl font-bold">
                        <Settings className="mr-2 h-5 w-5 text-blue-600" />
                        Cập nhật bảng giá dịch vụ
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật giá điện, nước và dịch vụ cho khu trọ {selectedHostel?.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Giá điện */}
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg text-yellow-800">
                                <Zap className="mr-2 h-5 w-5" />
                                Giá điện
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="gia_dien" className="text-sm font-medium">
                                    Giá điện (VNĐ/kWh)
                                </Label>
                                <Input
                                    id="gia_dien"
                                    type="number"
                                    placeholder="Nhập giá điện"
                                    value={formData.gia_dien}
                                    onChange={(e) => handleInputChange('gia_dien', e.target.value)}
                                    className={errors.gia_dien ? 'border-red-500' : ''}
                                />
                                {errors.gia_dien && (
                                    <p className="text-sm text-red-600">{errors.gia_dien}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Giá nước */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg text-blue-800">
                                <Droplets className="mr-2 h-5 w-5" />
                                Giá nước
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="gia_nuoc" className="text-sm font-medium">
                                    Giá nước (VNĐ/m³)
                                </Label>
                                <Input
                                    id="gia_nuoc"
                                    type="number"
                                    placeholder="Nhập giá nước"
                                    value={formData.gia_nuoc}
                                    onChange={(e) => handleInputChange('gia_nuoc', e.target.value)}
                                    className={errors.gia_nuoc ? 'border-red-500' : ''}
                                />
                                {errors.gia_nuoc && (
                                    <p className="text-sm text-red-600">{errors.gia_nuoc}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Giá dịch vụ */}
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg text-green-800">
                                <Settings className="mr-2 h-5 w-5" />
                                Giá dịch vụ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="gia_dich_vu" className="text-sm font-medium">
                                    Giá dịch vụ (VNĐ/tháng)
                                </Label>
                                <Input
                                    id="gia_dich_vu"
                                    type="number"
                                    placeholder="Nhập giá dịch vụ"
                                    value={formData.gia_dich_vu}
                                    onChange={(e) => handleInputChange('gia_dich_vu', e.target.value)}
                                    className={errors.gia_dich_vu ? 'border-red-500' : ''}
                                />
                                {errors.gia_dich_vu && (
                                    <p className="text-sm text-red-600">{errors.gia_dich_vu}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Cập nhật bảng giá
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
