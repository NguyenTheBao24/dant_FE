import { useEffect, useState } from 'react'
import { realtimeService } from '../services/realtime.service'

/**
 * Hook Realtime cho thông báo theo tòa nhà (cho quản lý)
 * @param {number} toaNhaId - ID tòa nhà
 * @param {function} callback - Hàm callback để xử lý events
 * @returns {{ notifications: any[], realtimeStatus: string, unreadCount: number }}
 */
export function useManagerNotificationRealtime(toaNhaId, callback) {
    const [notifications, setNotifications] = useState([])
    const [realtimeStatus, setRealtimeStatus] = useState('connecting')
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (!toaNhaId) {
            setRealtimeStatus('disabled')
            return
        }

        // Đảm bảo toa_nha_id là string (có thể là "TN000000..." hoặc number)
        const toaNhaIdString = String(toaNhaId).trim()
        const channelName = `thong_bao-realtime-toa_nha_id-${toaNhaIdString}`

        const handleRealtimeEvent = (event) => {
            console.log('📡 [MANAGER NOTIFICATION] Event received:', event)
            console.log('📡 [MANAGER NOTIFICATION] Event type:', event.event)
            console.log('📡 [MANAGER NOTIFICATION] Event data:', event.data)
            setRealtimeStatus('connected')

            // Cập nhật danh sách thông báo
            setNotifications(prev => {
                let newNotifications = [...prev]

                switch (event.event) {
                    case 'INSERT':
                        if (event.data && event.data.id) {
                            const exists = newNotifications.some(n => n.id === event.data.id)
                            if (!exists) {
                                console.log('📡 [MANAGER NOTIFICATION] Adding new notification:', event.data)
                                newNotifications.unshift(event.data)
                                // Tăng unread count nếu là thông báo mới
                                if (event.data.trang_thai === 'chua_xu_ly') {
                                    setUnreadCount(prev => prev + 1)
                                }
                            } else {
                                console.log('📡 [MANAGER NOTIFICATION] Notification already exists, skipping')
                            }
                        } else {
                            console.warn('📡 [MANAGER NOTIFICATION] INSERT event missing data or id:', event)
                        }
                        break
                    case 'UPDATE':
                        if (event.data && event.data.id) {
                            newNotifications = newNotifications.map(notif => {
                                if (notif.id === event.data.id) {
                                    // Cập nhật unread count khi trạng thái thay đổi
                                    if (notif.trang_thai === 'chua_xu_ly' && event.data.trang_thai !== 'chua_xu_ly') {
                                        setUnreadCount(prev => Math.max(0, prev - 1))
                                    } else if (notif.trang_thai !== 'chua_xu_ly' && event.data.trang_thai === 'chua_xu_ly') {
                                        setUnreadCount(prev => prev + 1)
                                    }
                                    return event.data
                                }
                                return notif
                            })
                        }
                        break
                    case 'DELETE':
                        if (event.old && event.old.id) {
                            newNotifications = newNotifications.filter(notif => notif.id !== event.old.id)
                            // Giảm unread count nếu thông báo bị xóa là chưa xử lý
                            if (event.old.trang_thai === 'chua_xu_ly') {
                                setUnreadCount(prev => Math.max(0, prev - 1))
                            }
                        }
                        break
                }

                return newNotifications
            })

            // Gọi callback để component cha có thể reload danh sách
            if (callback) {
                callback(event)
            }
        }

        console.log(`📡 [MANAGER NOTIFICATION] Subscribing to notifications for toa_nha_id=${toaNhaIdString}`)
        const channel = realtimeService.subscribe('thong_bao', 'toa_nha_id', toaNhaIdString, handleRealtimeEvent)

        // Cleanup function
        return () => {
            console.log(`🔌 [MANAGER NOTIFICATION] Unsubscribing from notifications for toa_nha_id=${toaNhaIdString}`)
            realtimeService.unsubscribe(channelName)
        }
    }, [toaNhaId, callback])

    return { notifications, realtimeStatus, unreadCount }
}

/**
 * Hook Realtime cho thông báo theo khách thuê (cho khách thuê)
 * @param {number} khachThueId - ID khách thuê
 * @param {function} callback - Hàm callback để xử lý events
 * @returns {{ notifications: any[], realtimeStatus: string }}
 */
export function useEmployNotificationRealtime(khachThueId, callback) {
    const [notifications, setNotifications] = useState([])
    const [realtimeStatus, setRealtimeStatus] = useState('connecting')

    useEffect(() => {
        if (!khachThueId) {
            setRealtimeStatus('disabled')
            return
        }

        const channelName = `thong_bao-realtime-khach_thue_id-${khachThueId}`

        const handleRealtimeEvent = (event) => {
            console.log('📡 [EMPLOY NOTIFICATION] Event received:', event)
            setRealtimeStatus('connected')

            // Cập nhật danh sách thông báo
            setNotifications(prev => {
                let newNotifications = [...prev]

                switch (event.event) {
                    case 'INSERT':
                        newNotifications.unshift(event.data)
                        break
                    case 'UPDATE':
                        newNotifications = newNotifications.map(notif =>
                            notif.id === event.data.id ? event.data : notif
                        )
                        break
                    case 'DELETE':
                        newNotifications = newNotifications.filter(notif => notif.id !== event.old.id)
                        break
                }

                return newNotifications
            })

            if (callback) {
                callback(event)
            }

        }

        console.log(`📡 [EMPLOY NOTIFICATION] Subscribing to notifications for khach_thue_id=${khachThueId}`)
        const channel = realtimeService.subscribe('thong_bao', 'khach_thue_id', khachThueId, handleRealtimeEvent)

        // Cleanup function
        return () => {
            console.log(`🔌 [EMPLOY NOTIFICATION] Unsubscribing from notifications for khach_thue_id=${khachThueId}`)
            realtimeService.unsubscribe(channelName)
        }
    }, [khachThueId, callback])

    return { notifications, realtimeStatus }
}

/**
 * Hook Realtime cho phản hồi thông báo
 * @param {number} thongBaoId - ID thông báo
 * @param {function} callback - Hàm callback để xử lý events
 * @returns {{ responses: any[], realtimeStatus: string }}
 */
export function useResponseRealtime(thongBaoId, callback) {
    const [responses, setResponses] = useState([])
    const [realtimeStatus, setRealtimeStatus] = useState('connecting')

    useEffect(() => {
        if (!thongBaoId) {
            setRealtimeStatus('disabled')
            return
        }

        const channelName = `phan_hoi_thong_bao-realtime-thong_bao_id-${thongBaoId}`

        const handleRealtimeEvent = (event) => {
            console.log('📡 [RESPONSE REALTIME] Event received:', event)
            console.log('📡 [RESPONSE REALTIME] Event data:', event.data)
            console.log('📡 [RESPONSE REALTIME] Event type:', event.event)
            setRealtimeStatus('connected')

            // Cập nhật danh sách phản hồi cho đúng thông báo, chống trùng id
            setResponses(prev => {
                let newResponses = [...prev]

                switch (event.event) {
                    case 'INSERT': {
                        if (event.data && event.data.id) {
                            const exists = newResponses.some(r => r.id === event.data.id)
                            if (!exists) {
                                console.log('📡 [RESPONSE REALTIME] Adding new response:', event.data)
                                newResponses.push(event.data)
                            } else {
                                console.log('📡 [RESPONSE REALTIME] Response already exists, skipping')
                            }
                        } else {
                            console.warn('📡 [RESPONSE REALTIME] INSERT event missing data or id:', event)
                        }
                        break
                    }
                    case 'UPDATE':
                        if (event.data && event.data.id) {
                            newResponses = newResponses.map(resp =>
                                resp.id === event.data.id ? event.data : resp
                            )
                        }
                        break
                    case 'DELETE':
                        if (event.old && event.old.id) {
                            newResponses = newResponses.filter(resp => resp.id !== event.old.id)
                        }
                        break
                }

                return newResponses
            })

            if (callback) callback(event)
        }

        console.log(`📡 [RESPONSE REALTIME] Subscribing to responses for thong_bao_id=${thongBaoId}`)
        const channel = realtimeService.subscribe('phan_hoi_thong_bao', 'thong_bao_id', thongBaoId, handleRealtimeEvent)

        // Cleanup function
        return () => {
            console.log(`🔌 [RESPONSE REALTIME] Unsubscribing from responses for thong_bao_id=${thongBaoId}`)
            realtimeService.unsubscribe(channelName)
        }
    }, [thongBaoId, callback])

    return { responses, realtimeStatus }
}
