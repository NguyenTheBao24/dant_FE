import { supabase } from "./supabase-client";
import { generateInvoiceId } from "../utils/invoice.utils";
import { createThongBaoForAdminAboutInvoice } from "./thong-bao.service";

function isReady() {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Kiểm tra hóa đơn hiện tại của hợp đồng trong tháng
 */
export async function getCurrentMonthInvoice(hopDongId, year, month) {
  if (!isReady()) return null;

  try {
    // Tạo ngày đầu và cuối tháng (chính xác số ngày trong tháng)
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate(); // month is 1-based here
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("hoa_don")
      .select("*")
      .eq("hop_dong_id", hopDongId)
      .gte("ngay_tao", startDate)
      .lte("ngay_tao", endDate)
      .order("ngay_tao", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching current month invoice:", error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error("Error in getCurrentMonthInvoice:", error);
    throw error;
  }
}

/**
 * Xóa hóa đơn
 */
export async function deleteInvoice(invoiceId) {
  if (!isReady()) return null;

  try {
    const { error } = await supabase
      .from("hoa_don")
      .delete()
      .eq("id", invoiceId);

    if (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteInvoice:", error);
    throw error;
  }
}

/**
 * Cập nhật hóa đơn
 */
export async function updateInvoice(invoiceId, updateData) {
  if (!isReady()) return null;

  try {
    const { data, error } = await supabase
      .from("hoa_don")
      .update(updateData)
      .eq("id", invoiceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    throw error;
  }
}

/**
 * Kiểm tra có thể tạo hóa đơn mới không
 */
export async function canCreateInvoice(hopDongId, year, month) {
  if (!isReady()) return { canCreate: false, reason: "Service not ready" };

  try {
    const currentInvoice = await getCurrentMonthInvoice(hopDongId, year, month);

    if (!currentInvoice) {
      return { canCreate: true, reason: "No invoice exists for this month" };
    }

    // Nếu hóa đơn đã thanh toán, không thể tạo mới
    if (currentInvoice.trang_thai === "da_thanh_toan") {
      return {
        canCreate: false,
        reason: "Invoice already paid",
        existingInvoice: currentInvoice,
      };
    }

    // Nếu hóa đơn chưa thanh toán, có thể cập nhật
    return {
      canCreate: true,
      reason: "Can update existing unpaid invoice",
      existingInvoice: currentInvoice,
    };
  } catch (error) {
    console.error("Error in canCreateInvoice:", error);
    return { canCreate: false, reason: "Error checking invoice status" };
  }
}

/**
 * Generate invoice ID theo format HDYYYYMMDDXXXXXX bằng cách query database
 * để lấy số thứ tự cao nhất trong ngày
 */
async function generateInvoiceIdAsync(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`; // YYYYMMDD
  const prefix = `HD${dateStr}`;

  try {
    // Query tất cả invoice ID trong ngày hôm nay
    const { data, error } = await supabase
      .from("hoa_don")
      .select("id")
      .like("id", `${prefix}%`);

    if (error) {
      console.warn("Error querying invoice IDs, using fallback:", error);
      // Fallback: sử dụng generateInvoiceId nếu query fail
      return generateInvoiceId(date);
    }

    // Tìm số thứ tự cao nhất
    let maxSequence = 0;
    if (data && data.length > 0) {
      for (const invoice of data) {
        if (invoice.id && invoice.id.startsWith(prefix)) {
          // Extract 6 chữ số cuối cùng (số thứ tự)
          const sequenceStr = invoice.id.slice(prefix.length);
          const sequence = parseInt(sequenceStr, 10);
          if (!isNaN(sequence) && sequence > maxSequence) {
            maxSequence = sequence;
          }
        }
      }
    }

    // Tăng lên 1 và format 6 chữ số
    const nextSequence = maxSequence + 1;
    const sequenceStr = String(nextSequence).padStart(6, "0");

    return `${prefix}${sequenceStr}`;
  } catch (error) {
    console.warn("Error generating invoice ID, using fallback:", error);
    // Fallback: sử dụng generateInvoiceId nếu có lỗi
    return generateInvoiceId(date);
  }
}

/**
 * Tạo hoặc cập nhật hóa đơn cho tháng
 */
export async function createOrUpdateInvoice(
  hopDongId,
  invoiceData,
  year,
  month
) {
  if (!isReady()) return null;

  try {
    const { canCreate, reason, existingInvoice } = await canCreateInvoice(
      hopDongId,
      year,
      month
    );

    if (!canCreate && reason === "Invoice already paid") {
      throw new Error(
        "Không thể tạo hóa đơn mới vì hóa đơn tháng này đã được thanh toán"
      );
    }

    // Nếu có hóa đơn chưa thanh toán, cập nhật
    if (existingInvoice && reason === "Can update existing unpaid invoice") {
      console.log("Updating existing unpaid invoice:", existingInvoice.id);

      const updateData = {
        so_tien: invoiceData.so_tien,
        so_dien_cu: invoiceData.so_dien_cu || 0,
        so_dien_moi: invoiceData.so_dien_moi || 0,
        so_nuoc_cu: invoiceData.so_nuoc_cu || 0,
        so_nuoc_moi: invoiceData.so_nuoc_moi || 0,
        gia_dien: invoiceData.gia_dien || 0,
        gia_nuoc: invoiceData.gia_nuoc || 0,
        gia_dich_vu: invoiceData.gia_dich_vu || 0,
        tong_tien: invoiceData.tong_tien,
      };

      const updatedInvoice = await updateInvoice(
        existingInvoice.id,
        updateData
      );
      return { ...updatedInvoice, action: "updated" };
    }

    // Nếu chưa có hóa đơn, tạo mới
    console.log("Creating new invoice for month:", month, year);

    // Tạo ID theo format HDYYYYMMDDXXXXXX
    const invoiceId = await generateInvoiceIdAsync();

    const { data, error } = await supabase
      .from("hoa_don")
      .insert([
        {
          id: invoiceId,
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
          trang_thai: "chua_tt",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating new invoice:", error);
      throw error;
    }

    // Tự động tạo thông báo cho admin về hóa đơn mới
    try {
      await createThongBaoForAdminAboutInvoice(
        invoiceId,
        hopDongId,
        invoiceData.tong_tien || invoiceData.so_tien
      );
      console.log("Notification created for admin about new invoice:", invoiceId);
    } catch (notifError) {
      // Không throw error nếu tạo thông báo thất bại, chỉ log
      console.warn("Failed to create notification for admin:", notifError);
    }

    return { ...data, action: "created" };
  } catch (error) {
    console.error("Error in createOrUpdateInvoice:", error);
    throw error;
  }
}
