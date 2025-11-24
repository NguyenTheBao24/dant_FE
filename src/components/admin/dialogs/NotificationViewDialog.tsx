import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog'
import { Badge } from '@/components/admin/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/card'
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Phone, Mail, Eye } from 'lucide-react'
// @ts-ignore
import { getPhanHoiByThongBao } from '@/services/phan-hoi-thong-bao.service'
// @ts-ignore
import { useResponseRealtime } from '@/hooks/useNotificationRealtime'
import {
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    NOTIFICATION_STATUS,
} from '@/utils/translations'

interface NotificationViewDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    notification: any
    selectedHostel: any
}

export function NotificationViewDialog({
    isOpen,
    onOpenChange,
    notification,
    selectedHostel
}: NotificationViewDialogProps) {
    const [responses, setResponses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const responsesEndRef = React.useRef<HTMLDivElement>(null)

    const { realtimeStatus } = useResponseRealtime(notification?.id || null, (event: any) => {
        if (event && event.event === 'INSERT') {
            setResponses(prev => {
                const exists = prev.some(r => r.id === event.data.id)
                return exists ? prev : [...prev, event.data]
            })
        }
    })

    useEffect(() => {
        if (notification && notification.id && isOpen) {
            loadResponses()
        }
    }, [notification, isOpen])

    // Auto scroll khi có phản hồi mới
    useEffect(() => {
        if (responses.length > 0 && responsesEndRef.current) {
            setTimeout(() => {
                responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
    }, [responses.length])

    const loadResponses = async () => {
        if (!notification?.id) return
        try {
            setIsLoading(true)
            const data = await getPhanHoiByThongBao(notification.id)
            setResponses(data || [])
        } catch (error) {
            console.error('Error loading responses:', error)
            setResponses([])
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusBadge = (trangThai: string) => {
        const label = getNotificationStatusLabel(trangThai)
        const colorClass = getNotificationStatusColor(trangThai)

        let icon = <Clock className="h-3 w-3 mr-1" />
        if (trangThai === NOTIFICATION_STATUS.DANG_XU_LY) {
            icon = <AlertCircle className="h-3 w-3 mr-1" />
        } else if (trangThai === NOTIFICATION_STATUS.DA_XU_LY) {
            icon = <CheckCircle className="h-3 w-3 mr-1" />
        }

        return (
            <Badge variant="outline" className={colorClass}>
                {icon}
                {label}
            </Badge>
        )
    }

    const getTypeLabel = (loaiThongBao: string) => {
        return getNotificationTypeLabel(loaiThongBao)
    }

    if (!notification || !isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <Eye className="h-5 w-5 mr-2 text-blue-600" />
                        Xem thông báo (Chế độ xem)
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin thông báo */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {notification.tieu_de}
                                    </h3>
                                    <div className="flex items-center space-x-3 mb-3">
                                        {getStatusBadge(notification.trang_thai)}
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {getTypeLabel(notification.loai_thong_bao)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p>Ngày gửi: {new Date(notification.ngay_tao).toLocaleDateString('vi-VN')}</p>
                                    <p>Giờ: {new Date(notification.ngay_tao).toLocaleTimeString('vi-VN')}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Nội dung:</h4>
                                <p className="text-gray-800 whitespace-pre-wrap">{notification.noi_dung}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Phòng:</span>
                                    <span className="ml-2 font-medium">{notification.can_ho?.so_can || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Tòa nhà:</span>
                                    <span className="ml-2 font-medium">{selectedHostel?.ten_toa || 'N/A'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thông tin khách thuê */}
                    {notification.khach_thue && (
                        <Card>
                            <CardHeader>
                                <h4 className="font-semibold text-gray-900">Thông tin khách thuê</h4>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{notification.khach_thue?.ho_ten || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">Họ tên</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{notification.khach_thue?.sdt || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">Số điện thoại</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{notification.khach_thue?.email || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">Email</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Thông báo chế độ xem */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Eye className="h-5 w-5 text-blue-600" />
                                <p className="text-sm text-blue-800">
                                    Bạn đang ở chế độ xem. Chỉ có thể xem thông báo và cuộc hội thoại, không thể tham gia nhắn tin.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danh sách phản hồi */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">Cuộc hội thoại</h4>
                                <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${realtimeStatus === 'connected'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${realtimeStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    <span>{realtimeStatus === 'connected' ? 'Live' : 'Offline'}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Đang tải phản hồi...</p>
                                </div>
                            ) : responses.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có phản hồi nào</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {responses.map((response: any) => (
                                        <div
                                            key={response.id}
                                            className={`flex ${response.nguoi_gui_loai === 'quan_ly' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-3 rounded-lg ${response.nguoi_gui_loai === 'quan_ly'
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium text-sm">
                                                        {response.nguoi_gui_loai === 'quan_ly' ? 'Quản lý' : 'Khách thuê'}
                                                    </span>
                                                    <span className="text-xs opacity-70">
                                                        {new Date(response.created_at).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">{response.noi_dung}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={responsesEndRef} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

