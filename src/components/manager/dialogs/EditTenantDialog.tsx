import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { updateKhachThue } from "@/services/khach-thue.service"
import {
    User,
    Phone,
    Mail,
    CreditCard,
    Save,
    X,
    AlertCircle
} from "lucide-react"

interface EditTenantDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    tenant: any
    onUpdateSuccess: () => void
}

export function EditTenantDialog({
    isOpen,
    onOpenChange,
    tenant,
    onUpdateSuccess
}: EditTenantDialogProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [editedInfo, setEditedInfo] = useState({
        ho_ten: '',
        sdt: '',
        email: '',
        cccd: ''
    })

    // Load tenant info khi dialog mở
    useEffect(() => {
        if (isOpen && tenant) {
            setEditedInfo({
                ho_ten: tenant.name || '',
                sdt: tenant.phone || '',
                email: tenant.email || '',
                cccd: '' // CCCD không có trong tenant object từ hop_dong
            })
        }
    }, [isOpen, tenant])

    const handleInputChange = (field: string, value: string) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = async () => {
        if (!editedInfo.ho_ten.trim()) {
            alert('Vui lòng nhập họ và tên')
            return false
        }

        if (!editedInfo.sdt.trim()) {
            alert('Vui lòng nhập số điện thoại')
            return false
        }

        if (!editedInfo.email.trim()) {
            alert('Vui lòng nhập email')
            return false
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editedInfo.email)) {
            alert('Email không đúng định dạng')
            return false
        }

        // Validate phone format (Vietnamese phone number)
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(editedInfo.sdt.replace(/\s/g, ''))) {
            alert('Số điện thoại không đúng định dạng (10-11 số)')
            return false
        }

        return true
    }

    const handleSave = async () => {
        if (!tenant?.khachThueId) {
            alert('Không tìm thấy ID khách thuê')
            return
        }

        // Validate form
        if (!(await validateForm())) {
            return
        }

        setIsSaving(true)
        try {
            console.log('Updating tenant with ID:', tenant.khachThueId)
            console.log('Updated info:', editedInfo)

            // Cập nhật thông tin khách thuê
            const updatedTenant = await updateKhachThue(tenant.khachThueId, editedInfo)
            console.log('Updated tenant:', updatedTenant)

            // Thông báo thành công
            alert('Cập nhật thông tin khách thuê thành công!')

            // Đóng dialog
            onOpenChange(false)

            // Reload data
            onUpdateSuccess()

        } catch (error: any) {
            console.error('Error updating tenant:', error)

            // Xử lý lỗi cụ thể
            let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.'

            if (error.code === '23505') { // PostgreSQL unique constraint violation
                if (error.message.includes('email')) {
                    errorMessage = 'Email này đã được sử dụng bởi khách thuê khác. Vui lòng chọn email khác.'
                } else if (error.message.includes('sdt')) {
                    errorMessage = 'Số điện thoại này đã được sử dụng bởi khách thuê khác. Vui lòng chọn số điện thoại khác.'
                } else if (error.message.includes('cccd')) {
                    errorMessage = 'CCCD/CMND này đã được sử dụng bởi khách thuê khác. Vui lòng kiểm tra lại.'
                }
            } else if (error.status === 409) {
                errorMessage = 'Thông tin đã tồn tại trong hệ thống. Vui lòng kiểm tra lại email, số điện thoại hoặc CCCD.'
            } else if (error.message) {
                errorMessage = `Lỗi: ${error.message}`
            }

            alert(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    if (!tenant) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Chỉnh sửa thông tin khách thuê
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Thông tin cá nhân
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <User className="h-4 w-4 mr-1 text-blue-500" />
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    value={editedInfo.ho_ten}
                                    onChange={(e) => handleInputChange('ho_ten', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <Phone className="h-4 w-4 mr-1 text-green-500" />
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    value={editedInfo.sdt}
                                    onChange={(e) => handleInputChange('sdt', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <Mail className="h-4 w-4 mr-1 text-purple-500" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={editedInfo.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <CreditCard className="h-4 w-4 mr-1 text-orange-500" />
                                    CCCD/CMND
                                </label>
                                <input
                                    type="text"
                                    value={editedInfo.cccd}
                                    onChange={(e) => handleInputChange('cccd', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập số CCCD/CMND"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thông tin hiện tại (readonly) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Thông tin hợp đồng hiện tại
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phòng</label>
                                <p className="text-lg font-semibold text-blue-600">Phòng {tenant.room}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Tiền thuê/tháng</label>
                                <p className="text-lg font-semibold text-green-600">
                                    {tenant.rentAmount ? tenant.rentAmount.toLocaleString('vi-VN') : 'N/A'}₫
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Ngày bắt đầu hợp đồng</label>
                                <p className="text-lg">
                                    {tenant.contractStart ? new Date(tenant.contractStart).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Ngày kết thúc hợp đồng</label>
                                <p className="text-lg">
                                    {tenant.contractEnd ? new Date(tenant.contractEnd).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu thay đổi
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
