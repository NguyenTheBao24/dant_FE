import { supabase } from './supabase-client'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

// Get all hostels with manager information
export const getHostels = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
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

        // Transform data to match expected format
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

// Get single hostel by ID
export const getHostelById = async (id) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
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
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            ...data,
            manager: data.managers || {
                id: null,
                name: 'Chưa có quản lý',
                phone: '',
                email: '',
                avatar: '',
                experience: ''
            }
        }
    } catch (error) {
        console.error('Error fetching hostel:', error)
        throw error
    }
}

// Update manager information
export const updateManager = async (managerId, updates) => {
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

// Create new hostel
export const createHostel = async (hostelData) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
        return { ...hostelData, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('hostels')
            .insert([hostelData])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating hostel:', error)
        throw error
    }
}

// Delete hostel
export const deleteHostel = async (hostelId) => {
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
