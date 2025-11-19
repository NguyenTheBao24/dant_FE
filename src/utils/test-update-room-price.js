import { updateCanHo } from "../services/can-ho.service";

/**
 * Script test: Cập nhật giá căn hộ A001 (ID: 693) thành 4000₫ để test thanh toán
 * Chạy script này từ browser console hoặc gọi function này
 */
export async function testUpdateRoomPrice() {
  try {
    console.log("Đang cập nhật giá căn hộ A001 (ID: 693) thành 4000₫...");

    const result = await updateCanHo(693, { gia_thue: 4000 });

    if (result) {
      console.log("✅ Cập nhật giá thành công!");
      console.log("Thông tin căn hộ sau khi cập nhật:", {
        id: result.id,
        so_can: result.so_can,
        gia_thue: result.gia_thue,
        toa_nha_id: result.toa_nha_id,
      });
      alert(
        `✅ Đã cập nhật giá căn hộ ${
          result.so_can
        } thành ${result.gia_thue.toLocaleString("vi-VN")}₫`
      );
      return { success: true, data: result };
    } else {
      throw new Error("Không nhận được dữ liệu từ server");
    }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật giá:", error);
    alert(`❌ Lỗi: ${error.message || "Có lỗi xảy ra khi cập nhật giá"}`);
    return { success: false, error: error.message };
  }
}

// Tự động chạy nếu import trực tiếp (để test nhanh)
// Bỏ comment dòng dưới nếu muốn tự động chạy khi import file này
// testUpdateRoomPrice()
