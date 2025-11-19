import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listKhachThue() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('khach_thue').select('*').order('ho_ten')
    if (error) throw error
    return data || []
}

export async function getKhachThueById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('khach_thue').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createKhachThue(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('khach_thue').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateKhachThue(id, updates) {
    if (!isReady()) return null

    console.log('Updating khach thue with ID:', id)
    console.log('Updates:', updates)

    try {
        const { data, error } = await supabase
            .from('khach_thue')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            throw error
        }

        console.log('Successfully updated khach thue:', data)
        return data
    } catch (error) {
        console.error('Error in updateKhachThue:', error)
        throw error
    }
}

export async function deleteKhachThue(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('khach_thue').delete().eq('id', id)
    if (error) throw error
    return { id }
}

export async function getKhachThueByTaiKhoanId(taiKhoanId) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('khach_thue')
        .select('*')
        .eq('tai_khoan_id', taiKhoanId)
        .single()
    if (error) throw error
    return data
}

// Kiểm tra email có bị trùng không (ngoại trừ user hiện tại)
export async function checkEmailExists(email, excludeId = null) {
    if (!isReady()) return false
    let query = supabase
        .from('khach_thue')
        .select('id')
        .eq('email', email)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return data && data.length > 0
}

// Kiểm tra số điện thoại có bị trùng không (ngoại trừ user hiện tại)
export async function checkPhoneExists(phone, excludeId = null) {
    if (!isReady()) return false
    let query = supabase
        .from('khach_thue')
        .select('id')
        .eq('sdt', phone)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return data && data.length > 0
}


