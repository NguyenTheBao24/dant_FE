import { supabase } from './supabase-client'

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
        const { data, error } = await supabase
            .from('tenants')
            .insert(tenant)
            .select()
            .single()

        if (error) throw error
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

export const deleteTenant = async (id) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete')
        return { id: id }
    }

    try {
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id)

        if (error) throw error
        return { id: id }
    } catch (error) {
        console.error('Error deleting tenant:', error)
        throw error
    }
}
