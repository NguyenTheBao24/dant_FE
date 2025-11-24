# Hướng Dẫn Sử Dụng Dữ Liệu Mẫu

## 📋 Tổng Quan

File `sample-data-complete.sql` chứa dữ liệu mẫu hoàn chỉnh để test tất cả các chức năng của hệ thống quản lý nhà trọ.

## 🚀 Cách Sử Dụng

### Bước 1: Truy cập Supabase SQL Editor

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** ở menu bên trái
4. Click **New query**

### Bước 2: Chạy Script

1. Copy toàn bộ nội dung file `sample-data-complete.sql`
2. Paste vào SQL Editor
3. Click **Run** hoặc nhấn `Ctrl/Cmd + Enter`

### Bước 3: Xác Nhận

Sau khi chạy xong, bạn sẽ thấy thông báo:
```
Dữ liệu mẫu đã được tạo thành công!
```

## 📊 Dữ Liệu Được Tạo

### 1. Tài Khoản (8 tài khoản)
- **1 Admin**: `admin` / `admin123`
- **3 Manager**: `manager1`, `manager2`, `manager3` / `manager123`
- **8 Tenant**: `tenant1` đến `tenant8` / `tenant123`

### 2. Tòa Nhà (3 tòa nhà)
- **Tòa nhà A**: 50 phòng, Quản lý 1
- **Tòa nhà B**: 40 phòng, Quản lý 2
- **Tòa nhà C**: 10 phòng (mẫu), Quản lý 3

### 3. Căn Hộ/Phòng (100 phòng)
- **Tòa nhà A**: 50 phòng (25 đã thuê, 25 trống)
- **Tòa nhà B**: 40 phòng (4 đã thuê, 36 trống)
- **Tòa nhà C**: 10 phòng (tất cả trống)
- Các loại: Phòng đơn (25m²), Phòng đôi (35m²), Phòng VIP (45m²)

### 4. Khách Thuê (8 khách thuê)
- Đầy đủ thông tin: Họ tên, SĐT, Email, CCCD
- Mỗi khách thuê có tài khoản riêng

### 5. Hợp Đồng (10 hợp đồng)
- **8 hợp đồng đang hiệu lực**: Từ tháng 1-8/2024 đến 2025
- **2 hợp đồng đã hết hạn**: Năm 2023

### 6. Hóa Đơn (64 hóa đơn)
- **56 hóa đơn đã thanh toán**: 
  - Tháng 1-12/2024 (đầy đủ 12 tháng)
  - Có ngày thanh toán chi tiết (giờ, phút)
  - Đa dạng thời gian thanh toán trong ngày
- **8 hóa đơn chưa thanh toán**: Tháng 1/2025 (hiện tại)
- **Dữ liệu thanh toán phong phú** để test:
  - Lịch sử thanh toán theo tháng
  - Thống kê doanh thu
  - Biểu đồ thanh toán
  - Tìm kiếm và lọc hóa đơn

### 7. Thông Báo (9 thông báo)
- **2 thông báo liên hệ**: Chưa xử lý, Đang xử lý
- **2 thông báo thanh toán**: Chưa xử lý, Đã xử lý
- **2 thông báo sửa chữa**: Chưa xử lý, Đang xử lý
- **2 thông báo phản ánh**: Chưa xử lý, Đã xử lý
- **1 thông báo khác**: Chưa xử lý

### 8. Phản Hồi Thông Báo (6 phản hồi)
- Phản hồi từ khách thuê và quản lý
- Có cuộc hội thoại mẫu

### 9. Chi Tiêu (10 chi tiêu)
- Chi tiêu tháng 1/2025: Điện nước, Bảo trì, Vệ sinh
- Chi tiêu tháng 12/2024: Lịch sử

### 10. Bảng Giá (3 loại phòng)
- Phòng Đơn: 3.500.000đ/tháng
- Phòng Đôi: 5.000.000đ/tháng
- Phòng VIP: 7.500.000đ/tháng

### 11. Quan Tâm (5 bản ghi)
- Thông tin khách hàng quan tâm thuê phòng
- Đã tạo thông báo tự động cho manager

## 🔐 Thông Tin Đăng Nhập

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Quyền**: Toàn quyền hệ thống

### Manager
- **Username**: `manager1`, `manager2`, `manager3`
- **Password**: `manager123`
- **Quyền**: Quản lý tòa nhà được phân công

### Tenant
- **Username**: `tenant1` đến `tenant8`
- **Password**: `tenant123`
- **Quyền**: Xem thông tin cá nhân, hợp đồng, hóa đơn

## 📝 Lưu Ý

1. **Xóa dữ liệu cũ**: Script có phần comment để xóa dữ liệu cũ. Bỏ comment nếu muốn reset hoàn toàn.

2. **Foreign Keys**: Tất cả dữ liệu đã được tạo theo đúng thứ tự để đảm bảo foreign keys hợp lệ.

3. **ID Format**: 
   - Tài khoản: `TK0000000001`
   - Tòa nhà: `TN0000000001`
   - Quản lý: `QL0000000001`
   - Căn hộ: `CH0000000001`
   - Khách thuê: `KT0000000001`
   - Hợp đồng: `HD0000000001`
   - Hóa đơn: `HD-YYYYMM-XXXX`
   - Thông báo: `TBYYYYMMDDXXXXXX`
   - Chi tiêu: `CTYYYYMMDDXXXXXX`

4. **Dates**: Một số ngày được set trong quá khứ để có dữ liệu lịch sử.

## ✅ Kiểm Tra Dữ Liệu

Sau khi chạy script, bạn có thể kiểm tra:

```sql
-- Đếm số lượng records
SELECT 'tai_khoan' as table_name, COUNT(*) as count FROM tai_khoan
UNION ALL
SELECT 'toa_nha', COUNT(*) FROM toa_nha
UNION ALL
SELECT 'can_ho', COUNT(*) FROM can_ho
UNION ALL
SELECT 'khach_thue', COUNT(*) FROM khach_thue
UNION ALL
SELECT 'hop_dong', COUNT(*) FROM hop_dong
UNION ALL
SELECT 'hoa_don', COUNT(*) FROM hoa_don
UNION ALL
SELECT 'thong_bao', COUNT(*) FROM thong_bao
UNION ALL
SELECT 'phan_hoi_thong_bao', COUNT(*) FROM phan_hoi_thong_bao
UNION ALL
SELECT 'chi_tieu', COUNT(*) FROM chi_tieu
UNION ALL
SELECT 'bang_gia', COUNT(*) FROM bang_gia
UNION ALL
SELECT 'quan_tam', COUNT(*) FROM quan_tam;
```

## 🎯 Chức Năng Có Thể Test

Với dữ liệu này, bạn có thể test:

- ✅ Đăng nhập với các role khác nhau
- ✅ Admin: Quản lý tòa nhà, manager, tenant
- ✅ Manager: Quản lý phòng, hợp đồng, hóa đơn, thông báo
- ✅ Tenant: Xem hợp đồng, hóa đơn, thông báo
- ✅ Tạo và xử lý thông báo
- ✅ Nhắn tin giữa manager và tenant
- ✅ **Quản lý hóa đơn và thanh toán**:
  - Xem lịch sử thanh toán đầy đủ (12 tháng)
  - Thanh toán hóa đơn qua QR code SePay
  - Theo dõi trạng thái thanh toán realtime
  - Lọc hóa đơn theo trạng thái (đã thanh toán/chưa thanh toán)
  - Xem chi tiết từng hóa đơn
  - Thống kê doanh thu theo tháng/năm
  - Biểu đồ thanh toán
- ✅ Quản lý chi tiêu
- ✅ Xem thống kê và báo cáo
- ✅ Lọc thông báo theo loại
- ✅ Realtime notifications

