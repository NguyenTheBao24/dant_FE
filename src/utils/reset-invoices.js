import { supabase } from "../services/supabase-client";

/**
 * Reset tất cả hóa đơn trong database
 * ⚠️ CẢNH BÁO: Chức năng này sẽ xóa TẤT CẢ hóa đơn!
 */
export async function resetAllInvoices() {
  try {
    console.log("Đang kiểm tra số lượng hóa đơn...");

    // Lấy tất cả hóa đơn
    const { data: invoices, error: fetchError } = await supabase
      .from("hoa_don")
      .select("id");

    if (fetchError) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", fetchError);
      throw fetchError;
    }

    if (!invoices || invoices.length === 0) {
      console.log("✅ Không có hóa đơn nào để xóa");
      return { success: true, deletedCount: 0 };
    }

    console.log(`Tìm thấy ${invoices.length} hóa đơn. Đang xóa...`);

    // Xóa tất cả hóa đơn
    const { error: deleteError } = await supabase
      .from("hoa_don")
      .delete()
      .neq("id", 0); // Xóa tất cả (id luôn > 0)

    if (deleteError) {
      console.error("Lỗi khi xóa hóa đơn:", deleteError);
      throw deleteError;
    }

    console.log(`✅ Đã xóa thành công ${invoices.length} hóa đơn`);

    return {
      success: true,
      deletedCount: invoices.length,
      message: `Đã xóa ${invoices.length} hóa đơn thành công`,
    };
  } catch (error) {
    console.error("❌ Lỗi khi reset hóa đơn:", error);
    return {
      success: false,
      error: error.message || "Có lỗi xảy ra khi reset hóa đơn",
    };
  }
}

/**
 * Kiểm tra xem đã có cột ma_hoa_don chưa
 */
export async function checkMaHoaDonColumn() {
  try {
    // Thử select cột ma_hoa_don từ một record bất kỳ
    const { data, error } = await supabase
      .from("hoa_don")
      .select("ma_hoa_don")
      .limit(1);

    if (error) {
      // Nếu lỗi là column không tồn tại (PostgreSQL error code 42703)
      if (
        error.code === "42703" ||
        error.message?.includes("does not exist") ||
        (error.message?.includes("column") &&
          error.message?.includes("ma_hoa_don"))
      ) {
        return { exists: false };
      }
      // Nếu không có record nào, cũng coi như cột tồn tại (vì không có lỗi column)
      if (error.code === "PGRST116") {
        return { exists: true, note: "Bảng trống, không thể kiểm tra" };
      }
      throw error;
    }

    return { exists: true };
  } catch (error) {
    // Nếu lỗi liên quan đến column không tồn tại
    if (error.message?.includes("ma_hoa_don") || error.code === "42703") {
      return { exists: false };
    }
    return { exists: false, error: error.message };
  }
}

/**
 * Setup database schema cho mã hóa đơn
 * Lưu ý: Function này cần chạy SQL DDL, nên có thể cần service role key
 * Hoặc cần chạy qua Supabase Dashboard hoặc Edge Function
 */
export function getSetupSQLScript() {
  return `
-- ============================================
-- Script Setup Mã Hóa Đơn Tự Động
-- Copy và chạy script này trong Supabase SQL Editor
-- ============================================

-- Bước 1: Thêm cột ma_hoa_don vào bảng hoa_don
ALTER TABLE hoa_don 
ADD COLUMN IF NOT EXISTS ma_hoa_don VARCHAR(50) UNIQUE;

-- Tạo index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_hoa_don_ma_hoa_don ON hoa_don(ma_hoa_don);

-- Bước 2: Tạo function tự động sinh mã hóa đơn
-- Format: HD-YYYYMM-XXXX (ví dụ: HD-202412-0001)
CREATE OR REPLACE FUNCTION generate_ma_hoa_don()
RETURNS TRIGGER AS $$
DECLARE
    year_str VARCHAR(4);
    month_str VARCHAR(2);
    sequence_num INTEGER;
    new_ma_hoa_don VARCHAR(50);
BEGIN
    -- Lấy năm và tháng từ ngay_tao
    year_str := EXTRACT(YEAR FROM NEW.ngay_tao)::VARCHAR;
    month_str := LPAD(EXTRACT(MONTH FROM NEW.ngay_tao)::VARCHAR, 2, '0');
    
    -- Lấy số thứ tự hóa đơn trong tháng đó (cao nhất + 1)
    SELECT COALESCE(
        MAX(CAST(RIGHT(ma_hoa_don, 4) AS INTEGER)), 
        0
    ) + 1
    INTO sequence_num
    FROM hoa_don
    WHERE ma_hoa_don LIKE 'HD-' || year_str || month_str || '-%'
      AND ma_hoa_don IS NOT NULL;
    
    -- Format: HD-YYYYMM-XXXX (ví dụ: HD-202412-0001)
    new_ma_hoa_don := 'HD-' || year_str || month_str || '-' || LPAD(sequence_num::VARCHAR, 4, '0');
    
    NEW.ma_hoa_don := new_ma_hoa_don;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bước 3: Tạo trigger tự động chạy khi insert hóa đơn mới
DROP TRIGGER IF EXISTS trigger_generate_ma_hoa_don ON hoa_don;
CREATE TRIGGER trigger_generate_ma_hoa_don
    BEFORE INSERT ON hoa_don
    FOR EACH ROW
    WHEN (NEW.ma_hoa_don IS NULL OR NEW.ma_hoa_don = '')
    EXECUTE FUNCTION generate_ma_hoa_don();

-- Bước 4: Reset sequence ID về 1 (tùy chọn)
-- ALTER SEQUENCE hoa_don_id_seq RESTART WITH 1;

SELECT 'Setup hoàn tất! Mã hóa đơn sẽ tự động được tạo theo format: HD-YYYYMM-XXXX' as status;
`;
}

/**
 * Tạo mã hóa đơn cho các hóa đơn hiện có (nếu chưa có)
 * Chạy sau khi đã setup trigger
 */
export async function generateMaHoaDonForExistingInvoices() {
  try {
    // Lấy tất cả hóa đơn chưa có mã
    const { data: invoices, error: fetchError } = await supabase
      .from("hoa_don")
      .select("id, ngay_tao, ma_hoa_don")
      .is("ma_hoa_don", null)
      .order("ngay_tao", { ascending: true });

    if (fetchError) {
      console.error("Lỗi khi lấy hóa đơn:", fetchError);
      throw fetchError;
    }

    if (!invoices || invoices.length === 0) {
      return {
        success: true,
        updatedCount: 0,
        message: "Không có hóa đơn nào cần cập nhật",
      };
    }

    console.log(`Tìm thấy ${invoices.length} hóa đơn cần tạo mã...`);

    // Nhóm theo tháng/năm
    const groupedByMonth = {};
    invoices.forEach(inv => {
      const date = new Date(inv.ngay_tao);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;

      if (!groupedByMonth[key]) {
        groupedByMonth[key] = [];
      }
      groupedByMonth[key].push(inv);
    });

    let updatedCount = 0;

    // Tạo mã cho từng nhóm tháng
    for (const [monthKey, monthInvoices] of Object.entries(groupedByMonth)) {
      const [year, month] = monthKey.split("-");
      const yearMonth = `${year}${month}`;

      // Lấy số thứ tự cao nhất trong tháng đó
      const { data: existingInvoices } = await supabase
        .from("hoa_don")
        .select("ma_hoa_don")
        .like("ma_hoa_don", `HD-${yearMonth}-%`)
        .not("ma_hoa_don", "is", null);

      let maxSequence = 0;
      if (existingInvoices && existingInvoices.length > 0) {
        existingInvoices.forEach(inv => {
          const seq = parseInt(inv.ma_hoa_don.split("-").pop() || "0");
          if (seq > maxSequence) maxSequence = seq;
        });
      }

      // Cập nhật mã cho từng hóa đơn
      for (let i = 0; i < monthInvoices.length; i++) {
        maxSequence++;
        const maHoaDon = `HD-${yearMonth}-${String(maxSequence).padStart(
          4,
          "0"
        )}`;

        const { error: updateError } = await supabase
          .from("hoa_don")
          .update({ ma_hoa_don: maHoaDon })
          .eq("id", monthInvoices[i].id);

        if (updateError) {
          console.error(
            `Lỗi khi cập nhật hóa đơn ${monthInvoices[i].id}:`,
            updateError
          );
        } else {
          updatedCount++;
        }
      }
    }

    return {
      success: true,
      updatedCount,
      message: `Đã tạo mã cho ${updatedCount} hóa đơn`,
    };
  } catch (error) {
    console.error("❌ Lỗi khi tạo mã hóa đơn:", error);
    return {
      success: false,
      error: error.message || "Có lỗi xảy ra khi tạo mã hóa đơn",
    };
  }
}
