import { supabase } from './supabase-client'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

// Get all tenants
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

// Get tenants by hostel ID
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

// Create new tenant
export const createTenant = async (tenant) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data for create tenant')
        return { ...tenant, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('tenants')
            .insert([tenant])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating tenant:', error)
        throw error
    }
}

// Update tenant
export const updateTenant = async (id, updates) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update for tenant')
        return { ...updates, id }
    }

    try {
        const { data, error } = await supabase
            .from('tenants')
            .update(updates)
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

// Delete tenant
export const deleteTenant = async (id) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete for tenant')
        return { id }
    }

    try {
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id)

        if (error) throw error
        return { id }
    } catch (error) {
        console.error('Error deleting tenant:', error)
        throw error
    }
}
