import { supabase } from './supabase-client'
import { generateFormattedId } from '../utils/id-generator'

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

/**
 * Lấy ID tiếp theo cho can_ho theo format: CH0000000001
 */
async function getNextCanHoId() {
    try {
        console.log('Getting next can_ho id...')

        const { data, error } = await supabase
            .from('can_ho')
            .select('id')
            .order('id', { ascending: false })
            .limit(100) // Lấy nhiều hơn để đảm bảo tìm được max

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: CH0000000001')
            return 'CH0000000001'
        }

        if (data && data.length > 0) {
            const existingIds = data.map(ch => ch.id).filter(Boolean)
            const nextId = generateFormattedId('CH', existingIds)
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: CH0000000001')
        return 'CH0000000001'
    } catch (error) {
        console.error('Error in getNextCanHoId:', error)
        console.warn('Using fallback id: CH0000000001')
        return 'CH0000000001'
    }
}

export async function createCanHo(payload) {
    if (!isReady()) return null

    try {
        // Generate id nếu chưa có
        if (!payload.id) {
            const nextId = await getNextCanHoId()
            payload.id = nextId
        }

        const { data, error } = await supabase.from('can_ho').insert([payload]).select().single()
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error creating can_ho:', error)
        throw error
    }
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

    // Generate IDs cho tất cả items
    try {
        const { data: existingData } = await supabase
            .from('can_ho')
            .select('id')
            .order('id', { ascending: false })
            .limit(100)

        const existingIds = existingData ? existingData.map(ch => ch.id).filter(Boolean) : []
        let currentSequence = 0

        // Tìm sequence cao nhất
        if (existingIds.length > 0) {
            for (const id of existingIds) {
                if (typeof id === 'string' && id.startsWith('CH')) {
                    const seq = parseInt(id.slice(2), 10)
                    if (!isNaN(seq) && seq > currentSequence) {
                        currentSequence = seq
                    }
                }
            }
        }

        // Generate IDs cho từng item
        for (let i = 0; i < items.length; i++) {
            currentSequence++
            items[i].id = `CH${String(currentSequence).padStart(10, '0')}`
        }

        console.log('Generated IDs for rooms:', items.map(item => item.id))
    } catch (idError) {
        console.warn('Error generating IDs, using fallback:', idError)
        // Fallback: generate IDs đơn giản
        for (let i = 0; i < items.length; i++) {
            if (!items[i].id) {
                items[i].id = `CH${String(i + 1).padStart(10, '0')}`
            }
        }
    }

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


