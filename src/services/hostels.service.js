import { supabase } from './supabase-client'

// Tables: hostels, managers (1:1 via manager_id)

export async function listHostels () {
  const { data, error } = await supabase
    .from('hostels_view')
    .select('*')
    .order('id')
  if (error) throw error
  return data
}

export async function getHostelById (id) {
  const { data, error } = await supabase
    .from('hostels_view')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateManager (managerId, payload) {
  const { data, error } = await supabase
    .from('managers')
    .update(payload)
    .eq('id', managerId)
    .select()
    .single()
  if (error) throw error
  return data
}


