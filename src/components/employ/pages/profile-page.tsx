import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { updateKhachThue } from "@/services/khach-thue.service"
// @ts-ignore
import { supabase } from "@/services/supabase-client"
import {
    User,
    Phone,
    Mail,
    CreditCard,
    Edit,
    Save,
    X,
    AlertCircle
} from "lucide-react"

interface ProfilePageProps {
    userInfo: any
    onUserInfoUpdate?: (updatedInfo: any) => void
}

export function ProfilePage({ userInfo, onUserInfoUpdate }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editedInfo, setEditedInfo] = useState({
        ho_ten: userInfo?.ho_ten || '',
        sdt: userInfo?.sdt || '',
        email: userInfo?.email || '',
        cccd: userInfo?.cccd || ''
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedInfo({
            ho_ten: userInfo?.ho_ten || '',
            sdt: userInfo?.sdt || '',
            email: userInfo?.email || '',
            cccd: userInfo?.cccd || ''
        })
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

        // Kiểm tra email có bị trùng không
        try {
            const { data: emailData } = await supabase
                .from('khach_thue')
                .select('id')
                .eq('email', editedInfo.email)
                .neq('id', userInfo.id)

            if (emailData && emailData.length > 0) {
                alert('Email này đã được sử dụng bởi tài khoản khác. Vui lòng chọn email khác.')
                return false
            }
        } catch (error) {
            console.error('Error checking email:', error)
            alert('Không thể kiểm tra email. Vui lòng thử lại.')
            return false
        }

        // Kiểm tra số điện thoại có bị trùng không
        try {
            const { data: phoneData } = await supabase
                .from('khach_thue')
                .select('id')
                .eq('sdt', editedInfo.sdt)
                .neq('id', userInfo.id)

            if (phoneData && phoneData.length > 0) {
                alert('Số điện thoại này đã được sử dụng bởi tài khoản khác. Vui lòng chọn số điện thoại khác.')
                return false
            }
        } catch (error) {
            console.error('Error checking phone:', error)
            alert('Không thể kiểm tra số điện thoại. Vui lòng thử lại.')
            return false
        }

        return true
    }

    const handleSave = async () => {
        if (!userInfo?.id) {
            alert('Không tìm thấy ID khách thuê')
            return
        }

        // Validate form
        if (!(await validateForm())) {
            return
        }

        setIsSaving(true)
        try {
            console.log('Saving profile for user ID:', userInfo.id)
            console.log('Updated info:', editedInfo)

            // Cập nhật thông tin khách thuê
            const updatedUser = await updateKhachThue(userInfo.id, editedInfo)
            console.log('Updated user:', updatedUser)

            // Thông báo thành công
            alert('Cập nhật thông tin thành công!')

            // Thoát chế độ chỉnh sửa
            setIsEditing(false)

            // Cập nhật thông tin trong parent component
            if (onUserInfoUpdate) {
                onUserInfoUpdate(updatedUser)
            }

        } catch (error: any) {
            console.error('Error updating profile:', error)

            // Xử lý lỗi cụ thể
            let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.'

            if (error.code === '23505') { // PostgreSQL unique constraint violation
                if (error.message.includes('email')) {
                    errorMessage = 'Email này đã được sử dụng bởi tài khoản khác. Vui lòng chọn email khác.'
                } else if (error.message.includes('sdt')) {
                    errorMessage = 'Số điện thoại này đã được sử dụng bởi tài khoản khác. Vui lòng chọn số điện thoại khác.'
                } else if (error.message.includes('cccd')) {
                    errorMessage = 'CCCD/CMND này đã được sử dụng bởi tài khoản khác. Vui lòng kiểm tra lại.'
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

    const handleInputChange = (field: string, value: string) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có thông tin</h3>
                    <p className="text-gray-500">Không thể tải thông tin hồ sơ</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Hồ sơ cá nhân
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Quản lý thông tin cá nhân của bạn
                    </p>
                </div>
                <div className="flex space-x-2">
                    {!isEditing ? (
                        <Button onClick={handleEdit} className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex items-center"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Profile Information */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Thông tin cơ bản
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editedInfo.ho_ten}
                                            onChange={(e) => handleInputChange('ho_ten', e.target.value)}
                                            placeholder="Nhập họ và tên"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={editedInfo.sdt}
                                            onChange={(e) => handleInputChange('sdt', e.target.value)}
                                            placeholder="Nhập số điện thoại (10-11 số)"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={editedInfo.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Nhập email"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">CCCD/CMND</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editedInfo.cccd}
                                            onChange={(e) => handleInputChange('cccd', e.target.value)}
                                            placeholder="Nhập số CCCD/CMND"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-600">Họ và tên:</span>
                                    <span className="font-semibold">{userInfo.ho_ten || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                                    <span className="font-semibold">{userInfo.sdt || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-600">Email:</span>
                                    <span className="font-semibold">{userInfo.email || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-600">CCCD/CMND:</span>
                                    <span className="font-semibold">{userInfo.cccd || 'Chưa cập nhật'}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Thông tin tài khoản
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-gray-600">ID khách thuê:</span>
                            <span className="font-semibold">{userInfo.id || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-gray-600">Ngày tạo tài khoản:</span>
                            <span className="font-semibold">
                                {userInfo.created_at ? new Date(userInfo.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Hoạt động
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin bổ sung</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Lưu ý quan trọng</h4>
                                <p className="text-sm text-blue-700">
                                    Thông tin cá nhân của bạn sẽ được sử dụng để quản lý hợp đồng thuê phòng.
                                    Vui lòng cập nhật thông tin chính xác và đầy đủ để đảm bảo quá trình giao dịch diễn ra thuận lợi.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
