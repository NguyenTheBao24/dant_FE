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

export async function countCanHoByToaNha(toaNhaId) {
    if (!isReady()) return 0
    const { count, error } = await supabase
        .from('can_ho')
        .select('*', { count: 'exact', head: true })
        .eq('toa_nha_id', toaNhaId)
    if (error) throw error
    if (typeof count === 'number') return count
    // Fallback: fetch minimal rows and return length (in case count unsupported)
    const { data, error: err2 } = await supabase
        .from('can_ho')
        .select('id')
        .eq('toa_nha_id', toaNhaId)
    if (err2) throw err2
    return (data || []).length
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

// Tạo danh sách căn hộ cố định cho một tòa nhà với nhiều loại phòng
export async function createFixedCanHoForToaNha(toaNhaId, total = 10, customRoomTypes = null) {
    if (!isReady()) return []
    const items = []

    // Định nghĩa các loại phòng khác nhau (có thể tùy chỉnh)
    const defaultRoomTypes = [
        {
            loai: 'Phòng đơn',
            dien_tich: 20,
            gia_thue: 2500000,
            ty_le: 0.5 // 50% phòng đơn
        },
        {
            loai: 'Phòng đôi',
            dien_tich: 35,
            gia_thue: 4500000,
            ty_le: 0.3 // 30% phòng đôi
        },
        {
            loai: 'Phòng VIP',
            dien_tich: 50,
            gia_thue: 7000000,
            ty_le: 0.2 // 20% phòng VIP
        }
    ]

    const roomTypes = customRoomTypes || defaultRoomTypes

    // Tính số lượng từng loại phòng
    const singleRooms = Math.floor(total * roomTypes[0].ty_le)
    const doubleRooms = Math.floor(total * roomTypes[1].ty_le)
    const vipRooms = total - singleRooms - doubleRooms // Phần còn lại

    console.log(`Creating rooms for building ${toaNhaId}: ${singleRooms} single, ${doubleRooms} double, ${vipRooms} VIP`)

    let roomIndex = 1

    // Tạo phòng đơn
    for (let i = 0; i < singleRooms; i++) {
        const soCan = `A${String(roomIndex).padStart(3, '0')}`
        items.push({
            so_can: soCan,
            dien_tich: roomTypes[0].dien_tich,
            trang_thai: 'trong',
            toa_nha_id: toaNhaId,
            gia_thue: roomTypes[0].gia_thue
            // loai_can_ho: roomTypes[0].loai // Tạm thời comment vì database chưa có cột này
        })
        roomIndex++
    }

    // Tạo phòng đôi
    for (let i = 0; i < doubleRooms; i++) {
        const soCan = `A${String(roomIndex).padStart(3, '0')}`
        items.push({
            so_can: soCan,
            dien_tich: roomTypes[1].dien_tich,
            trang_thai: 'trong',
            toa_nha_id: toaNhaId,
            gia_thue: roomTypes[1].gia_thue
            // loai_can_ho: roomTypes[1].loai // Tạm thời comment vì database chưa có cột này
        })
        roomIndex++
    }

    // Tạo phòng VIP
    for (let i = 0; i < vipRooms; i++) {
        const soCan = `A${String(roomIndex).padStart(3, '0')}`
        items.push({
            so_can: soCan,
            dien_tich: roomTypes[2].dien_tich,
            trang_thai: 'trong',
            toa_nha_id: toaNhaId,
            gia_thue: roomTypes[2].gia_thue
            // loai_can_ho: roomTypes[2].loai // Tạm thời comment vì database chưa có cột này
        })
        roomIndex++
    }

    console.log(`Total rooms to create: ${items.length}`)
    const { data, error } = await supabase.from('can_ho').insert(items).select()
    if (error) throw error
    return data || []
}

// Function helper để tạo phòng với tỷ lệ tùy chỉnh
// Function helper để xác định loại phòng dựa trên diện tích và giá thuê
export function determineRoomType(dien_tich, gia_thue) {
    if ((dien_tich || 0) >= 45 || (gia_thue || 0) >= 6000000) {
        return 'Phòng VIP'
    } else if ((dien_tich || 0) >= 30 || (gia_thue || 0) >= 4000000) {
        return 'Phòng đôi'
    }
    return 'Phòng đơn'
}

export async function createRoomsWithCustomRatio(toaNhaId, total, roomConfig) {
    const roomTypes = roomConfig || [
        { loai: 'Phòng đơn', dien_tich: 20, gia_thue: 2500000, ty_le: 0.5 },
        { loai: 'Phòng đôi', dien_tich: 35, gia_thue: 4500000, ty_le: 0.3 },
        { loai: 'Phòng VIP', dien_tich: 50, gia_thue: 7000000, ty_le: 0.2 }
    ]

    return await createFixedCanHoForToaNha(toaNhaId, total, roomTypes)
}


