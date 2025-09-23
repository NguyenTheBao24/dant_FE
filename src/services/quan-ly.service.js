import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listQuanLy() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('quan_ly').select('*').order('id')
    if (error) throw error
    return data || []
}

export async function getQuanLyById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('quan_ly').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createQuanLy(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('quan_ly').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateQuanLy(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('quan_ly').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteQuanLy(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('quan_ly').delete().eq('id', id)
    if (error) throw error
    return { id }
}


