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
    const { data, error } = await supabase.from('khach_thue').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteKhachThue(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('khach_thue').delete().eq('id', id)
    if (error) throw error
    return { id }
}


