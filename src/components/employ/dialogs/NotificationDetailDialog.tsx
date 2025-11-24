import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import { Textarea } from '@/components/admin/ui/textarea'
import { Badge } from '@/components/admin/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/card'
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'
// @ts-ignore
import { createPhanHoiThongBao, getPhanHoiByThongBao } from '@/services/phan-hoi-thong-bao.service'
// @ts-ignore
import { useResponseRealtime } from '@/hooks/useNotificationRealtime'
// @ts-ignore
import {
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    NOTIFICATION_STATUS,
} from '@/utils/translations'

interface NotificationDetailDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    notification: any
    userInfo: any
}

export function NotificationDetailDialog({
    isOpen,
    onOpenChange,
    notification,
    userInfo
}: NotificationDetailDialogProps) {
    try {
        const [responses, setResponses] = useState<any[]>([])
        const [newResponse, setNewResponse] = useState('')
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [isLoading, setIsLoading] = useState(false)
        const [showSuccessMessage, setShowSuccessMessage] = useState(false)
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
            if (notification?.id && isOpen) loadResponses()
        }, [notification?.id, isOpen])

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

        const handleSendResponse = async (e: React.FormEvent) => {
            e.preventDefault()
            if (!newResponse.trim() || !notification?.id) return
            setIsSubmitting(true)
            try {
                const responseData = {
                    thong_bao_id: notification.id,
                    nguoi_gui_loai: 'khach_thue',
                    nguoi_gui_id: userInfo?.id,
                    noi_dung: newResponse.trim()
                }
                const result = await createPhanHoiThongBao(responseData)
                if (result) {
                    setShowSuccessMessage(true)
                    setTimeout(() => setShowSuccessMessage(false), 3000)
                    setTimeout(() => {
                        responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }, 150)
                }
                setNewResponse('')
            } catch (error) {
                console.error('Error sending response:', error)
                alert('Có lỗi xảy ra khi gửi phản hồi')
            } finally {
                setIsSubmitting(false)
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
                            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                            Chi tiết thông báo
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
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Nội dung:</h4>
                                    <p className="text-gray-800 whitespace-pre-wrap">{notification.noi_dung}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Phòng:</span>
                                        <span className="ml-2 font-medium">{notification.can_ho?.so_can || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Tòa nhà:</span>
                                        <span className="ml-2 font-medium">{notification.toa_nha?.ten_toa || 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danh sách phản hồi */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">Phản hồi</h4>
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
                                                className={`flex ${response.nguoi_gui_loai === 'khach_thue' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] p-3 rounded-lg ${response.nguoi_gui_loai === 'khach_thue'
                                                    ? 'bg-blue-100 text-blue-900'
                                                    : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <User className="h-4 w-4" />
                                                        <span className="font-medium text-sm">
                                                            {response.nguoi_gui_loai === 'khach_thue' ? 'Bạn' : 'Quản lý'}
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

                        {/* Success message */}
                        {showSuccessMessage && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Phản hồi đã được gửi thành công!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form gửi phản hồi */}
                        <Card>
                            <CardHeader>
                                <h4 className="font-semibold text-gray-900">Gửi phản hồi</h4>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSendResponse} className="space-y-4">
                                    <Textarea
                                        value={newResponse}
                                        onChange={(e) => setNewResponse(e.target.value)}
                                        placeholder="Nhập phản hồi của bạn..."
                                        className="w-full min-h-[100px]"
                                        maxLength={1000}
                                    />
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            {newResponse.length}/1000 ký tự
                                        </p>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !newResponse.trim()}
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
                                                    Gửi phản hồi
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        )
    } catch (error) {
        console.error('Error in NotificationDetailDialog:', error)
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Lỗi</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <p className="text-gray-600 mb-4">
                            Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại.
                        </p>
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full"
                        >
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}


