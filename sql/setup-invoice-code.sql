-- ============================================
-- Script Setup Mã Hóa Đơn Tự Động
-- Copy và chạy script này trong Supabase SQL Editor
-- Hoặc sử dụng Supabase CLI: supabase db execute --file sql/setup-invoice-code.sql
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

-- Bước 4: (Tùy chọn) Reset sequence ID về 1 nếu muốn
-- ALTER SEQUENCE hoa_don_id_seq RESTART WITH 1;

-- Kiểm tra function đã tạo thành công
SELECT 'Setup hoàn tất! Mã hóa đơn sẽ tự động được tạo theo format: HD-YYYYMM-XXXX' as status;

