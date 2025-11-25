# Hệ Thống Quản Lý Khu Trọ

Hệ thống quản lý khu trọ toàn diện với các tính năng quản lý tòa nhà, khách thuê, hợp đồng, hóa đơn, thanh toán và thông báo. Hệ thống được xây dựng với React, Vite, Supabase và hỗ trợ 3 vai trò: Admin, Quản lý và Khách thuê.

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng Công Khai](#tính-năng-công-khai)
- [Tính Năng Admin](#tính-năng-admin)
- [Tính Năng Quản Lý](#tính-năng-quản-lý)
- [Tính Năng Khách Thuê](#tính-năng-khách-thuê)
- [Tính Năng Đặc Biệt](#tính-năng-đặc-biệt)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)

---

## 🎯 Tổng Quan

Hệ thống quản lý khu trọ là một ứng dụng web hiện đại giúp quản lý toàn bộ hoạt động của khu trọ, từ việc giới thiệu phòng trọ đến công chúng, quản lý khách thuê, hợp đồng, hóa đơn, thanh toán và các thông báo quan trọng.

### Vai Trò Người Dùng

- **Admin**: Quản lý toàn bộ hệ thống, nhiều khu trọ, quản lý quản lý và khách thuê
- **Quản Lý**: Quản lý một hoặc nhiều khu trọ được phân công, quản lý khách thuê, phòng, hóa đơn
- **Khách Thuê**: Xem thông tin hợp đồng, hóa đơn, thanh toán và nhận thông báo

---

## 🌐 Tính Năng Công Khai

### Trang Chủ (Landing Page)

- **Hero Section**: Giới thiệu tổng quan về khu trọ với hình ảnh và thông tin nổi bật
- **Chi Tiết Phòng**: 
  - Hiển thị các loại phòng (phòng đơn, phòng đôi, phòng VIP)
  - Gallery hình ảnh cho từng loại phòng
  - Thông tin giá thuê và tiện ích
- **Tiện Ích (Amenities)**: 
  - Internet tốc độ cao
  - Bãi đỗ xe
  - Dịch vụ vệ sinh
  - An ninh 24/7
  - Hỗ trợ khách hàng
- **Form Liên Hệ**: 
  - Khách hàng có thể gửi yêu cầu tư vấn
  - Chọn loại phòng quan tâm
  - Thông tin liên hệ và tin nhắn

---

## 👨‍💼 Tính Năng Admin

### 1. Dashboard Tổng Quan

- **Thống Kê Tổng Quan**:
  - Tổng số khách thuê
  - Doanh thu tháng hiện tại
  - Chi tiêu tháng hiện tại
  - Tỷ lệ lấp đầy phòng
- **Biểu Đồ Doanh Thu**:
  - Doanh thu theo tháng (biểu đồ đường)
  - Doanh thu theo loại phòng (biểu đồ cột)
  - Bảng doanh thu từng phòng
- **Thông Tin Khu Trọ**: 
  - Hiển thị thông tin chi tiết khu trọ đang chọn
  - Số phòng trống/đã thuê
  - Thống kê hợp đồng

### 2. Quản Lý Khu Trọ

- **Thêm Khu Trọ Mới**:
  - Tên khu trọ
  - Địa chỉ
  - Số điện thoại
  - Mô tả
- **Chỉnh Sửa Khu Trọ**: Cập nhật thông tin khu trọ
- **Xóa Khu Trọ**: Xóa khu trọ khỏi hệ thống
- **Chọn Khu Trọ**: Chuyển đổi giữa các khu trọ để quản lý

### 3. Quản Lý Quản Lý

- **Thêm Quản Lý Mới**:
  - Tạo tài khoản cho quản lý
  - Phân công quản lý cho khu trọ
  - Thông tin cá nhân (tên, SĐT, email)
- **Chỉnh Sửa Quản Lý**: Cập nhật thông tin quản lý
- **Xóa Quản Lý**: Xóa quản lý khỏi hệ thống

### 4. Quản Lý Khách Thuê

- **Xem Danh Sách Khách Thuê**: 
  - Tất cả khách thuê trong hệ thống
  - Lọc theo khu trọ
  - Tìm kiếm theo tên, SĐT, email
- **Thêm Khách Thuê**: 
  - Tạo tài khoản cho khách thuê
  - Thông tin cá nhân (tên, SĐT, email, CCCD)
  - Tạo hợp đồng ngay khi thêm khách thuê
- **Chỉnh Sửa Khách Thuê**: Cập nhật thông tin khách thuê
- **Xóa Khách Thuê**: Xóa khách thuê khỏi hệ thống
- **Xem Chi Tiết**: 
  - Thông tin hợp đồng
  - Lịch sử hóa đơn
  - Thông tin phòng

### 5. Quản Lý Chi Tiêu

- **Xem Danh Sách Chi Tiêu**:
  - Tất cả chi tiêu của khu trọ
  - Lọc theo loại (vệ sinh, bảo trì, điện nước, khác)
  - Lọc theo tháng
  - Tìm kiếm
- **Thêm Chi Tiêu**:
  - Loại chi tiêu
  - Số tiền
  - Mô tả
  - Ngày chi tiêu
- **Chỉnh Sửa Chi Tiêu**: Cập nhật thông tin chi tiêu
- **Xóa Chi Tiêu**: Xóa chi tiêu khỏi hệ thống
- **Thống Kê Chi Tiêu**:
  - Tổng chi tiêu theo tháng
  - Chi tiêu theo loại
  - So sánh các tháng

### 6. Quản Lý Thông Báo

- **Xem Tất Cả Thông Báo**:
  - Thông báo từ tất cả khu trọ
  - Lọc theo loại (hóa đơn, liên hệ, sửa chữa, khiếu nại, khác)
  - Lọc theo trạng thái (chưa đọc, đã đọc)
  - Tìm kiếm
- **Xem Chi Tiết Thông Báo**: 
  - Nội dung đầy đủ
  - Thông tin người gửi/nhận
  - Trạng thái đọc

### 7. Quản Lý Hóa Đơn

- **Xem Danh Sách Hóa Đơn**:
  - Tất cả hóa đơn của khu trọ
  - Lọc theo trạng thái (đã thanh toán, chưa thanh toán)
  - Lọc theo tháng
  - Tìm kiếm
- **Xem Chi Tiết Hóa Đơn**:
  - Thông tin hóa đơn đầy đủ
  - Breakdown các khoản phí (tiền phòng, điện, nước, dịch vụ)
  - Tải PDF hóa đơn

### 8. Cập Nhật Bảng Giá

- **Cập Nhật Giá Điện**: Giá điện theo kWh
- **Cập Nhật Giá Nước**: Giá nước theo m³
- **Áp Dụng Cho Tất Cả Khu Trọ**: Bảng giá chung cho toàn hệ thống

### 9. Reset Hóa Đơn

- **Reset Hóa Đơn Tháng**: Xóa tất cả hóa đơn của một tháng cụ thể
- **Tạo Lại Hóa Đơn**: Tự động tạo lại hóa đơn sau khi reset

### 10. AI Chatbot

- **Hỏi Đáp Thông Minh**:
  - Doanh thu hiện tại và dự báo
  - Chi tiêu theo loại và tháng
  - Hợp đồng sắp hết hạn
  - Tỷ lệ lấp đầy phòng
  - Thống kê khách thuê
  - Đánh giá quản lý
  - Đánh giá tổng quan khu trọ
  - Tìm kiếm khách thuê/phòng cụ thể
  - Đề xuất cải thiện

---

## 🏢 Tính Năng Quản Lý

### 1. Dashboard Tổng Quan

- **Thống Kê Nhanh**:
  - Tổng số khách thuê
  - Số phòng đã thuê
  - Số hợp đồng hoạt động
  - Doanh thu tháng
- **Thông Tin Khu Trọ**: 
  - Tên, địa chỉ khu trọ
  - Số phòng trống/đã thuê
  - Tỷ lệ lấp đầy

### 2. Quản Lý Khách Thuê

- **Xem Danh Sách Khách Thuê**:
  - Tất cả khách thuê trong khu trọ được phân công
  - Tìm kiếm theo tên, SĐT, email
- **Thêm Khách Thuê**:
  - Tạo tài khoản cho khách thuê
  - Thông tin cá nhân
  - Chọn phòng và tạo hợp đồng
  - Gửi email hợp đồng tự động
- **Chỉnh Sửa Khách Thuê**: Cập nhật thông tin khách thuê
- **Xem Chi Tiết**: 
  - Thông tin hợp đồng
  - Lịch sử hóa đơn
  - Thông tin phòng

### 3. Quản Lý Phòng

- **Xem Danh Sách Phòng**:
  - Tất cả phòng trong khu trọ
  - Trạng thái phòng (trống, đã thuê, bảo trì)
  - Loại phòng (đơn, đôi, VIP)
  - Giá thuê
- **Cập Nhật Trạng Thái Phòng**: 
  - Trống → Đã thuê
  - Đã thuê → Trống
  - Bảo trì
- **Cập Nhật Giá Thuê**: Thay đổi giá thuê phòng
- **Xem Chi Tiết Phòng**: 
  - Thông tin phòng
  - Khách thuê hiện tại
  - Lịch sử hợp đồng

### 4. Quản Lý Hóa Đơn

- **Xem Danh Sách Hóa Đơn**:
  - Tất cả hóa đơn của khu trọ
  - Lọc theo trạng thái
  - Lọc theo tháng
  - Tìm kiếm
- **Tạo Hóa Đơn Mới**:
  - Chọn phòng
  - Nhập chỉ số điện/nước mới
  - Tự động tính toán:
    - Tiền điện (dựa trên số kWh)
    - Tiền nước (dựa trên số m³)
    - Tiền phòng
    - Tiền dịch vụ
  - Tổng tiền tự động
- **Xem Chi Tiết Hóa Đơn**:
  - Thông tin đầy đủ
  - Breakdown các khoản phí
  - Tải PDF hóa đơn
- **Cập Nhật Trạng Thái Hóa Đơn**:
  - Đánh dấu đã thanh toán
  - Gửi email xác nhận thanh toán tự động
- **Gửi Thông Báo Đóng Tiền**:
  - Gửi thông báo trong ứng dụng
  - Gửi email nhắc nhở thanh toán

### 5. Quản Lý Thông Báo

- **Xem Danh Sách Thông Báo**:
  - Tất cả thông báo của khu trọ
  - Lọc theo loại
  - Lọc theo trạng thái
  - Tìm kiếm
- **Tạo Thông Báo Mới**:
  - Gửi cho khách thuê cụ thể hoặc tất cả
  - Loại thông báo (hóa đơn, liên hệ, sửa chữa, khiếu nại, khác)
  - Tiêu đề và nội dung
- **Xem Chi Tiết Thông Báo**: 
  - Nội dung đầy đủ
  - Thông tin người nhận
  - Trạng thái đọc

---

## 👤 Tính Năng Khách Thuê

### 1. Dashboard Tổng Quan

- **Thông Tin Cá Nhân**:
  - Tên, SĐT, email
  - CCCD
- **Thống Kê Nhanh**:
  - Số hợp đồng đang hoạt động
  - Số hóa đơn chưa thanh toán
  - Số thông báo chưa đọc
- **Thông Tin Phòng**: 
  - Số phòng đang thuê
  - Giá thuê
  - Địa chỉ khu trọ

### 2. Quản Lý Hợp Đồng

- **Xem Danh Sách Hợp Đồng**:
  - Tất cả hợp đồng của khách thuê
  - Trạng thái hợp đồng (hiệu lực, hết hạn, hủy)
  - Thông tin phòng
- **Xem Chi Tiết Hợp Đồng**:
  - Thông tin đầy đủ hợp đồng
  - Thông tin phòng
  - Ngày bắt đầu/kết thúc
  - Giá thuê
  - Tải PDF hợp đồng

### 3. Quản Lý Hóa Đơn

- **Xem Danh Sách Hóa Đơn**:
  - Tất cả hóa đơn của khách thuê
  - Nhóm theo tháng
  - Trạng thái thanh toán
- **Xem Chi Tiết Hóa Đơn**:
  - Thông tin đầy đủ
  - Breakdown các khoản phí:
    - Tiền phòng
    - Tiền điện (số kWh, giá)
    - Tiền nước (số m³, giá)
    - Tiền dịch vụ
  - Tổng tiền
  - Tải PDF hóa đơn
- **Thanh Toán Hóa Đơn**:
  - Thanh toán qua SePay (QR Code)
  - Theo dõi trạng thái thanh toán realtime
  - Nhận email xác nhận thanh toán tự động

### 4. Quản Lý Thông Báo

- **Xem Danh Sách Thông Báo**:
  - Tất cả thông báo nhận được
  - Lọc theo loại
  - Lọc theo trạng thái (chưa đọc, đã đọc)
- **Xem Chi Tiết Thông Báo**: 
  - Nội dung đầy đủ
  - Đánh dấu đã đọc
- **Gửi Thông Báo Cho Quản Lý**:
  - Gửi yêu cầu sửa chữa
  - Gửi khiếu nại
  - Gửi liên hệ khác

### 5. Quản Lý Hồ Sơ

- **Xem Thông Tin Cá Nhân**:
  - Tên, SĐT, email
  - CCCD
  - Tài khoản đăng nhập
- **Chỉnh Sửa Thông Tin**:
  - Cập nhật SĐT
  - Cập nhật email
  - Cập nhật mật khẩu

---

## ⚡ Tính Năng Đặc Biệt

### 1. AI Chatbot (Admin)

- **Hỏi Đáp Thông Minh**:
  - Doanh thu hiện tại và dự báo
  - Chi tiêu theo loại và tháng
  - Hợp đồng sắp hết hạn
  - Tỷ lệ lấp đầy phòng
  - Thống kê khách thuê
  - Đánh giá quản lý
  - Đánh giá tổng quan khu trọ
  - Tìm kiếm khách thuê/phòng cụ thể
  - Đề xuất cải thiện

### 2. Thanh Toán Online (SePay)

- **Tích Hợp SePay**:
  - Thanh toán qua QR Code
  - Tự động nhận diện thanh toán
  - Cập nhật trạng thái hóa đơn tự động
  - Gửi email xác nhận thanh toán tự động
- **Theo Dõi Realtime**:
  - Polling tự động để kiểm tra trạng thái thanh toán
  - Thông báo khi thanh toán thành công

### 3. Email Notifications

- **Gửi Email Tự Động**:
  - Email hợp đồng khi tạo hợp đồng mới (kèm PDF)
  - Email nhắc nhở thanh toán khi quản lý gửi thông báo
  
- **Tích Hợp Brevo API**: Gửi email qua Brevo (Brevo.com)

### 4. PDF Generation

- **Tạo PDF Hóa Đơn**:
  - Template chuyên nghiệp
  - Bao gồm tất cả thông tin chi tiết
  - Tải xuống hoặc gửi qua email
- **Tạo PDF Hợp Đồng**:
  - Template hợp đồng chuẩn
  - Kèm theo email khi tạo hợp đồng

### 5. Realtime Notifications

- **Thông Báo Realtime**:
  - Cập nhật thông báo mới ngay lập tức
  - Đếm số thông báo chưa đọc
  - Thông báo khi có hóa đơn mới

### 6. Localization

- **Hỗ Trợ Tiếng Việt**:
  - Tất cả enum và trạng thái được dịch sang tiếng Việt
  - Trạng thái phòng, hợp đồng, hóa đơn, thông báo
  - Loại chi tiêu, loại thông báo

---

## 🛠 Công Nghệ Sử Dụng

### Frontend

- **React 19**: Framework UI
- **Vite**: Build tool và dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Radix UI**: Component library
- **Recharts**: Biểu đồ và thống kê
- **React Router**: Routing

### Backend & Database

- **Supabase**: 
  - PostgreSQL database
  - Authentication
  - Realtime subscriptions
  - Edge Functions
  - Storage

### Payment Integration

- **SePay**: Tích hợp thanh toán qua QR Code

### Email Service

- **Brevo**: Gửi email tự động

### PDF Generation

- **jsPDF**: Tạo PDF từ HTML
- **html2canvas**: Chuyển HTML sang canvas

### Utilities

- **Lucide React**: Icons
- **Date-fns**: Xử lý ngày tháng
- **Class Variance Authority**: Component variants

---

## 📱 Responsive Design

Hệ thống được thiết kế responsive, hỗ trợ đầy đủ trên:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

---

## 🔐 Bảo Mật

- **Authentication**: Supabase Auth
- **Authorization**: Role-based access control
- **Data Validation**: Client và server-side validation
- **Secure API**: Supabase RLS (Row Level Security)

---

## 📊 Báo Cáo & Thống Kê

- **Doanh Thu**: 
  - Theo tháng
  - Theo loại phòng
  - Theo từng phòng
- **Chi Tiêu**: 
  - Theo tháng
  - Theo loại
  - So sánh các tháng
- **Khách Thuê**: 
  - Tổng số khách thuê
  - Khách thuê mới theo tháng
  - Tỷ lệ lấp đầy phòng
- **Hợp Đồng**: 
  - Hợp đồng sắp hết hạn
  - Hợp đồng đang hoạt động
  - Lịch sử hợp đồng

---

## 🚀 Tính Năng Tương Lai

- [ ] Quản lý hợp đồng chi tiết hơn (chỉnh sửa, gia hạn)
- [ ] Báo cáo chi tiết và xuất Excel
- [ ] Cài đặt hệ thống
- [ ] Quản lý tài khoản người dùng
- [ ] Lịch sử hoạt động (audit log)
- [ ] Backup và restore dữ liệu
- [ ] Multi-language support (tiếng Anh)
- [ ] Mobile app

---

## 📝 Ghi Chú

- Hệ thống sử dụng Supabase làm backend, đảm bảo tính bảo mật và hiệu suất cao
- Tất cả dữ liệu được lưu trữ trên Supabase PostgreSQL
- Email được gửi qua Brevo API
- Thanh toán được tích hợp với SePay
- Hệ thống hỗ trợ realtime updates cho thông báo

---

## 👥 Đóng Góp

Hệ thống được phát triển và duy trì bởi đội ngũ phát triển. Mọi đóng góp và phản hồi đều được chào đón!

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2025

