import { supabase } from "./supabase-client";

function isReady() {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Cập nhật trạng thái hóa đơn thành đã thanh toán
 * @param {string|number} invoiceId - ID của hóa đơn
 */
export async function updateInvoiceStatusToPaid(invoiceId) {
  if (!isReady()) return null;

  try {
    const { data, error } = await supabase
      .from("hoa_don")
      .update({ trang_thai: "da_thanh_toan" })
      .eq("id", invoiceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice status:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateInvoiceStatusToPaid:", error);
    throw error;
  }
}

/**
 * Lấy trạng thái hóa đơn
 * @param {string|number} invoiceId - ID của hóa đơn
 */
export async function getInvoiceStatus(invoiceId) {
  if (!isReady()) return null;

  try {
    const { data, error } = await supabase
      .from("hoa_don")
      .select("id, trang_thai, tong_tien")
      .eq("id", invoiceId)
      .single();

    if (error) {
      console.error("Error getting invoice status:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getInvoiceStatus:", error);
    throw error;
  }
}

/**
 * Tạo URL QR code SePay
 * @param {number} amount - Số tiền thanh toán
 * @param {string|number} invoiceId - ID hóa đơn (để gửi trong description)
 * @param {string} account - Số tài khoản ngân hàng
 * @param {string} bank - Mã ngân hàng
 */
export function generateSePayQRUrl(
  amount,
  invoiceId,
  account = "0570101451408",
  bank = "MBBank"
) {
  const baseUrl = "https://qr.sepay.vn/img";
  const params = new URLSearchParams({
    acc: account,
    bank: bank,
    amount: amount.toString(),
    des: `${invoiceId}`,
    template: "compact",
  });

  return `${baseUrl}?${params.toString()}`;
}
