import { supabase } from "../services/supabase-client";

/**
 * Cập nhật giá thuê căn hộ
 * @param {number} canHoId - ID của căn hộ
 * @param {number} newPrice - Giá mới (đơn vị: VNĐ)
 */
export async function updateRoomPrice(canHoId, newPrice) {
  try {
    console.log(
      `Đang cập nhật giá căn hộ ID ${canHoId} thành ${newPrice.toLocaleString(
        "vi-VN"
      )}₫...`
    );

    const { data, error } = await supabase
      .from("can_ho")
      .update({ gia_thue: newPrice })
      .eq("id", canHoId)
      .select()
      .single();

    if (error) {
      console.error("Lỗi khi cập nhật giá:", error);
      throw error;
    }

    console.log("✅ Cập nhật giá thành công:", data);
    return {
      success: true,
      data,
      message: `Đã cập nhật giá căn hộ ${
        data.so_can
      } thành ${newPrice.toLocaleString("vi-VN")}₫`,
    };
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật giá căn hộ:", error);
    return {
      success: false,
      error: error.message || "Có lỗi xảy ra khi cập nhật giá",
    };
  }
}

/**
 * Cập nhật giá căn hộ A001 (can_ho_id: 693) từ 2.5 triệu lên 4 triệu
 */
export async function updateRoomA001Price() {
  return await updateRoomPrice(693, 4000000);
}
