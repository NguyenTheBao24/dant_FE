import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

/**
 * Kiểm tra hóa đơn hiện tại của hợp đồng trong tháng
 */
export async function getCurrentMonthInvoice(hopDongId, year, month) {
    if (!isReady()) return null

    try {
        // Tạo ngày đầu và cuối tháng
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`

        const { data, error } = await supabase
            .from('hoa_don')
            .select('*')
            .eq('hop_dong_id', hopDongId)
            .gte('ngay_tao', startDate)
            .lte('ngay_tao', endDate)
            .order('ngay_tao', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Error fetching current month invoice:', error)
            throw error
        }

        return data || null
    } catch (error) {
        console.error('Error in getCurrentMonthInvoice:', error)
        throw error
    }
}

/**
 * Xóa hóa đơn
 */
export async function deleteInvoice(invoiceId) {
    if (!isReady()) return null

    try {
        const { error } = await supabase
            .from('hoa_don')
            .delete()
            .eq('id', invoiceId)

        if (error) {
            console.error('Error deleting invoice:', error)
            throw error
        }

        return { success: true }
    } catch (error) {
        console.error('Error in deleteInvoice:', error)
        throw error
    }
}

/**
 * Cập nhật hóa đơn
 */
export async function updateInvoice(invoiceId, updateData) {
    if (!isReady()) return null

    try {
        const { data, error } = await supabase
            .from('hoa_don')
            .update(updateData)
            .eq('id', invoiceId)
            .select()
            .single()

        if (error) {
            console.error('Error updating invoice:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in updateInvoice:', error)
        throw error
    }
}

/**
 * Kiểm tra có thể tạo hóa đơn mới không
 */
export async function canCreateInvoice(hopDongId, year, month) {
    if (!isReady()) return { canCreate: false, reason: 'Service not ready' }

    try {
        const currentInvoice = await getCurrentMonthInvoice(hopDongId, year, month)

        if (!currentInvoice) {
            return { canCreate: true, reason: 'No invoice exists for this month' }
        }

        // Nếu hóa đơn đã thanh toán, không thể tạo mới
        if (currentInvoice.trang_thai === 'da_thanh_toan') {
            return {
                canCreate: false,
                reason: 'Invoice already paid',
                existingInvoice: currentInvoice
            }
        }

        // Nếu hóa đơn chưa thanh toán, có thể cập nhật
        return {
            canCreate: true,
            reason: 'Can update existing unpaid invoice',
            existingInvoice: currentInvoice
        }

    } catch (error) {
        console.error('Error in canCreateInvoice:', error)
        return { canCreate: false, reason: 'Error checking invoice status' }
    }
}

/**
 * Tạo hoặc cập nhật hóa đơn cho tháng
 */
export async function createOrUpdateInvoice(hopDongId, invoiceData, year, month) {
    if (!isReady()) return null

    try {
        const { canCreate, reason, existingInvoice } = await canCreateInvoice(hopDongId, year, month)

        if (!canCreate && reason === 'Invoice already paid') {
            throw new Error('Không thể tạo hóa đơn mới vì hóa đơn tháng này đã được thanh toán')
        }

        // Nếu có hóa đơn chưa thanh toán, cập nhật
        if (existingInvoice && reason === 'Can update existing unpaid invoice') {
            console.log('Updating existing unpaid invoice:', existingInvoice.id)

            const updateData = {
                so_tien: invoiceData.so_tien,
                so_dien_cu: invoiceData.so_dien_cu || 0,
                so_dien_moi: invoiceData.so_dien_moi || 0,
                so_nuoc_cu: invoiceData.so_nuoc_cu || 0,
                so_nuoc_moi: invoiceData.so_nuoc_moi || 0,
                gia_dien: invoiceData.gia_dien || 0,
                gia_nuoc: invoiceData.gia_nuoc || 0,
                gia_dich_vu: invoiceData.gia_dich_vu || 0,
                tong_tien: invoiceData.tong_tien
            }

            const updatedInvoice = await updateInvoice(existingInvoice.id, updateData)
            return { ...updatedInvoice, action: 'updated' }
        }

        // Nếu chưa có hóa đơn, tạo mới
        console.log('Creating new invoice for month:', month, year)

        const { data, error } = await supabase
            .from('hoa_don')
            .insert([{
                hop_dong_id: hopDongId,
                so_tien: invoiceData.so_tien,
                so_dien_cu: invoiceData.so_dien_cu || 0,
                so_dien_moi: invoiceData.so_dien_moi || 0,
                so_nuoc_cu: invoiceData.so_nuoc_cu || 0,
                so_nuoc_moi: invoiceData.so_nuoc_moi || 0,
                gia_dien: invoiceData.gia_dien || 0,
                gia_nuoc: invoiceData.gia_nuoc || 0,
                gia_dich_vu: invoiceData.gia_dich_vu || 0,
                tong_tien: invoiceData.tong_tien,
                trang_thai: 'chua_tt'
            }])
            .select()
            .single()

        if (error) {
            console.error('Error creating new invoice:', error)
            throw error
        }

        return { ...data, action: 'created' }

    } catch (error) {
        console.error('Error in createOrUpdateInvoice:', error)
        throw error
    }
}
