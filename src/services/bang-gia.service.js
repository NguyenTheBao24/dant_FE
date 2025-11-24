import { supabase } from './supabase-client'

// Lấy cấu hình bảng giá dùng chung (không phụ thuộc tòa nhà)
// Bảng giá dùng chung chỉ có 1 bản ghi với ID = 1
export async function getBangGia() {
    try {
        // Thử query với ID = 1 trước
        const { data: dataById, error: errorById } = await supabase
            .from('bang_gia')
            .select('*')
            .eq('id', 1)
            .single()

        if (!errorById && dataById) {
            return dataById
        }

        // Nếu không tìm thấy với ID = 1, thử lấy bản ghi đầu tiên (fallback)
        const { data, error } = await supabase
            .from('bang_gia')
            .select('*')
            .order('id', { ascending: true })
            .limit(1)
            .single()

        if (error) {
            console.error('Error fetching bang gia:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in getBangGia:', error)
        // Nếu không tìm thấy bản ghi nào, trả về null thay vì throw error
        if (error.code === 'PGRST116') {
            return null
        }
        throw error
    }
}

// Tạo bảng giá mới
export async function createBangGia(bangGiaData) {
    try {
        // Chỉ lấy các cột có trong database (gia_dien, gia_nuoc)
        // Loại bỏ gia_dich_vu nếu không tồn tại trong database
        const allowedColumns = ['id', 'gia_dien', 'gia_nuoc']
        const filteredData = {}
        for (const key of allowedColumns) {
            if (bangGiaData.hasOwnProperty(key)) {
                filteredData[key] = bangGiaData[key]
            }
        }

        console.log('Creating bang_gia with filtered data:', filteredData)
        const { data, error } = await supabase
            .from('bang_gia')
            .insert([filteredData])
            .select()
            .single()

        if (error) {
            console.error('Error creating bang gia:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in createBangGia:', error)
        throw error
    }
}

// Cập nhật bảng giá
export async function updateBangGia(id, bangGiaData) {
    try {
        // Đảm bảo ID là integer
        const bangGiaId = typeof id === 'string' ? parseInt(id, 10) : id
        if (isNaN(bangGiaId)) {
            throw new Error(`Invalid bang_gia ID: ${id}`)
        }

        // Chỉ lấy các cột có trong database (gia_dien, gia_nuoc)
        // Loại bỏ gia_dich_vu nếu không tồn tại trong database
        const allowedColumns = ['gia_dien', 'gia_nuoc']
        const filteredData = {}
        for (const key of allowedColumns) {
            if (bangGiaData.hasOwnProperty(key)) {
                filteredData[key] = bangGiaData[key]
            }
        }

        console.log('Updating bang_gia with ID:', bangGiaId)
        console.log('Filtered data (only allowed columns):', filteredData)
        const { data, error } = await supabase
            .from('bang_gia')
            .update(filteredData)
            .eq('id', bangGiaId)
            .select()
            .single()

        if (error) {
            console.error('Error updating bang gia:', error)
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in updateBangGia:', error)
        throw error
    }
}

// Cập nhật hoặc tạo bảng giá cho tòa nhà
// Lưu ý: Bảng giá dùng chung cho tất cả tòa nhà, chỉ có 1 bản ghi với ID = 1
export async function upsertBangGia(toaNhaId, bangGiaData) {
    try {
        // Kiểm tra xem đã có bảng giá chưa
        let existing = null
        try {
            existing = await getBangGia()
        } catch (error) {
            // Nếu không tìm thấy, existing sẽ là null
            console.log('No existing price found, will create new')
        }

        if (existing && existing.id) {
            // Cập nhật bảng giá hiện có
            console.log('Updating existing price with ID:', existing.id)
            return await updateBangGia(existing.id, bangGiaData)
        } else {
            // Tạo bảng giá mới với ID = 1 (bảng giá dùng chung)
            console.log('Creating new price with ID = 1')
            return await createBangGia({
                id: 1, // Bảng giá dùng chung, luôn dùng ID = 1
                ...bangGiaData
            })
        }
    } catch (error) {
        console.error('Error in upsertBangGia:', error)
        // Nếu lỗi do duplicate ID, thử update lại
        if (error.code === '23505' || error.message?.includes('duplicate')) {
            console.log('Duplicate ID detected, trying to update existing record with ID = 1')
            try {
                return await updateBangGia(1, bangGiaData)
            } catch (updateError) {
                console.error('Error updating with ID = 1:', updateError)
                throw updateError
            }
        }
        throw error
    }
}

// Backward compatibility: API trước đây theo tòa nhà; nay trả về cấu hình chung
export async function getBangGiaByToaNha(_toaNhaId) {
    return await getBangGia()
}