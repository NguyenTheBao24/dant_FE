import { supabase } from './supabase-client'

export interface Room {
    id: number
    hostel_id: number
    room_number: string
    room_type: 'single' | 'double' | 'vip'
    rent_amount: number
    status: 'available' | 'occupied' | 'maintenance'
    created_at?: string
    updated_at?: string
}

export interface RoomStats {
    total: number
    available: number
    occupied: number
    maintenance: number
}

export interface RoomConfig {
    room_number: string
    room_type: 'single' | 'double' | 'vip'
    rent_amount: number
    status?: 'available' | 'occupied' | 'maintenance'
}

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

/**
 * Lấy danh sách tất cả phòng của một khu trọ
 */
export const getRoomsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock rooms')
        return [
            { id: 1, room_number: 'A101', room_type: 'single', rent_amount: 2500000, status: 'available' },
            { id: 2, room_number: 'A102', room_type: 'single', rent_amount: 2500000, status: 'occupied' },
            { id: 3, room_number: 'A103', room_type: 'single', rent_amount: 2500000, status: 'available' },
        ]
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('hostel_id', hostelId)
            .order('room_number')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching rooms by hostel:', error)
        throw error
    }
}

/**
 * Lấy danh sách phòng còn trống của một khu trọ
 */
export const getAvailableRoomsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock available rooms')
        return [
            { id: 1, room_number: 'A101', room_type: 'single', rent_amount: 2500000, status: 'available' },
            { id: 3, room_number: 'A103', room_type: 'single', rent_amount: 2500000, status: 'available' },
        ]
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('hostel_id', hostelId)
            .eq('status', 'available')
            .order('room_number')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching available rooms by hostel:', error)
        throw error
    }
}

/**
 * Lấy thông tin chi tiết một phòng
 */
export const getRoomById = async (roomId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock room')
        return { id: roomId, room_number: 'A101', room_type: 'single', rent_amount: 2500000, status: 'available' }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', roomId)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching room by id:', error)
        throw error
    }
}

/**
 * Tạo phòng mới
 */
export const createRoom = async (roomData) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock create room')
        return { ...roomData, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .insert(roomData)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating room:', error)
        throw error
    }
}

/**
 * Cập nhật thông tin phòng
 */
export const updateRoom = async (roomId, updates) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update room')
        return { ...updates, id: roomId }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .update(updates)
            .eq('id', roomId)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating room:', error)
        throw error
    }
}

/**
 * Xóa phòng
 */
export const deleteRoom = async (roomId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete room')
        return { id: roomId }
    }

    try {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', roomId)

        if (error) throw error
        return { id: roomId }
    } catch (error) {
        console.error('Error deleting room:', error)
        throw error
    }
}

/**
 * Tạo nhiều phòng cùng lúc cho một khu trọ
 */
export const createMultipleRooms = async (hostelId, roomConfigs) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock create multiple rooms')
        return roomConfigs.map((config, index) => ({ ...config, id: Date.now() + index }))
    }

    try {
        const roomsData = roomConfigs.map(config => ({
            hostel_id: hostelId,
            ...config
        }))

        const { data, error } = await supabase
            .from('rooms')
            .insert(roomsData)
            .select()

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error creating multiple rooms:', error)
        throw error
    }
}

/**
 * Lấy thống kê phòng của một khu trọ
 */
export const getRoomStatsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock room stats')
        return {
            total: 20,
            available: 15,
            occupied: 3,
            maintenance: 2
        }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('status')
            .eq('hostel_id', hostelId)

        if (error) throw error

        const stats = {
            total: data.length,
            available: data.filter(room => room.status === 'available').length,
            occupied: data.filter(room => room.status === 'occupied').length,
            maintenance: data.filter(room => room.status === 'maintenance').length
        }

        return stats
    } catch (error) {
        console.error('Error fetching room stats:', error)
        throw error
    }
}
