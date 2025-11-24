import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Badge } from '@/components/admin/ui/badge'
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
// @ts-ignore
import { SendNotificationDialog } from '@/components/employ/dialogs/SendNotificationDialog'
// @ts-ignore
import { NotificationDetailDialog } from '@/components/employ/dialogs/NotificationDetailDialog'
// @ts-ignore
import { getThongBaoByKhachThue } from '@/services/thong-bao.service'
// @ts-ignore
import { useEmployNotificationRealtime } from '@/hooks/useNotificationRealtime'
// @ts-ignore
import {
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    NOTIFICATION_STATUS,
} from '@/utils/translations'

interface NotificationsPageProps {
    userInfo: any
    userContracts: any[]
}

export function NotificationsPage({ userInfo, userContracts }: NotificationsPageProps) {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [showSendDialog, setShowSendDialog] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [showDetailDialog, setShowDetailDialog] = useState(false)

    // Realtime: reload list immediately on events
    const { realtimeStatus } = useEmployNotificationRealtime(userInfo?.id, () => {
        if (userInfo?.id) loadNotifications()
    })

    useEffect(() => {
        if (userInfo?.id) loadNotifications()
    }, [userInfo?.id])

    const loadNotifications = async () => {
        try {
            setIsLoading(true)
            setErrorMessage('')
            const data = await getThongBaoByKhachThue(userInfo.id)
            setNotifications(data)
        } catch (error) {
            console.error('Error loading notifications:', error)
            const msg = typeof error === 'string'
                ? error
                : (error as any)?.message || 'Lỗi tải dữ liệu thông báo'
            setErrorMessage(msg)
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

    const handleViewDetail = (notification: any) => {
        setSelectedNotification(notification)
        setShowDetailDialog(true)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải thông báo...</h3>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">
                    <div className="font-semibold mb-1">Không tải được thông báo</div>
                    <div className="text-sm break-all">{errorMessage}</div>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Thông báo</h2>
                    <p className="text-gray-600">Gửi và xem thông báo với quản lý</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${realtimeStatus === 'connected'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                        <span>{realtimeStatus === 'connected' ? 'Live' : 'Offline'}</span>
                    </div>
                    <Button
                        onClick={() => setShowSendDialog(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Gửi thông báo
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có thông báo nào</h3>
                        <p className="text-gray-500 mb-4">Bạn chưa gửi thông báo nào cho quản lý</p>
                        <Button
                            onClick={() => setShowSendDialog(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Gửi thông báo đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification: any) => (
                        <Card key={notification.id} className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleViewDetail(notification)}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{notification.tieu_de}</h3>
                                            {getStatusBadge(notification.trang_thai)}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {notification.noi_dung}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Loại: {getTypeLabel(notification.loai_thong_bao)}</span>
                                            <span>Phòng: {notification.can_ho?.so_can || 'N/A'}</span>
                                            <span>Tòa nhà: {notification.toa_nha?.ten_toa || 'N/A'}</span>
                                            <span>Ngày: {new Date(notification.ngay_tao).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleViewDetail(notification)
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <SendNotificationDialog
                isOpen={showSendDialog}
                onOpenChange={setShowSendDialog}
                userInfo={userInfo}
                userContracts={userContracts}
            />

            <NotificationDetailDialog
                isOpen={showDetailDialog}
                onOpenChange={setShowDetailDialog}
                notification={selectedNotification}
                userInfo={userInfo}
            />
        </div>
    )
}


