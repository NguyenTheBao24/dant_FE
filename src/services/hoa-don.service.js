import { supabase } from "./supabase-client";
import { generateInvoiceId } from "../utils/invoice.utils";
import { createThongBaoForAdminAboutInvoice } from "./thong-bao.service";

function isReady() {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

export async function listHoaDon() {
  if (!isReady()) return [];
  const { data, error } = await supabase
    .from("hoa_don")
    .select(
      "*, hop_dong:hop_dong_id(id, khach_thue:khach _thue_id(ho_ten), can_ho:can_ho_id(so_can, toa_nha_id))"
    )
    .order("ngay_tao", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listHoaDonByToaNha(toaNhaId) {
  if (!isReady()) return [];

  try {
    // Lấy tất cả căn hộ của tòa nhà
    const { data: rooms, error: roomErr } = await supabase
      .from("can_ho")
      .select("id")
      .eq("toa_nha_id", toaNhaId);

    if (roomErr) throw roomErr;
    const roomIds = (rooms || []).map(r => r.id);
    if (roomIds.length === 0) return [];

    // Lấy tất cả hợp đồng của các căn hộ đó
    const { data: contracts, error: contractErr } = await supabase
      .from("hop_dong")
      .select("id")
      .in("can_ho_id", roomIds);

    if (contractErr) throw contractErr;
    const hopDongIds = (contracts || []).map(h => h.id);
    if (hopDongIds.length === 0) return [];

    // Lấy tất cả hóa đơn của các hợp đồng đó
    const { data, error } = await supabase
      .from("hoa_don")
      .select(
        "*, hop_dong:hop_dong_id(id, khach_thue:khach_thue_id(ho_ten), can_ho:can_ho_id(so_can, toa_nha_id))"
      )
      .in("hop_dong_id", hopDongIds)
      .order("ngay_tao", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in listHoaDonByToaNha:", error);
    throw error;
  }
}

/**
 * Generate invoice ID theo format HDYYYYMMDDXXXXXX bằng cách query database
 */
async function generateInvoiceIdAsync(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const prefix = `HD${dateStr}`;

  try {
    const { data, error } = await supabase
      .from("hoa_don")
      .select("id")
      .like("id", `${prefix}%`);

    if (error) {
      console.warn("Error querying invoice IDs, using fallback:", error);
      return generateInvoiceId(date);
    }

    let maxSequence = 0;
    if (data && data.length > 0) {
      for (const invoice of data) {
        if (invoice.id && invoice.id.startsWith(prefix)) {
          const sequenceStr = invoice.id.slice(prefix.length);
          const sequence = parseInt(sequenceStr, 10);
          if (!isNaN(sequence) && sequence > maxSequence) {
            maxSequence = sequence;
          }
        }
      }
    }

    const nextSequence = maxSequence + 1;
    const sequenceStr = String(nextSequence).padStart(6, "0");
    return `${prefix}${sequenceStr}`;
  } catch (error) {
    console.warn("Error generating invoice ID, using fallback:", error);
    return generateInvoiceId(date);
  }
}

export async function createHoaDon(payload) {
  if (!isReady()) return null;

  // Tạo ID theo format HDYYYYMMDDXXXXXX nếu chưa có trong payload
  const invoicePayload = {
    ...payload,
    id: payload.id || (await generateInvoiceIdAsync()),
  };

  const { data, error } = await supabase
    .from("hoa_don")
    .insert([invoicePayload])
    .select()
    .single();
  if (error) throw error;

  // Tự động tạo thông báo cho admin về hóa đơn mới
  if (data && data.hop_dong_id) {
    try {
      await createThongBaoForAdminAboutInvoice(
        data.id,
        data.hop_dong_id,
        data.tong_tien || data.so_tien || 0
      );
      console.log("Notification created for admin about new invoice:", data.id);
    } catch (notifError) {
      // Không throw error nếu tạo thông báo thất bại, chỉ log
      console.warn("Failed to create notification for admin:", notifError);
    }
  }

  return data;
}

export async function updateHoaDon(id, updates) {
  if (!isReady()) return null;
  const { data, error } = await supabase
    .from("hoa_don")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHoaDon(id) {
  if (!isReady()) return { id };
  const { error } = await supabase.from("hoa_don").delete().eq("id", id);
  if (error) throw error;
  return { id };
}

export async function tinhDoanhThuThang(toaNhaId, year, month) {
  if (!isReady()) return 0;
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  // Lấy danh sách hop_dong_id của tòa nhà
  const { data: rooms, error: roomErr } = await supabase
    .from("can_ho")
    .select("id")
    .eq("toa_nha_id", toaNhaId);
  if (roomErr) throw roomErr;
  const roomIds = (rooms || []).map(r => r.id);
  if (roomIds.length === 0) return 0;
  const { data: contracts, error: hdErr } = await supabase
    .from("hop_dong")
    .select("id")
    .in("can_ho_id", roomIds);
  if (hdErr) throw hdErr;
  const hopDongIds = (contracts || []).map(h => h.id);
  if (hopDongIds.length === 0) return 0;

  const { data, error } = await supabase
    .from("hoa_don")
    .select("so_tien, hop_dong_id, tong_tien")
    .gte("ngay_tao", start)
    .lt("ngay_tao", end)
    .eq("trang_thai", "da_thanh_toan") // Chỉ tính các hóa đơn đã thanh toán thành công
    .in("hop_dong_id", hopDongIds);
  if (error) throw error;
  // Ưu tiên dùng tong_tien, nếu không có thì dùng so_tien
  return (data || []).reduce((sum, r) => sum + (r.tong_tien || r.so_tien || 0), 0);
}

export async function countHoaDonChuaThanhToanTrongThang(
  toaNhaId,
  year,
  month
) {
  if (!isReady()) return 0;
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  // Lấy danh sách hop_dong_id của tòa nhà
  const { data: rooms, error: roomErr } = await supabase
    .from("can_ho")
    .select("id")
    .eq("toa_nha_id", toaNhaId);
  if (roomErr) throw roomErr;
  const roomIds = (rooms || []).map(r => r.id);
  if (roomIds.length === 0) return 0;
  const { data: contracts, error: hdErr } = await supabase
    .from("hop_dong")
    .select("id")
    .in("can_ho_id", roomIds);
  if (hdErr) throw hdErr;
  const hopDongIds = (contracts || []).map(h => h.id);
  if (hopDongIds.length === 0) return 0;

  const { count, error } = await supabase
    .from("hoa_don")
    .select("id", { count: "exact", head: true })
    .gte("ngay_tao", start)
    .lt("ngay_tao", end)
    .eq("trang_thai", "chua_tt")
    .in("hop_dong_id", hopDongIds);
  if (error) throw error;
  return count || 0;
}

export async function listHoaDonChuaThanhToanTrongThang(toaNhaId, year, month) {
  if (!isReady()) return [];
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  const { data: rooms, error: roomErr } = await supabase
    .from("can_ho")
    .select("id, so_can")
    .eq("toa_nha_id", toaNhaId);
  if (roomErr) throw roomErr;
  const roomIdToSoCan = new Map((rooms || []).map(r => [r.id, r.so_can]));
  const roomIds = (rooms || []).map(r => r.id);
  if (roomIds.length === 0) return [];
  const { data: contracts, error: hdErr } = await supabase
    .from("hop_dong")
    .select("id, can_ho_id, khach_thue:khach_thue_id(ho_ten)")
    .in("can_ho_id", roomIds);
  if (hdErr) throw hdErr;
  const hopDongIds = (contracts || []).map(h => h.id);
  if (hopDongIds.length === 0) return [];

  const { data, error } = await supabase
    .from("hoa_don")
    .select("id, so_tien, trang_thai, ngay_tao, hop_dong_id")
    .gte("ngay_tao", start)
    .lt("ngay_tao", end)
    .eq("trang_thai", "chua_tt")
    .in("hop_dong_id", hopDongIds);
  if (error) throw error;

  const ctMap = new Map((contracts || []).map(c => [c.id, c]));
  return (data || []).map(inv => {
    const ct = ctMap.get(inv.hop_dong_id);
    const soCan = ct ? roomIdToSoCan.get(ct.can_ho_id) : undefined;
    return { ...inv, room_number: soCan, tenant_name: ct?.khach_thue?.ho_ten };
  });
}

/**
 * Tính doanh thu theo tháng từ các hóa đơn đã thanh toán thành công
 * Trả về object với key là YYYY-MM và value là tổng doanh thu
 * @param {string} toaNhaId - ID tòa nhà
 * @returns {Promise<Record<string, number>>} Object với key là YYYY-MM, value là doanh thu
 */
export async function tinhDoanhThuTheoThangTuHoaDon(toaNhaId) {
  if (!isReady()) return {};

  try {
    // Lấy danh sách hop_dong_id của tòa nhà
    const { data: rooms, error: roomErr } = await supabase
      .from("can_ho")
      .select("id")
      .eq("toa_nha_id", toaNhaId);
    if (roomErr) throw roomErr;
    const roomIds = (rooms || []).map(r => r.id);
    if (roomIds.length === 0) return {};

    const { data: contracts, error: hdErr } = await supabase
      .from("hop_dong")
      .select("id")
      .in("can_ho_id", roomIds);
    if (hdErr) throw hdErr;
    const hopDongIds = (contracts || []).map(h => h.id);
    if (hopDongIds.length === 0) return {};

    // Lấy tất cả hóa đơn đã thanh toán của tòa nhà
    const { data: invoices, error } = await supabase
      .from("hoa_don")
      .select("ngay_tao, tong_tien, so_tien")
      .eq("trang_thai", "da_thanh_toan") // Chỉ tính các hóa đơn đã thanh toán thành công
      .in("hop_dong_id", hopDongIds)
      .order("ngay_tao", { ascending: true });

    if (error) throw error;

    // Gom doanh thu theo tháng (YYYY-MM)
    const revenueByMonth = {};
    (invoices || []).forEach((inv) => {
      if (!inv.ngay_tao) return;
      const date = new Date(inv.ngay_tao);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const ym = `${year}-${month}`;
      const amount = inv.tong_tien || inv.so_tien || 0;
      revenueByMonth[ym] = (revenueByMonth[ym] || 0) + amount;
    });

    return revenueByMonth;
  } catch (error) {
    console.error("Error calculating revenue by month from invoices:", error);
    return {};
  }
}
