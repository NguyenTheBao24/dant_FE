import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

/**
 * Generate ID cho phản hồi thông báo theo format: PHYYYYMMDDXXXXXX
 * Ví dụ: PH20250101000001
 * - PH: prefix (Phản Hồi)
 * - YYYYMMDD: năm + tháng + ngày (8 chữ số)
 * - XXXXXX: số thứ tự trong ngày (6 chữ số)
 */
async function getNextPhanHoiThongBaoId(date = new Date()) {
    try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}${month}${day}` // YYYYMMDD
        const prefix = `PH${dateStr}`

        // Lấy ID cao nhất có cùng prefix (chỉ lấy 1 record để tối ưu)
        const { data, error } = await supabase
            .from('phan_hoi_thong_bao')
            .select('id')
            .like('id', `${prefix}%`)
            .order('id', { ascending: false })
            .limit(1)

        if (error) {
            console.warn('Error getting existing phan hoi IDs, using default:', error)
            // Thêm milliseconds để đảm bảo unique
            const timestamp = Date.now() % 1000000
            return `${prefix}${String(timestamp).padStart(6, '0')}`
        }

        // Tìm số thứ tự cao nhất
        let maxSequence = 0
        if (data && data.length > 0) {
            const item = data[0]
            if (item.id && typeof item.id === 'string' && item.id.startsWith(prefix)) {
                // Extract 6 chữ số cuối cùng (số thứ tự)
                const sequenceStr = item.id.slice(prefix.length)
                const sequence = parseInt(sequenceStr, 10)
                if (!isNaN(sequence)) {
                    maxSequence = sequence
                }
            }
        }

        // Thêm milliseconds vào sequence để tránh duplicate khi nhiều request cùng lúc
        const milliseconds = Date.now() % 1000 // 3 chữ số cuối của timestamp
        const nextSequence = maxSequence + 1
        // Lấy 3 chữ số cuối của sequence và thêm milliseconds
        const baseSequence = nextSequence % 1000 // 3 chữ số cuối
        const sequenceStr = String(baseSequence).padStart(3, '0') + String(milliseconds).padStart(3, '0')
        return `${prefix}${sequenceStr}`
    } catch (error) {
        console.error('Error in getNextPhanHoiThongBaoId:', error)
        // Fallback: sử dụng timestamp đầy đủ để đảm bảo unique
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const timestamp = Date.now() % 1000000
        return `PH${year}${month}${day}${String(timestamp).padStart(6, '0')}`
    }
}

export async function createPhanHoiThongBao(phanHoiData) {
    if (!isReady()) {
        console.error('createPhanHoiThongBao - Supabase not ready')
        throw new Error('Hệ thống chưa sẵn sàng. Vui lòng thử lại sau.')
    }

    console.log('createPhanHoiThongBao - Received data:', JSON.stringify(phanHoiData, null, 2))

    // Validate các trường bắt buộc
    if (!phanHoiData.thong_bao_id) {
        const error = new Error('thong_bao_id is required')
        console.error('createPhanHoiThongBao - Validation error:', error)
        throw error
    }

    if (!phanHoiData.nguoi_gui_loai) {
        const error = new Error('nguoi_gui_loai is required')
        console.error('createPhanHoiThongBao - Validation error:', error)
        throw error
    }

    if (!phanHoiData.nguoi_gui_id) {
        const error = new Error('nguoi_gui_id is required')
        console.error('createPhanHoiThongBao - Validation error:', error)
        throw error
    }

    if (!phanHoiData.noi_dung || !phanHoiData.noi_dung.trim()) {
        const error = new Error('noi_dung is required')
        console.error('createPhanHoiThongBao - Validation error:', error)
        throw error
    }

    // Generate ID cho phản hồi nếu chưa có
    let phanHoiId = phanHoiData.id
    if (!phanHoiId) {
        try {
            phanHoiId = await getNextPhanHoiThongBaoId(new Date())
            console.log('createPhanHoiThongBao - Generated ID:', phanHoiId)
        } catch (idError) {
            console.warn('createPhanHoiThongBao - Could not generate ID, database will auto-generate:', idError)
            // Bỏ qua lỗi generate ID, để database tự generate nếu có trigger
        }
    }

    const dataToInsert = {
        ...(phanHoiId && { id: phanHoiId }),
        thong_bao_id: phanHoiData.thong_bao_id,
        nguoi_gui_loai: phanHoiData.nguoi_gui_loai,
        nguoi_gui_id: phanHoiData.nguoi_gui_id,
        noi_dung: phanHoiData.noi_dung.trim()
    }

    console.log('createPhanHoiThongBao - Data to insert:', JSON.stringify(dataToInsert, null, 2))

    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .insert([dataToInsert])
        .select()
        .single()

    if (error) {
        console.error('createPhanHoiThongBao - Supabase error:', error)
        console.error('createPhanHoiThongBao - Error code:', error.code)
        console.error('createPhanHoiThongBao - Error message:', error.message)
        console.error('createPhanHoiThongBao - Error details:', error.details)
        console.error('createPhanHoiThongBao - Error hint:', error.hint)
        throw error
    }

    console.log('createPhanHoiThongBao - Success, created data:', data)
    return data
}

export async function getPhanHoiByThongBao(thongBaoId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .select('*')
        .eq('thong_bao_id', thongBaoId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
}

export async function getPhanHoiWithDetails(thongBaoId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .select(`
            *,
            thong_bao:thong_bao_id(
                id,
                tieu_de,
                khach_thue:khach_thue_id(id, ho_ten),
                toa_nha:toa_nha_id(id, ten_toa)
            )
        `)
        .eq('thong_bao_id', thongBaoId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
}


