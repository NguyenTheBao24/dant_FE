# 📘 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ NHÀ TRỌ

## 🎯 Tổng Quan Hệ Thống

Hệ thống Quản Lý Nhà Trọ là một ứng dụng web hiện đại được xây dựng để quản lý toàn diện các hoạt động của nhà trọ, bao gồm:

- **Quản lý tòa nhà và phòng trọ**
- **Quản lý khách thuê và hợp đồng**
- **Quản lý hóa đơn và thanh toán**
- **Hệ thống thông báo và giao tiếp**
- **Thống kê và báo cáo**

Hệ thống hỗ trợ 3 vai trò người dùng chính:
1. **Admin** - Quản trị viên hệ thống
2. **Manager** - Quản lý tòa nhà
3. **Tenant** - Khách thuê

---

## 🔐 TÀI KHOẢN DEMO

### 👨‍💼 Tài Khoản Admin
**Quyền hạn**: Toàn quyền quản lý hệ thống

| Username | Password | Mô tả |
|----------|----------|-------|
| `admin` | `admin123` | Quản trị viên chính |

### 🏢 Tài Khoản Manager (Quản Lý)
**Quyền hạn**: Quản lý tòa nhà được phân công

| Username | Password | Tòa nhà quản lý |
|----------|----------|-----------------|
| `manager1` | `manager123` | Tòa nhà A (50 phòng) |
| `manager2` | `manager123` | Tòa nhà B (40 phòng) |
| `manager3` | `manager123` | Tòa nhà C (10 phòng) |

### 👤 Tài Khoản Tenant (Khách Thuê)
**Quyền hạn**: Xem thông tin cá nhân, hợp đồng, hóa đơn

| Username | Password | Mô tả |
|----------|----------|-------|
| `tenant1` | `tenant123` | Khách thuê 1 |
| `tenant2` | `tenant123` | Khách thuê 2 |
| `tenant3` | `tenant123` | Khách thuê 3 |
| `tenant4` | `tenant123` | Khách thuê 4 |
| `tenant5` | `tenant123` | Khách thuê 5 |
| `tenant6` | `tenant123` | Khách thuê 6 |
| `tenant7` | `tenant123` | Khách thuê 7 |
| `tenant8` | `tenant123` | Khách thuê 8 |

---

## 🚀 CÁCH TRUY CẬP VÀ ĐĂNG NHẬP

### Bước 1: Truy cập trang web
- Mở trình duyệt và truy cập địa chỉ website
- Hoặc nếu chạy local: `http://localhost:5173`

### Bước 2: Đăng nhập
1. Click vào nút **"Đăng Nhập"** hoặc truy cập trực tiếp `/auth/login`
2. Nhập **Username** và **Password** từ bảng tài khoản demo ở trên
3. Click **"Đăng Nhập"**
4. Hệ thống sẽ tự động điều hướng đến dashboard tương ứng với vai trò

### Bước 3: Khám phá các chức năng
- Sau khi đăng nhập, bạn sẽ thấy menu sidebar bên trái với các chức năng tương ứng với vai trò
- Click vào từng mục để khám phá các tính năng

---

## 📋 HƯỚNG DẪN CHI TIẾT THEO VAI TRÒ

## 👨‍💼 1. ADMIN DASHBOARD

### 1.1. Trang Tổng Quan (Overview)
**Đường dẫn**: `/admin/dashboard` (tab "Overview")

**Chức năng**:
- Xem thống kê tổng quan hệ thống:
  - Tổng số tòa nhà
  - Tổng số phòng
  - Tổng số khách thuê
  - Tỷ lệ lấp đầy (Occupancy Rate)
  - Doanh thu tổng
- Biểu đồ doanh thu theo tháng
- Danh sách tòa nhà với thông tin chi tiết
- Chọn tòa nhà để xem chi tiết

**Cách sử dụng**:
1. Vào tab **"Overview"** (mặc định khi đăng nhập)
2. Xem các thống kê tổng quan ở đầu trang
3. Chọn một tòa nhà từ danh sách để xem chi tiết
4. Xem biểu đồ doanh thu ở phần dưới

### 1.2. Quản Lý Khách Thuê (Customers)
**Đường dẫn**: Tab "Customers"

**Chức năng**:
- Xem danh sách tất cả khách thuê trong hệ thống
- Tìm kiếm khách thuê theo tên, số điện thoại
- Lọc khách thuê theo tòa nhà
- Thêm khách thuê mới
- Chỉnh sửa thông tin khách thuê
- Xóa khách thuê
- Xem chi tiết hợp đồng và hóa đơn của khách thuê

**Cách sử dụng**:
1. Click tab **"Customers"** trong sidebar
2. Chọn tòa nhà từ dropdown (hoặc "Tất cả")
3. Sử dụng ô tìm kiếm để tìm khách thuê
4. Click **"Thêm Khách Thuê"** để thêm mới
5. Click icon **✏️** để chỉnh sửa
6. Click icon **🗑️** để xóa (có xác nhận)

**Lưu ý**: Khi thêm khách thuê, hệ thống sẽ tự động tạo tài khoản đăng nhập cho họ.

### 1.3. Quản Lý Quản Lý (Contact)
**Đường dẫn**: Tab "Contact"

**Chức năng**:
- Xem danh sách tất cả quản lý (Manager) trong hệ thống
- Thêm quản lý mới
- Chỉnh sửa thông tin quản lý
- Xóa quản lý
- Phân công quản lý cho tòa nhà
- Xem tòa nhà mà quản lý đang quản lý

**Cách sử dụng**:
1. Click tab **"Contact"** trong sidebar
2. Xem danh sách quản lý
3. Click **"Thêm Quản Lý"** để tạo mới:
   - Nhập thông tin: Họ tên, SĐT, Email, CCCD
   - Hệ thống tự động tạo tài khoản đăng nhập
4. Click **"Phân Công"** để gán quản lý cho tòa nhà
5. Click icon **✏️** để chỉnh sửa
6. Click icon **🗑️** để xóa

### 1.4. Quản Lý Chi Tiêu (Expenses)
**Đường dẫn**: Tab "Expenses"

**Chức năng**:
- Xem danh sách tất cả chi tiêu
- Thêm chi tiêu mới (Điện nước, Bảo trì, Vệ sinh, Khác)
- Chỉnh sửa chi tiêu
- Xóa chi tiêu
- Lọc chi tiêu theo tháng/năm
- Xem tổng chi tiêu theo từng loại
- Biểu đồ chi tiêu theo loại

**Cách sử dụng**:
1. Click tab **"Expenses"** trong sidebar
2. Chọn tòa nhà từ dropdown
3. Click **"Thêm Chi Tiêu"**:
   - Chọn loại chi tiêu
   - Nhập số tiền
   - Nhập mô tả
   - Chọn ngày
4. Xem biểu đồ phân tích chi tiêu ở phần dưới
5. Sử dụng bộ lọc để xem chi tiêu theo thời gian

### 1.5. Quản Lý Thông Báo (Notifications)
**Đường dẫn**: Tab "Notifications"

**Chức năng**:
- Xem tất cả thông báo trong hệ thống
- Lọc thông báo theo loại:
  - Liên hệ
  - Thanh toán
  - Sửa chữa
  - Phản ánh
  - Khác
- Lọc theo trạng thái:
  - Chưa xử lý
  - Đang xử lý
  - Đã xử lý
- Xem chi tiết thông báo và cuộc hội thoại
- Xem thông báo từ khách thuê quan tâm thuê phòng

**Cách sử dụng**:
1. Click tab **"Notifications"** trong sidebar
2. Chọn tòa nhà từ dropdown
3. Sử dụng bộ lọc để tìm thông báo theo loại/trạng thái
4. Click vào một thông báo để xem chi tiết
5. Xem cuộc hội thoại giữa khách thuê và quản lý (nếu có)

**Lưu ý**: Admin chỉ có thể xem thông báo, không thể trả lời trực tiếp.

### 1.6. Thêm Tòa Nhà (Add Hostel)
**Đường dẫn**: Tab "Add Hostel"

**Chức năng**:
- Tạo tòa nhà mới
- Cấu hình số phòng cho tòa nhà
- Tự động tạo các phòng với mã số
- Phân công quản lý cho tòa nhà

**Cách sử dụng**:
1. Click tab **"Add Hostel"** trong sidebar
2. Điền thông tin tòa nhà:
   - Tên tòa nhà
   - Địa chỉ
   - Số phòng
   - Mô tả (tùy chọn)
3. Chọn quản lý từ dropdown (hoặc để trống)
4. Click **"Tạo Tòa Nhà"**
5. Hệ thống tự động tạo các phòng với mã số (CH001, CH002, ...)

**Lưu ý**: Sau khi tạo tòa nhà, bạn có thể phân công quản lý ở tab "Contact".

### 1.7. Reset Hóa Đơn (Reset Invoices)
**Đường dẫn**: Tab "Reset Invoices"

**Chức năng**:
- Reset tất cả hóa đơn chưa thanh toán về trạng thái ban đầu
- Tạo lại hóa đơn cho tháng hiện tại
- Hữu ích khi test lại chức năng thanh toán

**Cách sử dụng**:
1. Click tab **"Reset Invoices"** trong sidebar
2. Xem thông tin về chức năng reset
3. Click **"Reset"** để thực hiện (có xác nhận)

**⚠️ Cảnh báo**: Chức năng này sẽ xóa tất cả hóa đơn chưa thanh toán. Chỉ dùng khi cần test lại.

---

## 🏢 2. MANAGER DASHBOARD

### 2.1. Trang Tổng Quan (Overview)
**Đường dẫn**: `/manager` (tab "Overview")

**Chức năng**:
- Xem thống kê tòa nhà được phân công:
  - Tổng số phòng
  - Số phòng đã thuê
  - Số phòng trống
  - Tỷ lệ lấp đầy
  - Doanh thu tháng hiện tại
  - Doanh thu năm
- Biểu đồ doanh thu theo tháng
- Danh sách hóa đơn chưa thanh toán
- Thông tin hợp đồng sắp hết hạn

**Cách sử dụng**:
1. Đăng nhập với tài khoản Manager
2. Xem các thống kê ở đầu trang
3. Xem biểu đồ doanh thu
4. Xem danh sách hóa đơn cần xử lý

### 2.2. Quản Lý Khách Thuê (Tenants)
**Đường dẫn**: Tab "Tenants"

**Chức năng**:
- Xem danh sách khách thuê trong tòa nhà được quản lý
- Thêm khách thuê mới
- Chỉnh sửa thông tin khách thuê
- Xóa khách thuê
- Xem chi tiết hợp đồng và hóa đơn của từng khách thuê
- Tìm kiếm khách thuê

**Cách sử dụng**:
1. Click tab **"Tenants"** trong sidebar
2. Click **"Thêm Khách Thuê"**:
   - Nhập thông tin: Họ tên, SĐT, Email, CCCD, Địa chỉ
   - Chọn phòng từ dropdown
   - Nhập số tháng thuê
   - Chọn ngày bắt đầu hợp đồng
   - Hệ thống tự động tạo hợp đồng và hóa đơn
3. Click icon **✏️** để chỉnh sửa
4. Click icon **🗑️** để xóa
5. Click vào tên khách thuê để xem chi tiết hợp đồng và hóa đơn

**Lưu ý**: Khi thêm khách thuê, hệ thống sẽ:
- Tự động tạo tài khoản đăng nhập
- Tạo hợp đồng thuê phòng
- Tạo hóa đơn cho tháng đầu tiên

### 2.3. Quản Lý Phòng (Rooms)
**Đường dẫn**: Tab "Rooms"

**Chức năng**:
- Xem danh sách tất cả phòng trong tòa nhà
- Xem trạng thái phòng (Đã thuê/Trống)
- Xem thông tin chi tiết phòng:
  - Mã phòng
  - Loại phòng (Đơn/Đôi/VIP)
  - Diện tích
  - Giá thuê
  - Khách thuê hiện tại (nếu có)
- Lọc phòng theo trạng thái
- Lọc phòng theo loại

**Cách sử dụng**:
1. Click tab **"Rooms"** trong sidebar
2. Xem danh sách phòng với thông tin chi tiết
3. Sử dụng bộ lọc để tìm phòng:
   - Lọc theo trạng thái (Đã thuê/Trống)
   - Lọc theo loại phòng
4. Click vào phòng để xem thông tin chi tiết

### 2.4. Quản Lý Hóa Đơn (Invoices)
**Đường dẫn**: Tab "Invoices"

**Chức năng**:
- Xem danh sách tất cả hóa đơn
- Lọc hóa đơn theo trạng thái:
  - Đã thanh toán
  - Chưa thanh toán
- Lọc hóa đơn theo tháng/năm
- Tìm kiếm hóa đơn theo tên khách thuê
- Xem chi tiết hóa đơn
- Xuất hóa đơn ra PDF
- Xem mã QR thanh toán (nếu chưa thanh toán)
- Cập nhật trạng thái thanh toán thủ công (nếu cần)

**Cách sử dụng**:
1. Click tab **"Invoices"** trong sidebar
2. Sử dụng bộ lọc để tìm hóa đơn:
   - Chọn trạng thái (Đã thanh toán/Chưa thanh toán)
   - Chọn tháng/năm
   - Tìm kiếm theo tên khách thuê
3. Click vào một hóa đơn để xem chi tiết:
   - Thông tin khách thuê
   - Thông tin phòng
   - Số tiền cần thanh toán
   - Ngày tạo và hạn thanh toán
   - Mã QR thanh toán (nếu chưa thanh toán)
4. Click **"Xuất PDF"** để tải hóa đơn
5. Click **"Đánh dấu đã thanh toán"** để cập nhật trạng thái (nếu cần)

**Lưu ý**: Hệ thống hỗ trợ thanh toán qua QR code SePay. Khi khách thuê quét và thanh toán, trạng thái sẽ tự động cập nhật realtime.

### 2.5. Quản Lý Thông Báo (Notifications)
**Đường dẫn**: Tab "Notifications"

**Chức năng**:
- Xem tất cả thông báo từ khách thuê trong tòa nhà
- Lọc thông báo theo loại:
  - Liên hệ
  - Thanh toán
  - Sửa chữa
  - Phản ánh
  - Khác
- Lọc theo trạng thái:
  - Chưa xử lý
  - Đang xử lý
  - Đã xử lý
- Trả lời thông báo (nhắn tin với khách thuê)
- Cập nhật trạng thái thông báo
- Xem lịch sử hội thoại

**Cách sử dụng**:
1. Click tab **"Notifications"** trong sidebar
2. Sử dụng bộ lọc để tìm thông báo
3. Click vào một thông báo để xem chi tiết
4. Trong dialog chi tiết:
   - Xem nội dung thông báo
   - Xem lịch sử hội thoại (nếu có)
   - Nhập phản hồi vào ô chat
   - Click **"Gửi"** để trả lời
   - Chọn trạng thái và click **"Cập nhật trạng thái"**
5. Thông báo sẽ được gửi realtime đến khách thuê

**Lưu ý**: 
- Thông báo được cập nhật realtime, không cần refresh trang
- Khi có thông báo mới, sẽ có badge số lượng ở icon thông báo

---

## 👤 3. TENANT DASHBOARD (Khách Thuê)

### 3.1. Trang Tổng Quan (Overview)
**Đường dẫn**: `/employ` (tab "Overview")

**Chức năng**:
- Xem thông tin cá nhân
- Xem thông tin hợp đồng hiện tại:
  - Phòng đang thuê
  - Ngày bắt đầu và kết thúc hợp đồng
  - Giá thuê
- Xem thống kê hóa đơn:
  - Tổng số hóa đơn
  - Số hóa đơn đã thanh toán
  - Số hóa đơn chưa thanh toán
  - Tổng số tiền đã thanh toán
- Xem hóa đơn gần đây

**Cách sử dụng**:
1. Đăng nhập với tài khoản Tenant
2. Xem thông tin tổng quan ở đầu trang
3. Xem thông tin hợp đồng ở phần giữa
4. Xem danh sách hóa đơn gần đây ở phần dưới

### 3.2. Quản Lý Hợp Đồng (Contracts)
**Đường dẫn**: Tab "Contracts"

**Chức năng**:
- Xem danh sách tất cả hợp đồng (đang hiệu lực và đã hết hạn)
- Xem chi tiết từng hợp đồng:
  - Thông tin phòng
  - Ngày bắt đầu và kết thúc
  - Giá thuê
  - Số tháng thuê
  - Trạng thái hợp đồng
- Xem hóa đơn liên quan đến hợp đồng
- Tải hợp đồng dạng PDF (nếu có)

**Cách sử dụng**:
1. Click tab **"Contracts"** trong sidebar
2. Xem danh sách hợp đồng:
   - Hợp đồng đang hiệu lực (màu xanh)
   - Hợp đồng đã hết hạn (màu xám)
3. Click vào một hợp đồng để xem chi tiết
4. Xem danh sách hóa đơn liên quan đến hợp đồng
5. Click **"Tải PDF"** để tải hợp đồng (nếu có)

### 3.3. Quản Lý Hóa Đơn (Invoices)
**Đường dẫn**: Tab "Invoices"

**Chức năng**:
- Xem danh sách tất cả hóa đơn
- Lọc hóa đơn theo trạng thái:
  - Đã thanh toán
  - Chưa thanh toán
- Lọc hóa đơn theo tháng/năm
- Xem chi tiết hóa đơn:
  - Thông tin phòng
  - Số tiền cần thanh toán
  - Ngày tạo và hạn thanh toán
  - Trạng thái thanh toán
- Thanh toán hóa đơn qua QR code SePay
- Xem lịch sử thanh toán
- Tải hóa đơn dạng PDF

**Cách sử dụng**:
1. Click tab **"Invoices"** trong sidebar
2. Sử dụng bộ lọc để tìm hóa đơn:
   - Chọn trạng thái
   - Chọn tháng/năm
3. Click vào một hóa đơn để xem chi tiết
4. Nếu hóa đơn chưa thanh toán:
   - Xem mã QR thanh toán
   - Quét QR code bằng app SePay để thanh toán
   - Hệ thống sẽ tự động cập nhật trạng thái khi thanh toán thành công
5. Click **"Tải PDF"** để tải hóa đơn

**Lưu ý**: 
- Thanh toán qua SePay được cập nhật realtime
- Sau khi thanh toán thành công, trạng thái sẽ tự động chuyển sang "Đã thanh toán"
- Có thể xem lịch sử thanh toán chi tiết

### 3.4. Quản Lý Thông Báo (Notifications)
**Đường dẫn**: Tab "Notifications"

**Chức năng**:
- Xem tất cả thông báo đã gửi
- Gửi thông báo mới đến quản lý:
  - Liên hệ
  - Thanh toán
  - Sửa chữa
  - Phản ánh
  - Khác
- Xem phản hồi từ quản lý
- Nhắn tin với quản lý (chat realtime)
- Cập nhật trạng thái thông báo

**Cách sử dụng**:
1. Click tab **"Notifications"** trong sidebar
2. Click **"Gửi Thông Báo Mới"**:
   - Chọn loại thông báo
   - Nhập tiêu đề
   - Nhập nội dung
   - Click **"Gửi"**
3. Xem danh sách thông báo đã gửi
4. Click vào một thông báo để xem chi tiết:
   - Xem nội dung thông báo
   - Xem phản hồi từ quản lý
   - Nhập tin nhắn mới vào ô chat
   - Click **"Gửi"** để trả lời
5. Thông báo sẽ được gửi realtime đến quản lý

**Lưu ý**: 
- Thông báo được cập nhật realtime
- Khi quản lý trả lời, bạn sẽ thấy ngay lập tức
- Có badge số lượng thông báo chưa đọc ở icon thông báo

### 3.5. Thông Tin Cá Nhân (Profile)
**Đường dẫn**: Tab "Profile"

**Chức năng**:
- Xem thông tin cá nhân:
  - Họ tên
  - Số điện thoại
  - Email
  - CCCD
  - Địa chỉ
- Chỉnh sửa thông tin cá nhân
- Cập nhật mật khẩu (nếu cần)

**Cách sử dụng**:
1. Click tab **"Profile"** trong sidebar
2. Xem thông tin hiện tại
3. Click **"Chỉnh Sửa"** để cập nhật:
   - Sửa các trường cần thiết
   - Click **"Lưu"** để lưu thay đổi
4. Click **"Đổi Mật Khẩu"** để thay đổi mật khẩu (nếu cần)

---

## 🌐 4. TRANG CHỦ CÔNG KHAI

**Đường dẫn**: `/` (trang chủ)

**Chức năng**:
- Giới thiệu về nhà trọ
- Xem các loại phòng:
  - Phòng đơn
  - Phòng đôi
  - Phòng VIP
- Xem hình ảnh phòng
- Xem tiện ích (Amenities)
- Điền form liên hệ để quan tâm thuê phòng
- Chọn tòa nhà để xem

**Cách sử dụng**:
1. Truy cập trang chủ (không cần đăng nhập)
2. Xem các phần giới thiệu
3. Click vào từng loại phòng để xem hình ảnh
4. Cuộn xuống để xem tiện ích
5. Điền form liên hệ ở cuối trang:
   - Nhập họ tên, SĐT, Email
   - Chọn tòa nhà
   - Nhập nội dung
   - Click **"Gửi"**
6. Thông tin sẽ được gửi đến quản lý tòa nhà tương ứng

---

## ⚡ 5. TÍNH NĂNG ĐẶC BIỆT

### 5.1. Thanh Toán Qua QR Code SePay
- Khách thuê có thể thanh toán hóa đơn bằng cách quét QR code
- Trạng thái thanh toán được cập nhật realtime
- Không cần refresh trang để thấy trạng thái mới
- Hỗ trợ webhook từ SePay để cập nhật tự động

### 5.2. Thông Báo Realtime
- Tất cả thông báo được cập nhật realtime
- Không cần refresh trang
- Có badge hiển thị số lượng thông báo chưa đọc
- Hỗ trợ chat giữa khách thuê và quản lý

### 5.3. Xuất PDF
- Hợp đồng và hóa đơn có thể xuất ra PDF
- PDF có đầy đủ thông tin và định dạng đẹp
- Có thể tải về và in ra

### 5.4. Thống Kê và Báo Cáo
- Biểu đồ doanh thu theo tháng
- Biểu đồ chi tiêu theo loại
- Thống kê tỷ lệ lấp đầy phòng
- Báo cáo chi tiết về tình hình hoạt động

### 5.5. Tìm Kiếm và Lọc
- Tìm kiếm khách thuê, hóa đơn, thông báo
- Lọc theo nhiều tiêu chí khác nhau
- Hỗ trợ lọc kết hợp nhiều điều kiện

---

## 📱 6. LƯU Ý QUAN TRỌNG

### 6.1. Về Dữ Liệu Demo
- Tất cả dữ liệu trong hệ thống là dữ liệu mẫu để test
- Có thể thêm, sửa, xóa dữ liệu tự do
- Nếu muốn reset dữ liệu, chạy lại script SQL trong thư mục `sql/`

### 6.2. Về Thanh Toán
- Thanh toán qua SePay chỉ hoạt động khi có cấu hình webhook
- Trong môi trường demo, có thể cập nhật trạng thái thủ công
- QR code sẽ hiển thị thông tin thanh toán đầy đủ

### 6.3. Về Thông Báo
- Thông báo được lưu trong database
- Hỗ trợ realtime qua Supabase Realtime
- Cần có kết nối internet để thông báo realtime hoạt động

### 6.4. Về Bảo Mật
- Tất cả mật khẩu trong hệ thống demo là mật khẩu đơn giản
- Trong môi trường production, cần mã hóa mật khẩu
- Session được lưu trong sessionStorage

### 6.5. Về Hiệu Năng
- Hệ thống sử dụng lazy loading cho các component
- Hỗ trợ code splitting để tối ưu tốc độ tải
- Sử dụng caching để tăng hiệu suất

---

## 🎓 7. HƯỚNG DẪN ĐÁNH GIÁ

### 7.1. Các Điểm Cần Kiểm Tra

**Giao Diện và Trải Nghiệm Người Dùng (UI/UX)**:
- ✅ Giao diện hiện đại, dễ sử dụng
- ✅ Responsive trên nhiều thiết bị
- ✅ Navigation rõ ràng, dễ hiểu
- ✅ Loading states và error handling

**Chức Năng Cơ Bản**:
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý tòa nhà và phòng
- ✅ Quản lý khách thuê
- ✅ Quản lý hợp đồng
- ✅ Quản lý hóa đơn
- ✅ Hệ thống thông báo

**Chức Năng Nâng Cao**:
- ✅ Thanh toán qua QR code
- ✅ Thông báo realtime
- ✅ Xuất PDF
- ✅ Thống kê và báo cáo
- ✅ Tìm kiếm và lọc

**Kỹ Thuật**:
- ✅ Code structure và organization
- ✅ Error handling
- ✅ Performance optimization
- ✅ Security practices

### 7.2. Các Tính Năng Nổi Bật
1. **Hệ thống quản lý đầy đủ** cho cả 3 vai trò
2. **Thanh toán tích hợp SePay** với webhook realtime
3. **Thông báo realtime** giữa khách thuê và quản lý
4. **Xuất PDF** cho hợp đồng và hóa đơn
5. **Thống kê và báo cáo** chi tiết
6. **Giao diện hiện đại** với Tailwind CSS và Shadcn UI

---

## 📞 8. HỖ TRỢ

Nếu có bất kỳ câu hỏi hoặc vấn đề nào khi sử dụng hệ thống, vui lòng liên hệ:

- **Email**: [Email liên hệ]
- **GitHub**: [Link repository]

---

## 📝 9. TÓM TẮT NHANH

### Đăng Nhập
- **Admin**: `admin` / `admin123`
- **Manager**: `manager1`, `manager2`, `manager3` / `manager123`
- **Tenant**: `tenant1` đến `tenant8` / `tenant123`

### Các Chức Năng Chính
- **Admin**: Quản lý toàn bộ hệ thống, tòa nhà, quản lý, khách thuê, chi tiêu
- **Manager**: Quản lý tòa nhà được phân công, khách thuê, phòng, hóa đơn, thông báo
- **Tenant**: Xem thông tin cá nhân, hợp đồng, hóa đơn, gửi thông báo

### Tính Năng Đặc Biệt
- Thanh toán qua QR code SePay (realtime)
- Thông báo realtime
- Xuất PDF
- Thống kê và báo cáo

---

**Chúc thầy đánh giá tốt! 🎉**


