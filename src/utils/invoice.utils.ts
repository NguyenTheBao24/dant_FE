import { InvoiceData, BangGia, HopDongInfo, InvoiceCalculationResult } from '../types/invoice.types'

/**
 * Validate form data for invoice creation
 */
export function validateInvoiceForm(
    invoiceData: InvoiceData,
    hopDong: HopDongInfo | null,
    bangGia: BangGia | null
): { isValid: boolean; errorMessage?: string } {
    if (!hopDong) {
        return {
            isValid: false,
            errorMessage: 'Không tìm thấy hợp đồng hiệu lực cho phòng này'
        }
    }

    if (!bangGia) {
        return {
            isValid: false,
            errorMessage: 'Không tìm thấy bảng giá cho tòa nhà này'
        }
    }

    if (invoiceData.chi_so_dien_moi <= invoiceData.chi_so_dien_cu) {
        return {
            isValid: false,
            errorMessage: 'Chỉ số điện mới phải lớn hơn chỉ số điện cũ'
        }
    }

    if (invoiceData.chi_so_nuoc_moi <= invoiceData.chi_so_nuoc_cu) {
        return {
            isValid: false,
            errorMessage: 'Chỉ số nước mới phải lớn hơn chỉ số nước cũ'
        }
    }

    return { isValid: true }
}

/**
 * Calculate invoice amounts based on meter readings and pricing
 */
export function calculateInvoiceAmounts(
    invoiceData: InvoiceData,
    bangGia: BangGia,
    roomRent: number = 0
): InvoiceCalculationResult {
    // Calculate electricity cost
    const soKwh = invoiceData.chi_so_dien_moi - invoiceData.chi_so_dien_cu
    const tienDien = soKwh > 0 ? soKwh * (bangGia.gia_dien || 0) : 0

    // Calculate water cost
    const soKhoi = invoiceData.chi_so_nuoc_moi - invoiceData.chi_so_nuoc_cu
    const tienNuoc = soKhoi > 0 ? soKhoi * (bangGia.gia_nuoc || 0) : 0

    // Common services cost (fixed from price list)
    const tienDichVu = bangGia.gia_dich_vu || 0

    // Total calculation
    const tongTien = roomRent + tienDien + tienNuoc + tienDichVu

    return {
        tien_dien: tienDien,
        tien_nuoc: tienNuoc,
        tien_dich_vu: tienDichVu,
        tien_phong: roomRent,
        tong_tien: tongTien
    }
}

/**
 * Format currency for Vietnamese locale
 */
export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + '₫'
}

/**
 * Create initial invoice data with current month/year
 */
export function createInitialInvoiceData(): InvoiceData {
    const now = new Date()
    return {
        hop_dong_id: 0,
        loai_hoa_don: 'thang',
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        chi_so_dien_cu: 0,
        chi_so_dien_moi: 0,
        chi_so_nuoc_cu: 0,
        chi_so_nuoc_moi: 0,
        tien_dien: 0,
        tien_nuoc: 0,
        tien_dich_vu: 0,
        tong_tien: 0
    }
}
