import { supabase } from './supabase-client'

// Interface cho chi tiêu (moved to .d.ts file)

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
        const { data, error } = await supabase
            .from('chi_tieu')
            .insert([chiTieuData])
            .select()
            .single()

        if (error) {
            console.error('Error creating chi tieu:', error)
            throw error
        }

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
