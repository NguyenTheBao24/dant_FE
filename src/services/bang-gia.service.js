import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listBangGia() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('bang_gia').select('*').order('id')
    if (error) throw error
    return data || []
}

export async function getBangGiaById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('bang_gia').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createBangGia(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('bang_gia').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateBangGia(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('bang_gia').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteBangGia(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('bang_gia').delete().eq('id', id)
    if (error) throw error
    return { id }
}


