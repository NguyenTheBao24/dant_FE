import { supabase } from "./supabase-client";
import { generateInvoiceId } from "../utils/invoice.utils";

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
  const { data, error } = await supabase
    .from("hoa_don")
    .select(
      "*, hop_dong:hop_dong_id(id, khach_thue:khach_thue_id(ho_ten), can_ho:can_ho_id(so_can, toa_nha_id))"
    )
    .eq("hop_dong.can_ho.toa_nha_id", toaNhaId)
    .order("ngay_tao", { ascending: false });
  if (error) throw error;
  return data || [];
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
    .select("so_tien, hop_dong_id")
    .gte("ngay_tao", start)
    .lt("ngay_tao", end)
    .in("hop_dong_id", hopDongIds);
  if (error) throw error;
  return (data || []).reduce((sum, r) => sum + (r.so_tien || 0), 0);
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
