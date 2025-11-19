-- ============================================
-- Script Cập Nhật Giá Thuê Căn Hộ A001
-- Đổi giá thành 4000₫ để test thanh toán
-- ============================================

-- Cập nhật giá thuê căn hộ A001 (can_ho_id: 693) thành 4000₫
UPDATE can_ho
SET gia_thue = 4000
WHERE id = 693;

-- Kiểm tra kết quả
SELECT 
    id,
    so_can,
    gia_thue,
    toa_nha_id,
    trang_thai
FROM can_ho
WHERE id = 693;

-- Kết quả mong đợi:
-- id: 693
-- so_can: A001
-- gia_thue: 4000 (4 nghìn VNĐ - để test thanh toán)
-- toa_nha_id: 41

