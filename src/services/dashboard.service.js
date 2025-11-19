import { supabase } from './supabase-client'

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

export const getEmployees = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for employees')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching employees:', error)
        throw error
    }
}

export const getNotifications = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for notifications')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        // Nếu bảng notifications không tồn tại, trả về mảng rỗng để tránh lỗi
        if (error?.code === 'PGRST205') return []
        console.error('Error fetching notifications:', error)
        return []
    }
}

export const getRevenueData = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for revenue data')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('revenue_data')
            .select('*')
            .order('month')

        if (error) throw error
        return data
    } catch (error) {
        if (error?.code === 'PGRST205') return []
        console.error('Error fetching revenue data:', error)
        return []
    }
}

export const getExpenseCategories = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for expense categories')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('expense_categories')
            .select('*')
            .order('name')

        if (error) throw error
        return data
    } catch (error) {
        if (error?.code === 'PGRST205') return []
        console.error('Error fetching expense categories:', error)
        return []
    }
}

export const createNotification = async (notificationData) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
        return { ...notificationData, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([notificationData])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        if (error?.code === 'PGRST205') return { ...notificationData, id: Date.now() }
        console.error('Error creating notification:', error)
        return { ...notificationData, id: Date.now() }
    }
}

export const markNotificationAsRead = async (id) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { id: id, is_read: true }
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        if (error?.code === 'PGRST205') return { id, is_read: true }
        console.error('Error marking notification as read:', error)
        return { id, is_read: true }
    }
}

export const createEmployee = async (employeeData) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock data')
        return { ...employeeData, id: Date.now() }
    }

    try {
        const { data, error } = await supabase
            .from('employees')
            .insert([employeeData])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating employee:', error)
        throw error
    }
}
