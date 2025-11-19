-- ============================================
-- Script Cập Nhật Giá Thuê Căn Hộ
-- ============================================

-- Cập nhật giá thuê căn hộ A001 (can_ho_id: 693) từ 2,500,000₫ lên 4,000,000₫
UPDATE can_ho
SET gia_thue = 4000000
WHERE id = 693;

-- Kiểm tra kết quả
SELECT 
    id,
    so_can,
    gia_thue,
    toa_nha_id
FROM can_ho
WHERE id = 693;

-- Kết quả mong đợi:
-- id: 693
-- so_can: A001
-- gia_thue: 4000000 (4 triệu)
-- toa_nha_id: 41

