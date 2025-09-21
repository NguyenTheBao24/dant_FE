import { supabase } from './supabase-client'

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

// Lấy tất cả phòng của một khu trọ
export const getRoomsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock rooms')
        return [
            { id: 1, room_number: 'A101', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
            { id: 2, room_number: 'A102', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'occupied' },
            { id: 3, room_number: 'A103', room_type: 'Phòng đôi', rent_amount: 3500000, status: 'available' },
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

// Lấy danh sách phòng còn trống
export const getAvailableRoomsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock available rooms')
        return [
            { id: 1, room_number: 'A101', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
            { id: 3, room_number: 'A103', room_type: 'Phòng đôi', rent_amount: 3500000, status: 'available' },
        ]
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('hostel_id', hostelId)
            .eq('status', 'available')
            .order('room_number')

        if (error) {
            // Nếu bảng rooms chưa tồn tại, trả về danh sách phòng mặc định
            if (error.code === 'PGRST205' || error.message?.includes('relation "rooms" does not exist')) {
                console.log('Rooms table does not exist, returning default rooms')
                return getDefaultRoomsForHostel(hostelId)
            }
            throw error
        }
        return data || []
    } catch (error) {
        console.error('Error fetching available rooms:', error)
        // Fallback về danh sách phòng mặc định
        return getDefaultRoomsForHostel(hostelId)
    }
}

// Hàm tạo danh sách phòng mặc định khi bảng rooms chưa tồn tại
const getDefaultRoomsForHostel = (hostelId) => {
    const defaultRooms = [
        { id: 1, room_number: 'A101', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
        { id: 2, room_number: 'A102', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
        { id: 3, room_number: 'A103', room_type: 'Phòng đôi', rent_amount: 3500000, status: 'available' },
        { id: 4, room_number: 'A104', room_type: 'Phòng đôi', rent_amount: 3500000, status: 'available' },
        { id: 5, room_number: 'A201', room_type: 'Phòng VIP', rent_amount: 4500000, status: 'available' },
        { id: 6, room_number: 'A202', room_type: 'Phòng VIP', rent_amount: 4500000, status: 'available' },
        { id: 7, room_number: 'A203', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
        { id: 8, room_number: 'A204', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' },
    ]

    // Lọc phòng dựa trên hostelId (giả sử hostelId 1 = A, hostelId 2 = B)
    if (hostelId === 2) {
        return defaultRooms.map(room => ({
            ...room,
            room_number: room.room_number.replace('A', 'B'),
            rent_amount: room.rent_amount - 500000 // Giảm giá cho khu trọ B
        }))
    }

    return defaultRooms
}

// Lấy thông tin chi tiết một phòng
export const getRoomById = async (roomId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock room')
        return { id: roomId, room_number: 'A101', room_type: 'Phòng đơn', rent_amount: 2500000, status: 'available' }
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

// Tạo phòng mới
export const createRoom = async (roomData) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock create')
        return { ...roomData, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .insert([roomData])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating room:', error)
        throw error
    }
}

// Cập nhật thông tin phòng
export const updateRoom = async (roomId, updates) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
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

// Xóa phòng
export const deleteRoom = async (roomId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete')
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

// Cập nhật trạng thái phòng (available/occupied/maintenance)
export const updateRoomStatus = async (roomId, status) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock status update')
        return { id: roomId, status }
    }

    try {
        const { data, error } = await supabase
            .from('rooms')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', roomId)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating room status:', error)
        throw error
    }
}

// Lấy thống kê phòng của một khu trọ
export const getRoomStatsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock stats')
        return {
            total: 8,
            available: 5,
            occupied: 3,
            maintenance: 0
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
