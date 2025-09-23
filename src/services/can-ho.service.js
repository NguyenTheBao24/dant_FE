import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listCanHoByToaNha(toaNhaId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('can_ho')
        .select('*')
        .eq('toa_nha_id', toaNhaId)
        .order('so_can')
    if (error) throw error
    return data || []
}

export async function listAvailableCanHoByToaNha(toaNhaId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('can_ho')
        .select('id, so_can, dien_tich, trang_thai, toa_nha_id, gia_thue')
        .eq('toa_nha_id', toaNhaId)
        .eq('trang_thai', 'trong')
        .order('so_can')
    if (error) throw error
    return data || []
}

export async function getCanHoById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createCanHo(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateCanHo(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function updateCanHoTrangThai(id, trang_thai) {
    return updateCanHo(id, { trang_thai })
}

export async function deleteCanHo(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('can_ho').delete().eq('id', id)
    if (error) throw error
    return { id }
}


