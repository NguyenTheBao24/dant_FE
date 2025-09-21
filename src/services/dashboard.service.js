import { supabase } from './supabase-client'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

// Get all employees
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

// Get all notifications
export const getNotifications = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for notifications')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching notifications:', error)
        throw error
    }
}

// Get revenue data
export const getRevenueData = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for revenue data')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('revenue_data')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching revenue data:', error)
        throw error
    }
}

// Get expense categories
export const getExpenseCategories = async () => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning null for expense categories')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('expense_categories')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching expense categories:', error)
        throw error
    }
}

// Create new notification
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
        console.error('Error creating notification:', error)
        throw error
    }
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { id: notificationId, is_read: true }
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error marking notification as read:', error)
        throw error
    }
}

// Create new employee
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

// Update employee
export const updateEmployee = async (employeeId, updates) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock update')
        return { ...updates, id: employeeId }
    }

    try {
        const { data, error } = await supabase
            .from('employees')
            .update(updates)
            .eq('id', employeeId)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating employee:', error)
        throw error
    }
}

// Delete employee
export const deleteEmployee = async (employeeId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock delete')
        return { id: employeeId }
    }

    try {
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', employeeId)

        if (error) throw error
        return { id: employeeId }
    } catch (error) {
        console.error('Error deleting employee:', error)
        throw error
    }
}
