import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Button } from '@/components/admin/ui/button'
import { Badge } from '@/components/admin/ui/badge'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog'
import { MessageSquare, Clock, CheckCircle, AlertCircle, Bell, Send } from 'lucide-react'
import { NotificationManagerDialog } from '@/components/manager/dialogs/NotificationManagerDialog'
// @ts-ignore
import { getThongBaoByToaNha, updateThongBaoStatus, createThongBao } from '@/services/thong-bao.service'
// @ts-ignore
import { useManagerNotificationRealtime } from '@/hooks/useNotificationRealtime'
// @ts-ignore
import { listHopDongByToaNha } from '@/services/hop-dong.service'
import {
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    NOTIFICATION_STATUS,
    NOTIFICATION_TYPE,
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
    const [activeContracts, setActiveContracts] = useState<any[]>([])
    const [isContractsLoading, setIsContractsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [sendError, setSendError] = useState('')
    const [sendResult, setSendResult] = useState<{ success: number; total: number } | null>(null)
    const [showSendDialog, setShowSendDialog] = useState(false)
    const [filterRoom, setFilterRoom] = useState('all')
    const [filterRoomSearch, setFilterRoomSearch] = useState('')
    const [roomSearchTerm, setRoomSearchTerm] = useState('')
    const initialSendForm = useMemo(() => ({
        target: 'single',
        roomId: '',
        loai_thong_bao: NOTIFICATION_TYPE.KHAC,
        tieu_de: '',
        noi_dung: ''
    }), [])
    const [sendForm, setSendForm] = useState(initialSendForm)

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

    useEffect(() => {
        if (selectedHostel?.id) {
            loadNotifications()
        }
    }, [filterStatus, filterRoom])

    useEffect(() => {
        if (selectedHostel?.id) {
            loadActiveContracts()
        } else {
            setActiveContracts([])
        }
    }, [selectedHostel?.id])

    useEffect(() => {
        if (!showSendDialog) {
            setSendForm(initialSendForm)
            setSendError('')
            setSendResult(null)
            setIsSending(false)
            setRoomSearchTerm('')
        }
    }, [showSendDialog, initialSendForm])

    useEffect(() => {
        if (filterRoom === 'all') {
            setFilterRoomSearch('')
        }
    }, [filterRoom])

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
            const selectedRoom = filterRoom === 'all' ? null : filterRoom
            const data = await getThongBaoByToaNha(
                selectedHostel.id,
                filterStatus === 'all' ? null : filterStatus,
                selectedRoom,
            )
            setNotifications(data)
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadActiveContracts = async () => {
        if (!selectedHostel?.id) return
        try {
            setIsContractsLoading(true)
            const contracts = await listHopDongByToaNha(selectedHostel.id)
            if (!contracts || !contracts.length) {
                setActiveContracts([])
                return
            }
            const latestByRoom = new Map<number, any>()
            contracts.forEach((contract: any) => {
                if (contract.trang_thai !== 'hieu_luc') return
                const existing = latestByRoom.get(contract.can_ho_id)
                if (!existing) {
                    latestByRoom.set(contract.can_ho_id, contract)
                    return
                }
                const currentStart = existing.ngay_bat_dau ? new Date(existing.ngay_bat_dau).getTime() : 0
                const newStart = contract.ngay_bat_dau ? new Date(contract.ngay_bat_dau).getTime() : 0
                if (newStart >= currentStart) {
                    latestByRoom.set(contract.can_ho_id, contract)
                }
            })
            setActiveContracts(Array.from(latestByRoom.values()))
        } catch (error) {
            console.error('Error loading active contracts:', error)
            setActiveContracts([])
        } finally {
            setIsContractsLoading(false)
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
        return notifications.filter((n: any) => {
            const matchesStatus = filterStatus === 'all' || n.trang_thai === filterStatus
            const roomId = n.can_ho?.id ?? n.can_ho_id
            const matchesRoom =
                filterRoom === 'all' ||
                (roomId !== undefined && String(filterRoom) === String(roomId))
            return matchesStatus && matchesRoom
        })
    }, [notifications, filterStatus, filterRoom])

    const handleManageNotification = (notification: any) => {
        setSelectedNotification(notification)
        setShowManagerDialog(true)
    }

    const roomOptions = useMemo(() => {
        return activeContracts.map((contract: any) => {
            const roomName = contract.can_ho?.so_can || `Phòng ${contract.can_ho_id}`
            const tenantName = contract.khach_thue?.ho_ten || 'Chưa cập nhật'
            return {
                id: contract.can_ho_id,
                label: `${roomName} - ${tenantName}`,
            }
        })
    }, [activeContracts])

    const filterRoomOptions = useMemo(() => {
        const optionsMap = new Map<string, { id: number | string; label: string }>()

        notifications.forEach((notification: any) => {
            const roomId = notification.can_ho?.id || notification.can_ho_id
            if (!roomId) return
            const roomLabel = notification.can_ho?.so_can || `Phòng ${roomId}`
            const tenantLabel = notification.khach_thue?.ho_ten || 'Khách thuê'
            if (!optionsMap.has(String(roomId))) {
                optionsMap.set(String(roomId), {
                    id: roomId,
                    label: `${roomLabel} - ${tenantLabel}`,
                })
            }
        })

        roomOptions.forEach((option) => {
            if (!optionsMap.has(String(option.id))) {
                optionsMap.set(String(option.id), option)
            }
        })

        return Array.from(optionsMap.values())
    }, [notifications, roomOptions])

    const filteredSendRoomOptions = useMemo(() => {
        const term = roomSearchTerm.trim().toLowerCase()
        if (!term) return roomOptions
        return roomOptions.filter(option => option.label.toLowerCase().includes(term))
    }, [roomOptions, roomSearchTerm])

    const filteredFilterRoomOptions = useMemo(() => {
        const term = filterRoomSearch.trim().toLowerCase()
        if (!term) return []
        return filterRoomOptions
            .filter(option => option.label.toLowerCase().includes(term))
            .slice(0, 10)
    }, [filterRoomOptions, filterRoomSearch])

    const selectedFilterRoomLabel = useMemo(() => {
        if (filterRoom === 'all') return ''
        const match = filterRoomOptions.find(option => String(option.id) === filterRoom)
        return match?.label || ''
    }, [filterRoom, filterRoomOptions])

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

    const handleSendFormChange = (field: string, value: string) => {
        setSendForm((prev) => ({
            ...prev,
            [field]: value,
        }))
        if (sendError) setSendError('')
        if (sendResult) setSendResult(null)
    }

    const handleTargetChange = (target: 'single' | 'all') => {
        setSendForm((prev) => ({
            ...prev,
            target,
            roomId: target === 'all' ? '' : prev.roomId,
        }))
        if (target === 'all') {
            setRoomSearchTerm('')
        }
        if (sendError) setSendError('')
        if (sendResult) setSendResult(null)
    }

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedHostel?.id) {
            setSendError('Vui lòng chọn tòa nhà để gửi thông báo.')
            return
        }

        if (!sendForm.tieu_de.trim() || !sendForm.noi_dung.trim()) {
            setSendError('Vui lòng nhập đầy đủ tiêu đề và nội dung.')
            return
        }

        const targets =
            sendForm.target === 'all'
                ? activeContracts
                : activeContracts.filter((contract: any) =>
                    String(contract.can_ho_id) === sendForm.roomId
                )

        if (sendForm.target === 'single' && !sendForm.roomId) {
            setSendError('Vui lòng chọn phòng muốn gửi thông báo.')
            return
        }

        if (!targets.length) {
            setSendError('Không tìm thấy phòng phù hợp để gửi thông báo.')
            return
        }

        setIsSending(true)
        setSendError('')
        setSendResult(null)

        let success = 0
        for (const target of targets) {
            if (!target?.khach_thue_id) continue
            const payload = {
                khach_thue_id: target.khach_thue_id,
                toa_nha_id: selectedHostel.id,
                can_ho_id: target.can_ho_id || target.can_ho?.id,
                tieu_de: sendForm.tieu_de.trim(),
                noi_dung: sendForm.noi_dung.trim(),
                loai_thong_bao: sendForm.loai_thong_bao,
            }
            try {
                await createThongBao(payload)
                success++
            } catch (error) {
                console.error('Error sending notification to room:', target.can_ho_id, error)
            }
        }

        if (success === 0) {
            setSendError('Không thể gửi thông báo. Vui lòng thử lại.')
        } else {
            setSendResult({ success, total: targets.length })
            setSendForm(initialSendForm)
            setShowSendDialog(false)
            loadNotifications()
        }

        setIsSending(false)
    }

    const canSubmit =
        activeContracts.length > 0 &&
        sendForm.tieu_de.trim() &&
        sendForm.noi_dung.trim() &&
        (sendForm.target === 'all' || !!sendForm.roomId)

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
                    <p className="text-gray-600">Xử lý yêu cầu/khiếu nại và gửi thông báo đến khách thuê</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="default"
                        onClick={() => setShowSendDialog(true)}
                    >
                        Gửi thông báo
                    </Button>
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
                <CardContent className="p-4 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0">
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-medium text-gray-700">Lọc trạng thái:</label>
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
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Lọc phòng (nhập tên phòng):</label>
                            {filterRoom !== 'all' && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilterRoom('all')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Bỏ lọc
                                </Button>
                            )}
                        </div>
                        <Input
                            value={filterRoomSearch}
                            onChange={(e) => {
                                setFilterRoomSearch(e.target.value)
                                if (!e.target.value.trim()) {
                                    setFilterRoom('all')
                                }
                            }}
                            placeholder="Nhập tên phòng (ví dụ: A101, B203...)"
                        />
                        {filterRoom !== 'all' && selectedFilterRoomLabel && (
                            <p className="text-sm text-green-700">
                                Đang lọc theo: {selectedFilterRoomLabel}
                            </p>
                        )}
                        <div className="max-h-40 overflow-auto border rounded-lg divide-y">
                            {filterRoomSearch.trim().length === 0 ? (
                                <p className="p-3 text-sm text-gray-500">
                                    Nhập ít nhất 1 ký tự để tìm phòng cụ thể
                                </p>
                            ) : filteredFilterRoomOptions.length === 0 ? (
                                <p className="p-3 text-sm text-gray-500">Không tìm thấy phòng phù hợp</p>
                            ) : (
                                filteredFilterRoomOptions.map(option => (
                                    <button
                                        type="button"
                                        key={option.id}
                                        onClick={() => {
                                            setFilterRoom(String(option.id))
                                            setFilterRoomSearch(option.label.split(' - ')[0])
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${filterRoom === String(option.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
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

            {/* Send Notification Dialog */}
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                            Gửi thông báo đến khách thuê
                        </DialogTitle>
                        <p className="text-sm text-gray-500">
                            Gửi thông báo cho từng phòng hoặc toàn bộ phòng đang được thuê
                        </p>
                    </DialogHeader>

                    {isContractsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500 text-sm">Đang tải danh sách phòng...</p>
                            </div>
                        </div>
                    ) : activeContracts.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                Hiện tại không có phòng nào đang được thuê, hãy kiểm tra lại danh sách hợp đồng để gửi thông báo.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSendNotification} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Đối tượng nhận</label>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        variant={sendForm.target === 'single' ? 'default' : 'outline'}
                                        onClick={() => handleTargetChange('single')}
                                    >
                                        Gửi 1 phòng
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={sendForm.target === 'all' ? 'default' : 'outline'}
                                        onClick={() => handleTargetChange('all')}
                                    >
                                        Gửi tất cả phòng đang thuê
                                    </Button>
                                </div>
                            </div>

                            {sendForm.target === 'single' && (
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nhập tên phòng <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={roomSearchTerm}
                                        onChange={(e) => {
                                            setRoomSearchTerm(e.target.value)
                                            setSendForm(prev => ({ ...prev, roomId: '' }))
                                            if (sendError) setSendError('')
                                        }}
                                        placeholder="Nhập ví dụ: A101, B203..."
                                    />
                                    {sendForm.roomId && (
                                        <p className="text-sm text-green-700">
                                            Đã chọn: {roomOptions.find(option => String(option.id) === sendForm.roomId)?.label}
                                        </p>
                                    )}
                                    <div className="max-h-40 overflow-auto border rounded-lg divide-y">
                                        {roomSearchTerm.trim().length === 0 ? (
                                            <p className="p-3 text-sm text-gray-500">
                                                Nhập ít nhất 1 ký tự để hiển thị danh sách phòng
                                            </p>
                                        ) : filteredSendRoomOptions.length === 0 ? (
                                            <p className="p-3 text-sm text-gray-500">Không tìm thấy phòng phù hợp</p>
                                        ) : (
                                            filteredSendRoomOptions.slice(0, 10).map(option => (
                                                <button
                                                    type="button"
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSendForm(prev => ({ ...prev, roomId: String(option.id) }))
                                                        setRoomSearchTerm(option.label.split(' - ')[0])
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${sendForm.roomId === String(option.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại thông báo</label>
                                    <Select
                                        value={sendForm.loai_thong_bao}
                                        onValueChange={(value) => handleSendFormChange('loai_thong_bao', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn loại thông báo" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="start">
                                            {Object.values(NOTIFICATION_TYPE).map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {getNotificationTypeLabel(type)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={sendForm.tieu_de}
                                        onChange={(e) => handleSendFormChange('tieu_de', e.target.value)}
                                        placeholder="Nhập tiêu đề thông báo..."
                                        maxLength={255}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={sendForm.noi_dung}
                                    onChange={(e) => handleSendFormChange('noi_dung', e.target.value)}
                                    placeholder="Nhập nội dung thông báo..."
                                    className="min-h-[140px]"
                                    maxLength={1500}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {sendForm.noi_dung.length}/1500 ký tự
                                </p>
                            </div>

                            {sendError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                    {sendError}
                                </div>
                            )}

                            {sendResult && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                                    Đã gửi thành công {sendResult.success}/{sendResult.total} phòng.
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isSending}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSending ? (
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
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}


