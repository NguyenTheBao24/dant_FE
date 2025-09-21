import { supabase } from './supabase-client'
import { updateRoomStatus } from './rooms.service'

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

export const getTenants = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for tenants')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching tenants:', error)
        throw error
    }
}

export const getTenantsByHostel = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for tenants by hostel')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .eq('hostel_id', hostelId)
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching tenants by hostel:', error)
        throw error
    }
}

export const createTenant = async (tenant) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock create')
        return { ...tenant, id: Date.now() }
    }

    try {
        // Chỉ gửi các trường có trong schema của bảng tenants
        const validFields = {
            name: tenant.name,
            phone: tenant.phone,
            email: tenant.email,
            room_number: tenant.room_number,
            room_id: tenant.room_id,
            hostel_id: tenant.hostel_id,
            move_in_date: tenant.move_in_date,
            rent_amount: tenant.rent_amount,
            emergency_phone: tenant.emergency_phone,
            months_rented: tenant.months_rented,
            status: tenant.status || 'active'
        }

        // Loại bỏ các trường undefined/null
        const cleanFields = Object.fromEntries(
            Object.entries(validFields).filter(([_, value]) => value !== undefined && value !== null)
        )

        console.log('Creating tenant with fields:', cleanFields)

        const { data, error } = await supabase
            .from('tenants')
            .insert(cleanFields)
            .select()
            .single()

        if (error) throw error

        // Cập nhật trạng thái phòng thành 'occupied' nếu có room_id
        if (data.room_id) {
            try {
                await updateRoomStatus(data.room_id, 'occupied')
                console.log('Updated room status to occupied for room:', data.room_id)
            } catch (roomError) {
                console.error('Failed to update room status:', roomError)
                // Không throw error để không ảnh hưởng đến việc tạo tenant
            }
        }

        return data
    } catch (error) {
        console.error('Error creating tenant:', error)
        throw error
    }
}

export const updateTenant = async (id, updates) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { ...updates, id: id }
    }

    try {
        // Chỉ gửi các trường có trong schema của bảng tenants
        const validFields = {
            name: updates.name,
            phone: updates.phone,
            email: updates.email,
            room_number: updates.room_number,
            room_id: updates.room_id,
            hostel_id: updates.hostel_id,
            move_in_date: updates.move_in_date,
            rent_amount: updates.rent_amount,
            emergency_phone: updates.emergency_phone,
            months_rented: updates.months_rented,
            status: updates.status
        }

        // Loại bỏ các trường undefined/null
        const cleanFields = Object.fromEntries(
            Object.entries(validFields).filter(([_, value]) => value !== undefined && value !== null)
        )

        console.log('Updating tenant with fields:', cleanFields)

        const { data, error } = await supabase
            .from('tenants')
            .update(cleanFields)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating tenant:', error)
        throw error
    }
}

export const deleteTenant = async (id) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete')
        return { id: id }
    }

    try {
        // Lấy thông tin tenant trước khi xóa để cập nhật trạng thái phòng
        const { data: tenant, error: fetchError } = await supabase
            .from('tenants')
            .select('room_id')
            .eq('id', id)
            .single()

        if (fetchError) throw fetchError

        // Xóa tenant
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id)

        if (error) throw error

        // Cập nhật trạng thái phòng thành 'available' nếu có room_id
        if (tenant.room_id) {
            try {
                await updateRoomStatus(tenant.room_id, 'available')
                console.log('Updated room status to available for room:', tenant.room_id)
            } catch (roomError) {
                console.error('Failed to update room status:', roomError)
                // Không throw error để không ảnh hưởng đến việc xóa tenant
            }
        }

        return { id: id }
    } catch (error) {
        console.error('Error deleting tenant:', error)
        throw error
    }
}
