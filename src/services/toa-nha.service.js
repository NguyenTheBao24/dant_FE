import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listToaNha() {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('toa_nha')
        .select('*, quan_ly(id, ho_ten, sdt, email, tai_khoan_id, tai_khoan: tai_khoan_id (id, username, role, password))')
        .order('id')
    if (error) throw error
    return data || []
}

export async function getToaNhaById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('toa_nha')
        .select('*, quan_ly(id, ho_ten, sdt, email, tai_khoan_id, tai_khoan: tai_khoan_id (id, username, role, password))')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}

export async function createToaNha(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('toa_nha').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateToaNha(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('toa_nha').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteToaNha(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('toa_nha').delete().eq('id', id)
    if (error) throw error
    return { id }
}


