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
