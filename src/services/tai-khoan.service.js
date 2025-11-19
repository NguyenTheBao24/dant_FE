import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listTaiKhoan() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('tai_khoan').select('*').order('id')
    if (error) throw error
    return data || []
}

export async function getTaiKhoanById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('tai_khoan').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createTaiKhoan(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('tai_khoan').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateTaiKhoan(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('tai_khoan').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteTaiKhoan(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('tai_khoan').delete().eq('id', id)
    if (error) throw error
    return { id }
}


export async function loginTaiKhoan(username, password) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('tai_khoan')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()
    if (error) return null
    return data
}


