import { supabase } from "./supabase-client";

function isReady() {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Lấy tất cả hóa đơn của khách thuê theo hop_dong_id
 */
export async function getInvoicesByHopDong(hopDongId) {
  if (!isReady()) return [];

  const { data, error } = await supabase
    .from("hoa_don")
    .select("*")
    .eq("hop_dong_id", hopDongId)
    .order("ngay_tao", { ascending: false });

  if (error) {
    console.error("Error fetching invoices by hop_dong:", error);
    throw error;
  }

  return data || [];
}

/**
 * Lấy hóa đơn chưa thanh toán mới nhất của khách thuê
 */
export async function getLatestUnpaidInvoice(hopDongId) {
  if (!isReady()) return null;

  const { data, error } = await supabase
    .from("hoa_don")
    .select("*")
    .eq("hop_dong_id", hopDongId)
    .eq("trang_thai", "chua_tt")
    .order("ngay_tao", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching latest unpaid invoice:", error);
    throw error;
  }

  return data || null;
}

/**
 * Lấy chi tiết hóa đơn bao gồm breakdown các khoản phí điện, nước, dịch vụ
 */
export async function getInvoiceDetails(invoiceId) {
  if (!isReady()) return null;

  console.log("Loading invoice details for invoiceId:", invoiceId);

  try {
    // Lấy thông tin hóa đơn
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("hoa_don")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError) {
      console.error(
        "Error fetching invoice details for ID:",
        invoiceId,
        invoiceError
      );
      if (invoiceError.code === "PGRST116") {
        console.log("Invoice not found with ID:", invoiceId);
        return null;
      }
      throw invoiceError;
    }

    console.log("Found invoice data:", invoiceData);

    // Tạo breakdown từ các cột có sẵn trong database
    const soKwh =
      (invoiceData.so_dien_moi || 0) - (invoiceData.so_dien_cu || 0);
    const soM3 = (invoiceData.so_nuoc_moi || 0) - (invoiceData.so_nuoc_cu || 0);
    const tienDien = soKwh * (invoiceData.gia_dien || 0);
    const tienNuoc = soM3 * (invoiceData.gia_nuoc || 0);
    const tienDichVu = invoiceData.gia_dich_vu || 0;
    const tienPhong =
      (invoiceData.so_tien || invoiceData.tong_tien || 0) -
      tienDien -
      tienNuoc -
      tienDichVu;

    const breakdown = {
      tienPhong: Math.max(0, tienPhong),
      tienDien: tienDien,
      tienNuoc: tienNuoc,
      tienDichVu: tienDichVu,
      chiSoDienCu: invoiceData.so_dien_cu || 0,
      chiSoDienMoi: invoiceData.so_dien_moi || 0,
      chiSoNuocCu: invoiceData.so_nuoc_cu || 0,
      chiSoNuocMoi: invoiceData.so_nuoc_moi || 0,
      soKwh: soKwh,
      soM3: soM3,
      giaDien: invoiceData.gia_dien || 0,
      giaNuoc: invoiceData.gia_nuoc || 0,
      giaDichVu: invoiceData.gia_dich_vu || 0,
    };

    return {
      invoice: invoiceData,
      breakdown,
      // Tính tổng để verify
      calculatedTotal:
        breakdown.tienPhong +
        breakdown.tienDien +
        breakdown.tienNuoc +
        breakdown.tienDichVu,
    };
  } catch (error) {
    console.error("Error in getInvoiceDetails:", error);
    throw error;
  }
}

/**
 * Lấy thông tin hóa đơn đầy đủ cho khách thuê
 */
export async function getInvoiceSummaryForTenant(hopDongId) {
  if (!isReady()) return null;

  try {
    // Lấy hóa đơn chưa thanh toán
    let unpaidInvoice = null;

    try {
      unpaidInvoice = await getLatestUnpaidInvoice(hopDongId);
    } catch (error) {
      console.error("Error loading unpaid invoice:", error);
    }

    return {
      unpaidInvoice,
      hasUnpaidInvoice: !!unpaidInvoice,
    };
  } catch (error) {
    console.error("Error getting invoice summary:", error);
    return null;
  }
}
