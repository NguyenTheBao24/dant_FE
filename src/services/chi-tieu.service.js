import { supabase } from './supabase-client'

// Interface cho chi tiêu (moved to .d.ts file)

/**
 * Generate ID cho chi tiêu theo format: CTYYYYMMDDXXXXXX
 * Ví dụ: CT20250101000001
 * - CT: prefix
 * - YYYYMMDD: năm + tháng + ngày (8 chữ số)
 * - XXXXXX: số thứ tự trong ngày (6 chữ số)
 */
async function getNextChiTieuId(date = new Date()) {
    try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}${month}${day}` // YYYYMMDD
        const prefix = `CT${dateStr}`

        // Lấy tất cả chi tiêu có cùng ngày
        const startDate = `${year}-${month}-${day}`
        const { data, error } = await supabase
            .from('chi_tieu')
            .select('id')
            .gte('ngay', startDate)
            .lt('ngay', `${year}-${month}-${String(parseInt(day) + 1).padStart(2, '0')}`)
            .order('id', { ascending: false })

        if (error) {
            console.warn('Error getting existing chi tieu IDs, using default:', error)
            return `${prefix}000001`
        }

        // Tìm số thứ tự cao nhất
        let maxSequence = 0
        if (data && data.length > 0) {
            for (const item of data) {
                if (item.id && typeof item.id === 'string' && item.id.startsWith(prefix)) {
                    const sequenceStr = item.id.slice(prefix.length)
                    const sequence = parseInt(sequenceStr, 10)
                    if (!isNaN(sequence) && sequence > maxSequence) {
                        maxSequence = sequence
                    }
                }
            }
        }

        const nextSequence = maxSequence + 1
        const sequenceStr = String(nextSequence).padStart(6, '0')
        return `${prefix}${sequenceStr}`
    } catch (error) {
        console.error('Error in getNextChiTieuId:', error)
        // Fallback: sử dụng timestamp
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const timestamp = Date.now() % 1000000
        return `CT${year}${month}${day}${String(timestamp).padStart(6, '0')}`
    }
}

// Lấy tất cả chi tiêu của một tòa nhà
export async function listChiTieuByToaNha(toaNhaId) {
    try {
        const { data, error } = await supabase
            .from('chi_tieu')
            .select('*')
            .eq('toa_nha_id', toaNhaId)
            .order('ngay', { ascending: false })

        if (error) {
            console.error('Error fetching chi tieu:', error)
            throw error
        }

        return data || []
    } catch (error) {
        console.error('Error in listChiTieuByToaNha:', error)
        throw error
    }
}

// Lấy chi tiêu theo ID
export async function getChiTieuById(id) {
    try {
        const { data, error } = await supabase
            .from('chi_tieu')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching chi tieu by id:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in getChiTieuById:', error)
        throw error
    }
}

// Tạo chi tiêu mới
export async function createChiTieu(chiTieuData) {
    try {
        console.log('createChiTieu - Received data:', JSON.stringify(chiTieuData, null, 2))
        console.log('createChiTieu - toa_nha_id:', chiTieuData.toa_nha_id, 'type:', typeof chiTieuData.toa_nha_id)

        // Đảm bảo toa_nha_id không null/undefined
        if (!chiTieuData.toa_nha_id) {
            const error = new Error('toa_nha_id is required but was null or undefined')
            console.error('createChiTieu - Validation error:', error)
            throw error
        }

        // Convert toa_nha_id sang string và trim
        const toaNhaIdString = String(chiTieuData.toa_nha_id).trim()

        if (!toaNhaIdString || toaNhaIdString === 'null' || toaNhaIdString === 'undefined' || toaNhaIdString === '') {
            const error = new Error(`toa_nha_id is invalid: "${toaNhaIdString}"`)
            console.error('createChiTieu - Validation error:', error)
            throw error
        }

        // Đảm bảo toa_nha_id là string
        // Không thêm ID vào đây vì database có thể tự động generate
        const dataToInsert = {
            ...chiTieuData,
            toa_nha_id: toaNhaIdString
        }

        // Chỉ thêm ID nếu chưa có trong chiTieuData
        // (Database có thể tự động generate ID theo format CTYYYYMMDDXXXXXX)
        if (!dataToInsert.id) {
            try {
                const expenseDate = chiTieuData.ngay ? new Date(chiTieuData.ngay) : new Date()
                const expenseId = await getNextChiTieuId(expenseDate)
                dataToInsert.id = expenseId
                console.log('createChiTieu - Generated ID:', expenseId)
            } catch (idError) {
                console.warn('createChiTieu - Could not generate ID, database will auto-generate:', idError)
                // Bỏ qua lỗi generate ID, để database tự generate
            }
        }

        console.log('createChiTieu - Data to insert:', JSON.stringify(dataToInsert, null, 2))
        console.log('createChiTieu - Final toa_nha_id:', dataToInsert.toa_nha_id, 'type:', typeof dataToInsert.toa_nha_id)

        const { data, error } = await supabase
            .from('chi_tieu')
            .insert([dataToInsert])
            .select()
            .single()

        if (error) {
            console.error('Error creating chi tieu:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)
            console.error('Error hint:', error.hint)
            throw error
        }

        console.log('createChiTieu - Success, created data:', data)
        return data
    } catch (error) {
        console.error('Error in createChiTieu:', error)
        throw error
    }
}

// Cập nhật chi tiêu
export async function updateChiTieu(id, chiTieuData) {
    try {
        const { data, error } = await supabase
            .from('chi_tieu')
            .update(chiTieuData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating chi tieu:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in updateChiTieu:', error)
        throw error
    }
}

// Xóa chi tiêu
export async function deleteChiTieu(id) {
    try {
        const { error } = await supabase
            .from('chi_tieu')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting chi tieu:', error)
            throw error
        }

        return true
    } catch (error) {
        console.error('Error in deleteChiTieu:', error)
        throw error
    }
}

// Lấy thống kê chi tiêu theo tháng
export async function getChiTieuStatsByMonth(toaNhaId, year, month) {
    try {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`

        const { data, error } = await supabase
            .from('chi_tieu')
            .select('*')
            .eq('toa_nha_id', toaNhaId)
            .gte('ngay', startDate)
            .lte('ngay', endDate)

        if (error) {
            console.error('Error fetching chi tieu stats:', error)
            throw error
        }

        const totalAmount = data?.reduce((sum, item) => sum + (item.so_tien || 0), 0) || 0
        const count = data?.length || 0

        return {
            totalAmount,
            count,
            data: data || []
        }
    } catch (error) {
        console.error('Error in getChiTieuStatsByMonth:', error)
        throw error
    }
}

// Lấy thống kê chi tiêu theo loại
export async function getChiTieuStatsByType(toaNhaId, startDate, endDate) {
    try {
        const { data, error } = await supabase
            .from('chi_tieu')
            .select('*')
            .eq('toa_nha_id', toaNhaId)
            .gte('ngay', startDate)
            .lte('ngay', endDate)

        if (error) {
            console.error('Error fetching chi tieu stats by type:', error)
            throw error
        }

        // Nhóm theo loại chi
        const statsByType = {}
        data?.forEach(item => {
            const type = item.loai_chi
            if (!statsByType[type]) {
                statsByType[type] = {
                    loai_chi: type,
                    totalAmount: 0,
                    count: 0
                }
            }
            statsByType[type].totalAmount += item.so_tien || 0
            statsByType[type].count += 1
        })

        return Object.values(statsByType)
    } catch (error) {
        console.error('Error in getChiTieuStatsByType:', error)
        throw error
    }
}

// Lấy tổng chi tiêu trong khoảng thời gian
export async function getTotalChiTieuInRange(toaNhaId, startDate, endDate) {
    try {
        const { data, error } = await supabase
            .from('chi_tieu')
            .select('so_tien')
            .eq('toa_nha_id', toaNhaId)
            .gte('ngay', startDate)
            .lte('ngay', endDate)

        if (error) {
            console.error('Error fetching total chi tieu:', error)
            throw error
        }

        const total = data?.reduce((sum, item) => sum + (item.so_tien || 0), 0) || 0
        return total
    } catch (error) {
        console.error('Error in getTotalChiTieuInRange:', error)
        throw error
    }
}
