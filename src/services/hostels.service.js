import { supabase } from './supabase-client'

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    console.log('Supabase config check:', { url, key: key ? 'present' : 'missing' })
    return url && key && url !== 'https://placeholder.supabase.co'
}

export async function getHostels() {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for hostels')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('hostels')
            .select(`
                *,
                managers (
                    id,
                    name,
                    phone,
                    email,
                    avatar,
                    experience
                )
            `)
            .order('id')

        if (error) throw error

        return data.map(hostel => ({
            ...hostel,
            manager: hostel.managers || {
                id: null,
                name: 'Chưa có quản lý',
                phone: '',
                email: '',
                avatar: '',
                experience: ''
            }
        }))
    } catch (error) {
        console.error('Error fetching hostels:', error)
        throw error
    }
}

export async function updateManager(managerId, updates) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { ...updates, id: managerId }
    }

    try {
        const { data, error } = await supabase
            .from('managers')
            .update(updates)
            .eq('id', managerId)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating manager:', error)
        throw error
    }
}

export async function createHostel(hostelData) {
    console.log('createHostel called with:', hostelData)

    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
        return { ...hostelData, id: Date.now() }
    }

    try {
        console.log('Attempting to create hostel in Supabase...')
        const { data, error } = await supabase
            .from('hostels')
            .insert([hostelData])
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            throw error
        }

        console.log('Successfully created hostel:', data)

        // Tạo phòng cố định cho khu trọ mới
        await createFixedRoomsForHostel(data.id, hostelData.rooms || 10)

        return data
    } catch (error) {
        console.error('Error creating hostel:', error)
        throw error
    }
}

export async function deleteHostel(hostelId) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete')
        return { id: hostelId }
    }

    try {
        const { error } = await supabase
            .from('hostels')
            .delete()
            .eq('id', hostelId)

        if (error) throw error
        return { id: hostelId }
    } catch (error) {
        console.error('Error deleting hostel:', error)
        throw error
    }
}

export async function updateHostelOccupancy(hostelId, occupancy) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { id: hostelId, occupancy }
    }

    try {
        console.log('Updating hostel occupancy:', { hostelId, occupancy })

        const { data, error } = await supabase
            .from('hostels')
            .update({ occupancy })
            .eq('id', hostelId)
            .select()

        if (error) {
            console.error('Supabase error updating occupancy:', error)
            throw error
        }

        if (!data || data.length === 0) {
            console.warn('No hostel found with ID:', hostelId)
            return { id: hostelId, occupancy }
        }

        console.log('Successfully updated hostel occupancy:', data[0])
        return data[0]
    } catch (error) {
        console.error('Error updating hostel occupancy:', error)
        // Don't throw error, just log it and return mock data
        return { id: hostelId, occupancy }
    }
}

export async function calculateAndUpdateHostelOccupancy(hostelId) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock calculation')
        return { id: hostelId, occupancy: 0 }
    }

    try {
        // Đếm số tenants active cho hostel này
        const { count, error } = await supabase
            .from('tenants')
            .select('*', { count: 'exact', head: true })
            .eq('hostel_id', hostelId)
            .eq('status', 'active')

        if (error) {
            console.error('Error counting tenants:', error)
            throw error
        }

        const occupancy = count || 0
        console.log(`Calculated occupancy for hostel ${hostelId}: ${occupancy}`)

        // Cập nhật occupancy trong database
        return await updateHostelOccupancy(hostelId, occupancy)
    } catch (error) {
        console.error('Error calculating hostel occupancy:', error)
        return { id: hostelId, occupancy: 0 }
    }
}

// Tạo phòng cố định cho khu trọ mới
export async function createFixedRoomsForHostel(hostelId, totalRooms) {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, skipping room creation')
        return []
    }

    try {
        console.log(`Creating ${totalRooms} fixed rooms for hostel ${hostelId}`)

        // Tạo danh sách phòng cố định
        const rooms = []
        const roomTypes = ['Phòng đơn', 'Phòng đôi', 'Phòng VIP']
        const rentAmounts = [2500000, 3500000, 4500000]

        for (let i = 1; i <= totalRooms; i++) {
            const floor = Math.ceil(i / 10) // Tầng 1: 1-10, Tầng 2: 11-20, ...
            const roomNumber = `A${String(i).padStart(3, '0')}`
            const roomTypeIndex = (i - 1) % 3 // Luân phiên loại phòng
            const roomType = roomTypes[roomTypeIndex]
            const rentAmount = rentAmounts[roomTypeIndex]

            rooms.push({
                hostel_id: hostelId,
                room_number: roomNumber,
                room_type: roomType,
                rent_amount: rentAmount,
                status: 'available',
                area: roomType === 'Phòng VIP' ? 25 : roomType === 'Phòng đôi' ? 20 : 15,
                floor: floor,
                description: `${roomType} tại tầng ${floor}`
            })
        }

        // Thêm phòng vào database
        const { data, error } = await supabase
            .from('rooms')
            .insert(rooms)
            .select()

        if (error) {
            console.error('Error creating fixed rooms:', error)
            throw error
        }

        console.log(`Successfully created ${data.length} fixed rooms for hostel ${hostelId}`)
        return data
    } catch (error) {
        console.error('Error creating fixed rooms for hostel:', error)
        // Không throw error để không ảnh hưởng đến việc tạo khu trọ
        return []
    }
}
