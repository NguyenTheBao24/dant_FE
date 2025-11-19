import {
  InvoiceData,
  BangGia,
  HopDongInfo,
  InvoiceCalculationResult,
} from "../types/invoice.types";

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
      errorMessage: "Không tìm thấy hợp đồng hiệu lực cho phòng này",
    };
  }

  if (!bangGia) {
    return {
      isValid: false,
      errorMessage: "Không tìm thấy bảng giá cho tòa nhà này",
    };
  }

  if (invoiceData.chi_so_dien_moi <= invoiceData.chi_so_dien_cu) {
    return {
      isValid: false,
      errorMessage: "Chỉ số điện mới phải lớn hơn chỉ số điện cũ",
    };
  }

  if (invoiceData.chi_so_nuoc_moi <= invoiceData.chi_so_nuoc_cu) {
    return {
      isValid: false,
      errorMessage: "Chỉ số nước mới phải lớn hơn chỉ số nước cũ",
    };
  }

  return { isValid: true };
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
  const soKwh = invoiceData.chi_so_dien_moi - invoiceData.chi_so_dien_cu;
  const tienDien = soKwh > 0 ? soKwh * (bangGia.gia_dien || 0) : 0;

  // Calculate water cost
  const soKhoi = invoiceData.chi_so_nuoc_moi - invoiceData.chi_so_nuoc_cu;
  const tienNuoc = soKhoi > 0 ? soKhoi * (bangGia.gia_nuoc || 0) : 0;

  // Common services cost (fixed from price list)
  // Tính tổng từ các dịch vụ: internet + vệ sinh + gửi xe
  // Nếu có gia_dich_vu thì dùng, nếu không thì tính từ tổng các dịch vụ
  const tienDichVu =
    bangGia.gia_dich_vu ||
    (bangGia.gia_internet || 0) +
      (bangGia.gia_ve_sinh || 0) +
      (bangGia.gia_gui_xe || 0);

  // Total calculation
  const tongTien = roomRent + tienDien + tienNuoc + tienDichVu;

  return {
    tien_dien: tienDien,
    tien_nuoc: tienNuoc,
    tien_dich_vu: tienDichVu,
    tien_phong: roomRent,
    tong_tien: tongTien,
  };
}

/**
 * Format currency for Vietnamese locale
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("vi-VN") + "₫";
}

/**
 * Create initial invoice data with current month/year
 */
export function createInitialInvoiceData(): InvoiceData {
  const now = new Date();
  return {
    hop_dong_id: 0,
    loai_hoa_don: "thang",
    thang: now.getMonth() + 1,
    nam: now.getFullYear(),
    chi_so_dien_cu: 0,
    chi_so_dien_moi: 0,
    chi_so_nuoc_cu: 0,
    chi_so_nuoc_moi: 0,
    tien_dien: 0,
    tien_nuoc: 0,
    tien_dich_vu: 0,
    tong_tien: 0,
  };
}

/**
 * Generate invoice ID theo format: HDYYYYMMDDXXXXXX
 * Ví dụ: HD20241201000001
 * - HD: prefix
 * - YYYYMMDD: năm + tháng + ngày (8 chữ số)
 * - XXXXXX: số thứ tự trong ngày (6 chữ số)
 *
 * Lưu ý: Function này tạo ID tạm thời. Để có số thứ tự chính xác,
 * nên sử dụng generateInvoiceIdAsync để query database và lấy số thứ tự cao nhất.
 */
export function generateInvoiceId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`; // YYYYMMDD

  // Sử dụng timestamp để tạo số unique tạm thời
  // Format sẽ được query và sửa lại trong generateInvoiceIdAsync
  const timestamp = Date.now();
  const randomPart = timestamp % 1000000; // Lấy 6 chữ số cuối của timestamp
  const sequence = String(randomPart).padStart(6, "0");

  return `HD${dateStr}${sequence}`;
}
