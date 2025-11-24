import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Badge } from '@/components/admin/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { MessageSquare, Clock, CheckCircle, AlertCircle, Bell } from 'lucide-react'
import { NotificationManagerDialog } from '@/components/manager/dialogs/NotificationManagerDialog'
// @ts-ignore
import { getThongBaoByToaNha, updateThongBaoStatus } from '@/services/thong-bao.service'
// @ts-ignore
import { useManagerNotificationRealtime } from '@/hooks/useNotificationRealtime'
import {
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    NOTIFICATION_STATUS,
} from '@/utils/translations'

interface NotificationsPageProps {
    selectedHostel: any
}

export function NotificationsPage({ selectedHostel }: NotificationsPageProps) {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [showManagerDialog, setShowManagerDialog] = useState(false)

    const { realtimeStatus, notifications: realtimeNotifications } = useManagerNotificationRealtime(selectedHostel?.id, (event: any) => {
        console.log('📡 [NOTIFICATIONS PAGE] Realtime event received:', event)
        if (event && event.event === 'INSERT') {
            console.log('📡 [NOTIFICATIONS PAGE] New notification received, reloading list...')
            console.log('📡 [NOTIFICATIONS PAGE] New notification data:', event.data)
            // Reload lại danh sách để đảm bảo có đầy đủ dữ liệu
            // Đợi một chút để đảm bảo database đã commit transaction
            setTimeout(() => {
                loadNotifications()
            }, 1000)
        } else if (event && event.event === 'UPDATE') {
            console.log('📡 [NOTIFICATIONS PAGE] Notification updated:', event.data)
            // Cập nhật thông báo đã có trong danh sách
            setNotifications(prev => prev.map(n =>
                n.id === event.data.id ? event.data : n
            ))
        }
    })

    useEffect(() => {
        if (selectedHostel?.id) {
            loadNotifications()
        }
    }, [selectedHostel?.id])

    // Sync notifications từ realtime hook với local state
    // Chỉ sync khi có thông báo mới từ realtime
    useEffect(() => {
        if (realtimeNotifications && realtimeNotifications.length > 0 && notifications.length > 0) {
            // Kiểm tra xem có thông báo mới không (có trong realtime nhưng chưa có trong local)
            const newNotifications = realtimeNotifications.filter((rtNotif: any) =>
                !notifications.some((n: any) => n.id === rtNotif.id)
            )

            if (newNotifications.length > 0) {
                console.log('📡 [NOTIFICATIONS PAGE] Found new notifications from realtime, reloading...', newNotifications)
                // Reload lại để lấy đầy đủ dữ liệu từ server
                loadNotifications()
            }
        }
    }, [realtimeNotifications?.length]) // Chỉ trigger khi số lượng thay đổi

    // Không fetch lại khi đổi filter để tránh cảm giác reload

    const loadNotifications = async () => {
        if (!selectedHostel?.id) return
        try {
            setIsLoading(true)
            const data = await getThongBaoByToaNha(selectedHostel.id, filterStatus === 'all' ? null : filterStatus)
            setNotifications(data)
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (notificationId: number, newStatus: string) => {
        // Optimistic update để tránh cảm giác reload
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, trang_thai: newStatus } : n))
        try {
            await updateThongBaoStatus(notificationId, newStatus)
        } catch (error) {
            console.error('Error updating notification status:', error)
            // revert nếu lỗi
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, trang_thai: (n as any)._oldStatus || 'chua_xu_ly' } : n))
            alert('Có lỗi xảy ra khi cập nhật trạng thái')
        }
    }

    const updateNotificationStatusLocal = (id: number, newStatus: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, trang_thai: newStatus } : n))
    }

    const displayedNotifications = useMemo(() => {
        if (filterStatus === 'all') return notifications
        return notifications.filter((n: any) => n.trang_thai === filterStatus)
    }, [notifications, filterStatus])

    const handleManageNotification = (notification: any) => {
        setSelectedNotification(notification)
        setShowManagerDialog(true)
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý thông báo</h2>
                    <p className="text-gray-600">Xử lý thông báo từ khách thuê</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${realtimeStatus === 'connected'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                        <Bell className="h-4 w-4" />
                        <span>Realtime: {realtimeStatus}</span>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="chua_xu_ly">Chưa xử lý</SelectItem>
                                <SelectItem value="dang_xu_ly">Đang xử lý</SelectItem>
                                <SelectItem value="da_xu_ly">Đã xử lý</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            {displayedNotifications.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có thông báo nào</h3>
                        <p className="text-gray-500">
                            {filterStatus === 'all' ? 'Chưa có thông báo nào từ khách thuê' : `Chưa có thông báo nào với trạng thái "${filterStatus}"`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {displayedNotifications.map((notification: any) => (
                        <Card key={notification.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{notification.tieu_de}</h3>
                                            {getStatusBadge(notification.trang_thai)}
                                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                {getTypeLabel(notification.loai_thong_bao)}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {notification.noi_dung}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Khách thuê: {notification.khach_thue?.ho_ten || 'N/A'}</span>
                                            <span>SĐT: {notification.khach_thue?.sdt || 'N/A'}</span>
                                            <span>Phòng: {notification.can_ho?.so_can || 'N/A'}</span>
                                            <span>Ngày: {new Date(notification.ngay_tao).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleManageNotification(notification)}
                                        >
                                            Xử lý
                                        </Button>
                                        {notification.trang_thai === 'chua_xu_ly' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(notification.id, 'dang_xu_ly')}
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                Đang xử lý
                                            </Button>
                                        )}
                                        {notification.trang_thai === 'dang_xu_ly' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(notification.id, 'da_xu_ly')}
                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                            >
                                                Hoàn thành
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Manager Dialog */}
            <NotificationManagerDialog
                isOpen={showManagerDialog}
                onOpenChange={setShowManagerDialog}
                notification={selectedNotification}
                selectedHostel={selectedHostel}
                onStatusUpdate={updateNotificationStatusLocal}
            />
        </div>
    )
}


