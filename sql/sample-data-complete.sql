-- ============================================
-- Script Dữ Liệu Mẫu Hoàn Chỉnh
-- Cho Hệ Thống Quản Lý Nhà Trọ
-- ============================================
-- 
-- Script này tạo dữ liệu mẫu đầy đủ để test tất cả các chức năng:
-- - Tài khoản (Admin, Manager, Tenant)
-- - Tòa nhà và Quản lý
-- - Căn hộ/Phòng
-- - Khách thuê
-- - Hợp đồng
-- - Hóa đơn
-- - Thông báo và Phản hồi
-- - Chi tiêu
-- - Bảng giá
-- - Quan tâm
--
-- Lưu ý: Chạy script này trong Supabase SQL Editor
-- ============================================

-- Xóa dữ liệu cũ (tùy chọn - chỉ dùng khi muốn reset)
-- DELETE FROM phan_hoi_thong_bao;
-- DELETE FROM thong_bao;
-- DELETE FROM hoa_don;
-- DELETE FROM hop_dong;
-- DELETE FROM quan_tam;
-- DELETE FROM chi_tieu;
-- DELETE FROM khach_thue;
-- DELETE FROM can_ho;
-- DELETE FROM toa_nha;
-- DELETE FROM quan_ly;
-- DELETE FROM tai_khoan;
-- DELETE FROM bang_gia;

-- ============================================
-- 1. TÀI KHOẢN (tai_khoan)
-- ============================================
-- Admin account
INSERT INTO tai_khoan (id, username, password, role, created_at) VALUES
('TK0000000001', 'admin', 'admin123', 'admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- Manager accounts
INSERT INTO tai_khoan (id, username, password, role, created_at) VALUES
('TK0000000002', 'manager1', 'manager123', 'quan_ly', NOW()),
('TK0000000003', 'manager2', 'manager123', 'quan_ly', NOW()),
('TK0000000004', 'manager3', 'manager123', 'quan_ly', NOW())
ON CONFLICT (id) DO NOTHING;

-- Tenant accounts
INSERT INTO tai_khoan (id, username, password, role, created_at) VALUES
('TK0000000005', 'tenant1', 'tenant123', 'khach_thue', NOW()),
('TK0000000006', 'tenant2', 'tenant123', 'khach_thue', NOW()),
('TK0000000007', 'tenant3', 'tenant123', 'khach_thue', NOW()),
('TK0000000008', 'tenant4', 'tenant123', 'khach_thue', NOW()),
('TK0000000009', 'tenant5', 'tenant123', 'khach_thue', NOW()),
('TK0000000010', 'tenant6', 'tenant123', 'khach_thue', NOW()),
('TK0000000011', 'tenant7', 'tenant123', 'khach_thue', NOW()),
('TK0000000012', 'tenant8', 'tenant123', 'khach_thue', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. QUẢN LÝ (quan_ly)
-- ============================================
INSERT INTO quan_ly (id, ho_ten, sdt, email, tai_khoan_id, created_at) VALUES
('QL0000000001', 'Nguyễn Văn Quản Lý 1', '0912345678', 'manager1@example.com', 'TK0000000002', NOW()),
('QL0000000002', 'Trần Thị Quản Lý 2', '0923456789', 'manager2@example.com', 'TK0000000003', NOW()),
('QL0000000003', 'Lê Văn Quản Lý 3', '0934567890', 'manager3@example.com', 'TK0000000004', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. TÒA NHÀ (toa_nha)
-- ============================================
-- Lưu ý: Bảng toa_nha chỉ có các cột: id, ten_toa, dia_chi, quan_ly_id
INSERT INTO toa_nha (id, ten_toa, dia_chi, quan_ly_id) VALUES
('TN0000000001', 'Tòa nhà A - Khu trọ cao cấp', '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM', 'QL0000000001'),
('TN0000000002', 'Tòa nhà B - Khu trọ tiện nghi', '456 Đường DEF, Phường UVW, Quận 2, TP.HCM', 'QL0000000002'),
('TN0000000003', 'Tòa nhà C - Khu trọ hiện đại', '789 Đường GHI, Phường RST, Quận 3, TP.HCM', 'QL0000000003')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CĂN HỘ/PHÒNG (can_ho)
-- ============================================
-- Tòa nhà A - 50 phòng (10 phòng/tầng, 5 tầng)
INSERT INTO can_ho (id, so_can, dien_tich, trang_thai, toa_nha_id, gia_thue, created_at) VALUES
-- Tầng 1 - Phòng đơn (10 phòng)
('CH0000000001', 'A101', 25, 'da_thue', 'TN0000000001', 3500000, NOW()),
('CH0000000002', 'A102', 25, 'da_thue', 'TN0000000001', 3500000, NOW()),
('CH0000000003', 'A103', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000004', 'A104', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000005', 'A105', 25, 'da_thue', 'TN0000000001', 3500000, NOW()),
('CH0000000006', 'A106', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000007', 'A107', 25, 'da_thue', 'TN0000000001', 3500000, NOW()),
('CH0000000008', 'A108', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000009', 'A109', 25, 'da_thue', 'TN0000000001', 3500000, NOW()),
('CH0000000010', 'A110', 25, 'trong', 'TN0000000001', 3500000, NOW()),
-- Tầng 2 - Phòng đôi (10 phòng)
('CH0000000011', 'A201', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
('CH0000000012', 'A202', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
('CH0000000013', 'A203', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000014', 'A204', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
('CH0000000015', 'A205', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000016', 'A206', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
('CH0000000017', 'A207', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000018', 'A208', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
('CH0000000019', 'A209', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000020', 'A210', 35, 'da_thue', 'TN0000000001', 5000000, NOW()),
-- Tầng 3 - Phòng VIP (10 phòng)
('CH0000000021', 'A301', 45, 'da_thue', 'TN0000000001', 7500000, NOW()),
('CH0000000022', 'A302', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000023', 'A303', 45, 'da_thue', 'TN0000000001', 7500000, NOW()),
('CH0000000024', 'A304', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000025', 'A305', 45, 'da_thue', 'TN0000000001', 7500000, NOW()),
('CH0000000026', 'A306', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000027', 'A307', 45, 'da_thue', 'TN0000000001', 7500000, NOW()),
('CH0000000028', 'A308', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000029', 'A309', 45, 'da_thue', 'TN0000000001', 7500000, NOW()),
('CH0000000030', 'A310', 45, 'trong', 'TN0000000001', 7500000, NOW()),
-- Tầng 4 - Mix (10 phòng)
('CH0000000031', 'A401', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000032', 'A402', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000033', 'A403', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000034', 'A404', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000035', 'A405', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000036', 'A406', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000037', 'A407', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000038', 'A408', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000039', 'A409', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000040', 'A410', 25, 'trong', 'TN0000000001', 3500000, NOW()),
-- Tầng 5 - Mix (10 phòng)
('CH0000000041', 'A501', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000042', 'A502', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000043', 'A503', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000044', 'A504', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000045', 'A505', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000046', 'A506', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000047', 'A507', 35, 'trong', 'TN0000000001', 5000000, NOW()),
('CH0000000048', 'A508', 25, 'trong', 'TN0000000001', 3500000, NOW()),
('CH0000000049', 'A509', 45, 'trong', 'TN0000000001', 7500000, NOW()),
('CH0000000050', 'A510', 35, 'trong', 'TN0000000001', 5000000, NOW())
ON CONFLICT (id) DO NOTHING;

-- Tòa nhà B - 40 phòng (10 phòng/tầng, 4 tầng)
INSERT INTO can_ho (id, so_can, dien_tich, trang_thai, toa_nha_id, gia_thue, created_at) VALUES
-- Tầng 1
('CH0000000051', 'B101', 25, 'da_thue', 'TN0000000002', 3500000, NOW()),
('CH0000000052', 'B102', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000053', 'B103', 35, 'da_thue', 'TN0000000002', 5000000, NOW()),
('CH0000000054', 'B104', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000055', 'B105', 35, 'da_thue', 'TN0000000002', 5000000, NOW()),
('CH0000000056', 'B106', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000057', 'B107', 45, 'da_thue', 'TN0000000002', 7500000, NOW()),
('CH0000000058', 'B108', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000059', 'B109', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000060', 'B110', 25, 'trong', 'TN0000000002', 3500000, NOW()),
-- Tầng 2
('CH0000000061', 'B201', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000062', 'B202', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000063', 'B203', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000064', 'B204', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000065', 'B205', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000066', 'B206', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000067', 'B207', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000068', 'B208', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000069', 'B209', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000070', 'B210', 25, 'trong', 'TN0000000002', 3500000, NOW()),
-- Tầng 3
('CH0000000071', 'B301', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000072', 'B302', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000073', 'B303', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000074', 'B304', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000075', 'B305', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000076', 'B306', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000077', 'B307', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000078', 'B308', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000079', 'B309', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000080', 'B310', 35, 'trong', 'TN0000000002', 5000000, NOW()),
-- Tầng 4
('CH0000000081', 'B401', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000082', 'B402', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000083', 'B403', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000084', 'B404', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000085', 'B405', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000086', 'B406', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000087', 'B407', 45, 'trong', 'TN0000000002', 7500000, NOW()),
('CH0000000088', 'B408', 35, 'trong', 'TN0000000002', 5000000, NOW()),
('CH0000000089', 'B409', 25, 'trong', 'TN0000000002', 3500000, NOW()),
('CH0000000090', 'B410', 35, 'trong', 'TN0000000002', 5000000, NOW())
ON CONFLICT (id) DO NOTHING;

-- Tòa nhà C - 60 phòng (10 phòng/tầng, 6 tầng) - Chỉ thêm một số phòng mẫu
INSERT INTO can_ho (id, so_can, dien_tich, trang_thai, toa_nha_id, gia_thue, created_at) VALUES
('CH0000000091', 'C101', 25, 'trong', 'TN0000000003', 3500000, NOW()),
('CH0000000092', 'C102', 35, 'trong', 'TN0000000003', 5000000, NOW()),
('CH0000000093', 'C103', 45, 'trong', 'TN0000000003', 7500000, NOW()),
('CH0000000094', 'C201', 25, 'trong', 'TN0000000003', 3500000, NOW()),
('CH0000000095', 'C202', 35, 'trong', 'TN0000000003', 5000000, NOW()),
('CH0000000096', 'C301', 45, 'trong', 'TN0000000003', 7500000, NOW()),
('CH0000000097', 'C302', 25, 'trong', 'TN0000000003', 3500000, NOW()),
('CH0000000098', 'C401', 35, 'trong', 'TN0000000003', 5000000, NOW()),
('CH0000000099', 'C402', 45, 'trong', 'TN0000000003', 7500000, NOW()),
('CH0000000100', 'C501', 25, 'trong', 'TN0000000003', 3500000, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. KHÁCH THUÊ (khach_thue)
-- ============================================
-- Lưu ý: Bảng khach_thue chỉ có các cột: id, ho_ten, sdt, email, cccd, tai_khoan_id
-- KHÔNG có: dia_chi, created_at
INSERT INTO khach_thue (id, ho_ten, sdt, email, cccd, tai_khoan_id) VALUES
('KT0000000001', 'Nguyễn Văn An', '0901234567', 'nguyenvanan@example.com', '001234567890', 'TK0000000005'),
('KT0000000002', 'Trần Thị Bình', '0912345678', 'tranthibinh@example.com', '001234567891', 'TK0000000006'),
('KT0000000003', 'Lê Văn Cường', '0923456789', 'levancuong@example.com', '001234567892', 'TK0000000007'),
('KT0000000004', 'Phạm Thị Dung', '0934567890', 'phamthidung@example.com', '001234567893', 'TK0000000008'),
('KT0000000005', 'Hoàng Văn Em', '0945678901', 'hoangvanem@example.com', '001234567894', 'TK0000000009'),
('KT0000000006', 'Vũ Thị Phương', '0956789012', 'vuthiphuong@example.com', '001234567895', 'TK0000000010'),
('KT0000000007', 'Đỗ Văn Giang', '0967890123', 'dovangiang@example.com', '001234567896', 'TK0000000011'),
('KT0000000008', 'Bùi Thị Hoa', '0978901234', 'buithihoa@example.com', '001234567897', 'TK0000000012')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. HỢP ĐỒNG (hop_dong)
-- ============================================
-- Lưu ý: Bảng hop_dong chỉ có các cột: id, khach_thue_id, can_ho_id, ngay_bat_dau, ngay_ket_thuc, trang_thai
-- KHÔNG có: tien_coc, created_at
-- Trạng thái: 'hieu_luc' (đang hiệu lực) hoặc 'het_han' (đã hết hạn)
INSERT INTO hop_dong (id, khach_thue_id, can_ho_id, ngay_bat_dau, ngay_ket_thuc, trang_thai) VALUES
-- Hợp đồng đang hoạt động
('HD0000000001', 'KT0000000001', 'CH0000000001', '2024-01-01', '2024-12-31', 'hieu_luc'),
('HD0000000002', 'KT0000000002', 'CH0000000002', '2024-02-01', '2025-01-31', 'hieu_luc'),
('HD0000000003', 'KT0000000003', 'CH0000000011', '2024-03-01', '2025-02-28', 'hieu_luc'),
('HD0000000004', 'KT0000000004', 'CH0000000012', '2024-04-01', '2025-03-31', 'hieu_luc'),
('HD0000000005', 'KT0000000005', 'CH0000000021', '2024-05-01', '2025-04-30', 'hieu_luc'),
('HD0000000006', 'KT0000000006', 'CH0000000005', '2024-06-01', '2025-05-31', 'hieu_luc'),
('HD0000000007', 'KT0000000007', 'CH0000000007', '2024-07-01', '2025-06-30', 'hieu_luc'),
('HD0000000008', 'KT0000000008', 'CH0000000009', '2024-08-01', '2025-07-31', 'hieu_luc'),
-- Hợp đồng đã hết hạn
('HD0000000009', 'KT0000000001', 'CH0000000014', '2023-01-01', '2023-12-31', 'het_han'),
('HD0000000010', 'KT0000000002', 'CH0000000016', '2023-02-01', '2024-01-31', 'het_han')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. HÓA ĐƠN (hoa_don)
-- ============================================
-- Lưu ý: Bảng hoa_don có các cột: id, hop_dong_id, so_tien (hoặc tong_tien), trang_thai, ngay_tao
-- KHÔNG có: thang, nam, ngay_thanh_toan (sử dụng ngay_tao để xác định tháng/năm)
-- Trạng thái: 'da_thanh_toan' (đã thanh toán) hoặc 'chua_tt' (chưa thanh toán)
-- Hóa đơn đã thanh toán - Năm 2024
INSERT INTO hoa_don (id, hop_dong_id, so_tien, trang_thai, ngay_tao) VALUES
-- Tháng 1/2024
('HD-202401-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-01-05 10:30:00'),
('HD-202401-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-01-06 14:20:00'),
-- Tháng 2/2024
('HD-202402-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-02-05 09:15:00'),
('HD-202402-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-02-06 16:45:00'),
-- Tháng 3/2024
('HD-202403-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-03-05 11:00:00'),
('HD-202403-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-03-07 13:30:00'),
('HD-202403-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-03-05 15:20:00'),
-- Tháng 4/2024
('HD-202404-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-04-05 10:00:00'),
('HD-202404-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-04-06 14:00:00'),
('HD-202404-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-04-05 16:00:00'),
('HD-202404-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-04-07 09:30:00'),
-- Tháng 5/2024
('HD-202405-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-05-05 10:15:00'),
('HD-202405-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-05-06 14:30:00'),
('HD-202405-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-05-05 15:45:00'),
('HD-202405-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-05-07 11:00:00'),
('HD-202405-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-05-08 13:20:00'),
-- Tháng 6/2024
('HD-202406-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-06-05 10:00:00'),
('HD-202406-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-06-06 14:00:00'),
('HD-202406-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-06-05 15:00:00'),
('HD-202406-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-06-07 09:00:00'),
('HD-202406-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-06-08 13:00:00'),
('HD-202406-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-06-09 16:00:00'),
-- Tháng 7/2024
('HD-202407-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-07-05 10:30:00'),
('HD-202407-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-07-06 14:20:00'),
('HD-202407-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-07-05 15:10:00'),
('HD-202407-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-07-07 09:40:00'),
('HD-202407-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-07-08 13:50:00'),
('HD-202407-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-07-09 16:20:00'),
('HD-202407-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-07-10 11:30:00'),
-- Tháng 8/2024
('HD-202408-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-08-05 10:00:00'),
('HD-202408-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-08-06 14:00:00'),
('HD-202408-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-08-05 15:00:00'),
('HD-202408-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-08-07 09:00:00'),
('HD-202408-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-08-08 13:00:00'),
('HD-202408-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-08-09 16:00:00'),
('HD-202408-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-08-10 11:00:00'),
('HD-202408-0008', 'HD0000000008', 3500000, 'da_thanh_toan', '2024-08-11 12:00:00'),
-- Tháng 9/2024
('HD-202409-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-09-05 10:15:00'),
('HD-202409-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-09-06 14:30:00'),
('HD-202409-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-09-05 15:45:00'),
('HD-202409-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-09-07 11:00:00'),
('HD-202409-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-09-08 13:20:00'),
('HD-202409-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-09-09 16:10:00'),
('HD-202409-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-09-10 11:30:00'),
('HD-202409-0008', 'HD0000000008', 3500000, 'da_thanh_toan', '2024-09-11 12:40:00'),
-- Tháng 10/2024
('HD-202410-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-10-05 10:00:00'),
('HD-202410-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-10-06 14:00:00'),
('HD-202410-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-10-05 15:00:00'),
('HD-202410-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-10-07 09:00:00'),
('HD-202410-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-10-08 13:00:00'),
('HD-202410-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-10-09 16:00:00'),
('HD-202410-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-10-10 11:00:00'),
('HD-202410-0008', 'HD0000000008', 3500000, 'da_thanh_toan', '2024-10-11 12:00:00'),
-- Tháng 11/2024
('HD-202411-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-11-05 10:20:00'),
('HD-202411-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-11-06 14:40:00'),
('HD-202411-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-11-05 15:10:00'),
('HD-202411-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-11-07 09:30:00'),
('HD-202411-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-11-08 13:50:00'),
('HD-202411-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-11-09 16:20:00'),
('HD-202411-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-11-10 11:40:00'),
('HD-202411-0008', 'HD0000000008', 3500000, 'da_thanh_toan', '2024-11-11 12:10:00'),
-- Tháng 12/2024
('HD-202412-0001', 'HD0000000001', 3500000, 'da_thanh_toan', '2024-12-05 10:00:00'),
('HD-202412-0002', 'HD0000000002', 3500000, 'da_thanh_toan', '2024-12-06 14:00:00'),
('HD-202412-0003', 'HD0000000003', 5000000, 'da_thanh_toan', '2024-12-05 15:00:00'),
('HD-202412-0004', 'HD0000000004', 5000000, 'da_thanh_toan', '2024-12-07 09:00:00'),
('HD-202412-0005', 'HD0000000005', 7500000, 'da_thanh_toan', '2024-12-08 13:00:00'),
('HD-202412-0006', 'HD0000000006', 3500000, 'da_thanh_toan', '2024-12-09 16:00:00'),
('HD-202412-0007', 'HD0000000007', 3500000, 'da_thanh_toan', '2024-12-10 11:00:00'),
('HD-202412-0008', 'HD0000000008', 3500000, 'da_thanh_toan', '2024-12-11 12:00:00'),
-- Hóa đơn chưa thanh toán - Tháng 1/2025 (hiện tại)
('HD-202501-0001', 'HD0000000001', 3500000, 'chua_tt', NOW()),
('HD-202501-0002', 'HD0000000002', 3500000, 'chua_tt', NOW()),
('HD-202501-0003', 'HD0000000003', 5000000, 'chua_tt', NOW()),
('HD-202501-0004', 'HD0000000004', 5000000, 'chua_tt', NOW()),
('HD-202501-0005', 'HD0000000005', 7500000, 'chua_tt', NOW()),
('HD-202501-0006', 'HD0000000006', 3500000, 'chua_tt', NOW()),
('HD-202501-0007', 'HD0000000007', 3500000, 'chua_tt', NOW()),
('HD-202501-0008', 'HD0000000008', 3500000, 'chua_tt', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. THÔNG BÁO (thong_bao)
-- ============================================
INSERT INTO thong_bao (id, khach_thue_id, toa_nha_id, can_ho_id, tieu_de, noi_dung, loai_thong_bao, trang_thai, ngay_tao) VALUES
-- Thông báo liên hệ
('TB20250101000001', 'KT0000000001', 'TN0000000001', 'CH0000000001', 'Thông tin liên hệ mới - Tòa nhà A', 'Có thông tin liên hệ mới từ khách hàng:\n\nHọ tên: Nguyễn Văn Khách\nSố điện thoại: 0901111111\nEmail: khachmoi@example.com\n\nGhi chú:\nTôi muốn thuê phòng đơn', 'lien_he', 'chua_xu_ly', NOW() - INTERVAL '2 days'),
('TB20250102000001', 'KT0000000002', 'TN0000000001', NULL, 'Thông tin liên hệ mới - Tòa nhà A', 'Có thông tin liên hệ mới từ khách hàng:\n\nHọ tên: Trần Thị Khách\nSố điện thoại: 0902222222\n\nGhi chú:\nCần phòng đôi', 'lien_he', 'dang_xu_ly', NOW() - INTERVAL '1 day'),
-- Thông báo thanh toán
('TB20250103000001', 'KT0000000003', 'TN0000000001', 'CH0000000011', 'Hóa đơn mới - Phòng A201', 'Nguyễn Văn An - Hóa đơn số HD-202501-0001 với số tiền 3.500.000₫ cần được xử lý.', 'thanh_toan', 'chua_xu_ly', NOW() - INTERVAL '3 hours'),
('TB20250103000002', 'KT0000000004', 'TN0000000001', 'CH0000000012', 'Hóa đơn mới - Phòng A202', 'Trần Thị Bình - Hóa đơn số HD-202501-0002 với số tiền 3.500.000₫ cần được xử lý.', 'thanh_toan', 'da_xu_ly', NOW() - INTERVAL '1 day'),
-- Thông báo sửa chữa
('TB20250104000001', 'KT0000000005', 'TN0000000001', 'CH0000000021', 'Yêu cầu sửa chữa - Phòng A301', 'Máy lạnh trong phòng không hoạt động. Cần kiểm tra và sửa chữa gấp.', 'sua_chua', 'chua_xu_ly', NOW() - INTERVAL '5 hours'),
('TB20250104000002', 'KT0000000006', 'TN0000000001', 'CH0000000005', 'Yêu cầu sửa chữa - Phòng A105', 'Vòi nước trong phòng tắm bị rò rỉ. Cần sửa ngay.', 'sua_chua', 'dang_xu_ly', NOW() - INTERVAL '2 hours'),
-- Thông báo phản ánh
('TB20250105000001', 'KT0000000007', 'TN0000000001', 'CH0000000007', 'Phản ánh về tiếng ồn - Phòng A107', 'Hàng xóm ở phòng bên cạnh gây tiếng ồn vào ban đêm. Mong được xử lý.', 'phan_anh', 'chua_xu_ly', NOW() - INTERVAL '1 hour'),
('TB20250105000002', 'KT0000000008', 'TN0000000001', 'CH0000000009', 'Phản ánh về vệ sinh - Phòng A109', 'Khu vực hành lang không được vệ sinh thường xuyên. Cần cải thiện.', 'phan_anh', 'da_xu_ly', NOW() - INTERVAL '1 day'),
-- Thông báo khác
('TB20250106000001', 'KT0000000001', 'TN0000000001', 'CH0000000001', 'Thông báo chung - Tòa nhà A', 'Thông báo: Sẽ có bảo trì hệ thống điện vào ngày mai từ 8h-12h. Mong mọi người lưu ý.', 'khac', 'chua_xu_ly', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. PHẢN HỒI THÔNG BÁO (phan_hoi_thong_bao)
-- ============================================
INSERT INTO phan_hoi_thong_bao (id, thong_bao_id, nguoi_gui_loai, nguoi_gui_id, noi_dung, created_at) VALUES
-- Phản hồi từ khách thuê
('PH20250101000001', 'TB20250104000001', 'khach_thue', 'KT0000000005', 'Cảm ơn quản lý đã phản hồi. Tôi sẽ chờ thợ đến sửa.', NOW() - INTERVAL '4 hours'),
('PH20250101000002', 'TB20250104000002', 'khach_thue', 'KT0000000006', 'Vòi nước đã được sửa. Cảm ơn!', NOW() - INTERVAL '1 hour'),
-- Phản hồi từ quản lý
('PH20250101000003', 'TB20250104000001', 'quan_ly', 'QL0000000001', 'Chúng tôi đã liên hệ thợ sửa chữa. Sẽ đến kiểm tra trong vòng 2 giờ tới.', NOW() - INTERVAL '3 hours'),
('PH20250101000004', 'TB20250104000002', 'quan_ly', 'QL0000000001', 'Đã cử thợ đến sửa. Vui lòng kiểm tra lại.', NOW() - INTERVAL '2 hours'),
('PH20250101000005', 'TB20250105000001', 'quan_ly', 'QL0000000001', 'Chúng tôi sẽ nhắc nhở hàng xóm về vấn đề tiếng ồn. Cảm ơn bạn đã phản ánh.', NOW() - INTERVAL '30 minutes'),
('PH20250101000006', 'TB20250105000002', 'quan_ly', 'QL0000000001', 'Đã tăng cường lịch vệ sinh hành lang. Cảm ơn bạn đã phản ánh.', NOW() - INTERVAL '20 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. CHI TIÊU (chi_tieu)
-- ============================================
-- Lưu ý: Bảng chi_tieu có các cột: id, toa_nha_id, loai_chi, so_tien, mo_ta, ngay, created_at
-- KHÔNG có: loai_chi_tieu (phải dùng loai_chi)
INSERT INTO chi_tieu (id, toa_nha_id, loai_chi, so_tien, mo_ta, ngay, created_at) VALUES
-- Chi tiêu tháng 1/2025
('CT20250101000001', 'TN0000000001', 'dien_nuoc', 5000000, 'Tiền điện tháng 1/2025', '2025-01-15', NOW() - INTERVAL '15 days'),
('CT20250101000002', 'TN0000000001', 'bao_tri', 2000000, 'Bảo trì hệ thống điện', '2025-01-20', NOW() - INTERVAL '10 days'),
('CT20250101000003', 'TN0000000001', 've_sinh', 1500000, 'Dịch vụ vệ sinh tháng 1', '2025-01-25', NOW() - INTERVAL '5 days'),
('CT20250101000004', 'TN0000000002', 'dien_nuoc', 4000000, 'Tiền điện tháng 1/2025', '2025-01-15', NOW() - INTERVAL '15 days'),
('CT20250101000005', 'TN0000000002', 've_sinh', 1200000, 'Dịch vụ vệ sinh tháng 1', '2025-01-25', NOW() - INTERVAL '5 days'),
('CT20250101000006', 'TN0000000003', 'dien_nuoc', 6000000, 'Tiền điện tháng 1/2025', '2025-01-15', NOW() - INTERVAL '15 days'),
('CT20250101000007', 'TN0000000003', 'bao_tri', 3000000, 'Bảo trì thang máy', '2025-01-22', NOW() - INTERVAL '8 days'),
-- Chi tiêu tháng 12/2024
('CT20241215000001', 'TN0000000001', 'dien_nuoc', 4800000, 'Tiền điện tháng 12/2024', '2024-12-15', NOW() - INTERVAL '45 days'),
('CT20241220000001', 'TN0000000001', 've_sinh', 1500000, 'Dịch vụ vệ sinh tháng 12', '2024-12-20', NOW() - INTERVAL '40 days'),
('CT20241225000001', 'TN0000000001', 'khac', 1000000, 'Chi phí khác tháng 12', '2024-12-25', NOW() - INTERVAL '35 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. BẢNG GIÁ (bang_gia)
-- ============================================
-- Lưu ý: Bảng bang_gia có các cột: id, gia_dien, gia_nuoc
-- Có thể có thêm: gia_internet, gia_ve_sinh, gia_gui_xe, gia_dich_vu (tùy database)
-- KHÔNG có: loai_phong, gia_thue, dien_tich, mo_ta, created_at
-- Bảng giá này dùng chung cho tất cả tòa nhà (chỉ có 1 bản ghi)
-- Thử với chỉ gia_dien và gia_nuoc trước
INSERT INTO bang_gia (id, gia_dien, gia_nuoc) VALUES
(1, 3500, 25000)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. QUAN TÂM (quan_tam)
-- ============================================
-- Lưu ý: Bảng quan_tam có các cột: id, toa_nha_id, ho_ten, sdt, email, ghi_chu
-- Có thể có: ngay_tao (tự động tạo bởi database)
-- KHÔNG có: created_at
INSERT INTO quan_tam (id, toa_nha_id, ho_ten, sdt, email, ghi_chu) VALUES
('QT-20250101-ABCD', 'TN0000000001', 'Nguyễn Văn Khách 1', '0901111111', 'khach1@example.com', 'Tôi muốn thuê phòng đơn, giá cả hợp lý'),
('QT-20250102-EFGH', 'TN0000000001', 'Trần Thị Khách 2', '0902222222', 'khach2@example.com', 'Cần phòng đôi cho 2 người'),
('QT-20250103-IJKL', 'TN0000000002', 'Lê Văn Khách 3', '0903333333', 'khach3@example.com', 'Tìm phòng VIP, có bếp riêng'),
('QT-20250104-MNOP', 'TN0000000002', 'Phạm Thị Khách 4', '0904444444', NULL, 'Cần phòng gần trung tâm'),
('QT-20250105-QRST', 'TN0000000003', 'Hoàng Văn Khách 5', '0905555555', 'khach5@example.com', 'Tìm phòng đơn, giá rẻ')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CẬP NHẬT TRẠNG THÁI PHÒNG SAU KHI TẠO HỢP ĐỒNG
-- ============================================
UPDATE can_ho SET trang_thai = 'da_thue' WHERE id IN (
    'CH0000000001', 'CH0000000002', 'CH0000000005', 'CH0000000007', 'CH0000000009',
    'CH0000000011', 'CH0000000012', 'CH0000000014', 'CH0000000016', 'CH0000000018', 'CH0000000020',
    'CH0000000021', 'CH0000000023', 'CH0000000025', 'CH0000000027', 'CH0000000029',
    'CH0000000051', 'CH0000000053', 'CH0000000055', 'CH0000000057'
);

-- ============================================
-- HOÀN TẤT
-- ============================================
SELECT 'Dữ liệu mẫu đã được tạo thành công!' as status;

