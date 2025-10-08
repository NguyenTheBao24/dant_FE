import { supabase } from './supabase-client'

// Lấy bảng giá của một tòa nhà
export async function getBangGiaByToaNha(toaNhaId) {
    try {
        const { data, error } = await supabase
            .from('bang_gia')
            .select('*')
            .eq('id', toaNhaId)
            .single()

        if (error) {
            console.error('Error fetching bang gia:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in getBangGiaByToaNha:', error)
        throw error
    }
}

// Tạo bảng giá mới
export async function createBangGia(bangGiaData) {
    try {
        const { data, error } = await supabase
            .from('bang_gia')
            .insert([bangGiaData])
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
        const { data, error } = await supabase
            .from('bang_gia')
            .update(bangGiaData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating bang gia:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in updateBangGia:', error)
        throw error
    }
}

// Cập nhật hoặc tạo bảng giá cho tòa nhà
export async function upsertBangGia(toaNhaId, bangGiaData) {
    try {
        // Kiểm tra xem đã có bảng giá chưa
        let existing = null
        try {
            existing = await getBangGiaByToaNha(toaNhaId)
        } catch (error) {
            // Nếu không tìm thấy, existing sẽ là null
            console.log('No existing price found, will create new')
        }

        if (existing) {
            // Cập nhật bảng giá hiện có
            console.log('Updating existing price:', existing.id)
            return await updateBangGia(existing.id, bangGiaData)
        } else {
            // Tạo bảng giá mới
            console.log('Creating new price for toa nha:', toaNhaId)
            return await createBangGia({
                id: toaNhaId,
                ...bangGiaData
            })
        }
    } catch (error) {
        console.error('Error in upsertBangGia:', error)
        throw error
    }
}