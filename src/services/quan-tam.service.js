import { supabase } from "./supabase-client";

function generateQuanTamId() {
  const prefix = "QT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function isReady() {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Lưu thông tin quan tâm của khách hàng
 * @param {Object} data - Dữ liệu quan tâm
 * @param {number} data.toa_nha_id - ID tòa nhà
 * @param {string} data.ho_ten - Họ tên khách hàng
 * @param {string} data.sdt - Số điện thoại
 * @param {string} data.email - Email (không bắt buộc)
 * @param {string} data.ghi_chu - Ghi chú/tin nhắn (không bắt buộc)
 * @returns {Promise<Object>} Dữ liệu đã lưu
 */
export async function createQuanTam(data) {
  if (!isReady()) {
    throw new Error("Supabase client chưa sẵn sàng");
  }

  console.log("Creating quan tam record:", data);

  try {
    const { data: result, error } = await supabase
      .from("quan_tam")
      .insert([
        {
          id: generateQuanTamId(),
          toa_nha_id: data.toa_nha_id,
          ho_ten: data.ho_ten,
          sdt: data.sdt,
          email: data.email || null,
          ghi_chu: data.ghi_chu || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating quan tam:", error);
      throw error;
    }

    console.log("Successfully created quan tam:", result);
    return result;
  } catch (error) {
    console.error("Error in createQuanTam:", error);
    throw error;
  }
}

/**
 * Lấy danh sách quan tâm theo tòa nhà
 * @param {number} toaNhaId - ID tòa nhà
 * @returns {Promise<Array>} Danh sách quan tâm
 */
export async function listQuanTamByToaNha(toaNhaId) {
  if (!isReady()) return [];

  try {
    const { data, error } = await supabase
      .from("quan_tam")
      .select("*")
      .eq("toa_nha_id", toaNhaId)
      .order("ngay_tao", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading quan tam by toa nha:", error);
    throw error;
  }
}

/**
 * Lấy tất cả quan tâm (admin)
 * @returns {Promise<Array>} Danh sách tất cả quan tâm
 */
export async function listAllQuanTam() {
  if (!isReady()) return [];

  try {
    const { data, error } = await supabase
      .from("quan_tam")
      .select(
        `
                *,
                toa_nha:toa_nha_id(id, ten_toa, dia_chi)
            `
      )
      .order("ngay_tao", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading all quan tam:", error);
    throw error;
  }
}

/**
 * Xóa quan tâm
 * @param {number} id - ID quan tâm
 * @returns {Promise<boolean>} Kết quả xóa
 */
export async function deleteQuanTam(id) {
  if (!isReady()) return false;

  try {
    const { error } = await supabase.from("quan_tam").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting quan tam:", error);
    throw error;
  }
}
