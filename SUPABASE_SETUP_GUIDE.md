# Hướng dẫn Setup Supabase

## 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Click "New Project"
4. Chọn Organization và nhập thông tin:
   - **Name**: `room-rental-management`
   - **Database Password**: Tạo password mạnh
   - **Region**: Chọn gần nhất (Singapore cho Việt Nam)
5. Click "Create new project"

## 2. Lấy thông tin kết nối

1. Vào **Settings** → **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc của project:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Lưu ý**: Thay `your-project-id` và `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` bằng thông tin thực tế từ Supabase.

## 4. Tạo Database Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy toàn bộ nội dung file `supabase-schema.sql`
3. Paste vào SQL Editor
4. Click **Run** để thực thi

## 5. Kiểm tra Tables

Vào **Table Editor** để xem các tables đã được tạo:
- `managers` - Thông tin quản lý
- `hostels` - Thông tin khu trọ
- `tenants` - Thông tin khách thuê
- `employees` - Thông tin nhân viên
- `notifications` - Thông báo
- `revenue_data` - Dữ liệu doanh thu
- `expense_categories` - Danh mục chi phí

## 6. Restart Development Server

```bash
npm run dev
```

## 7. Kiểm tra kết nối

1. Mở browser và vào `http://localhost:5173`
2. Mở **Developer Tools** → **Console**
3. Kiểm tra có log "Supabase not configured" hay không
4. Nếu không có log này, Supabase đã kết nối thành công

## 8. Test chức năng

1. **Tạo khu trọ mới**: Vào "Quản lý khu trọ" → "Tạo khu trọ"
2. **Xóa khu trọ**: Click "Xóa" trên khu trọ
3. **Cập nhật quản lý**: Vào "Nhân viên liên hệ" → "Cài đặt quản lý"
4. **Quản lý khách thuê**: Thêm/sửa/xóa khách thuê

## Troubleshooting

### Lỗi "Supabase not configured"
- Kiểm tra file `.env.local` có đúng format không
- Restart dev server sau khi thay đổi env variables
- Kiểm tra tên biến có đúng `VITE_` prefix không

### Lỗi kết nối database
- Kiểm tra Project URL có đúng không
- Kiểm tra anon key có đúng không
- Kiểm tra database có đang hoạt động không

### Lỗi permissions
- Kiểm tra Row Level Security policies
- Đảm bảo policies cho phép public access (cho development)

## Cấu trúc Database

### Tables chính:
- **managers**: Quản lý khu trọ
- **hostels**: Khu trọ (có foreign key đến managers)
- **tenants**: Khách thuê (có foreign key đến hostels)
- **employees**: Nhân viên
- **notifications**: Thông báo
- **revenue_data**: Dữ liệu doanh thu theo tháng
- **expense_categories**: Danh mục chi phí

### Views:
- **hostels_view**: Kết hợp hostels và managers data

## Security Notes

⚠️ **Lưu ý bảo mật**: 
- File `.env.local` không được commit vào git
- Trong production, cần cấu hình RLS policies phù hợp
- Không sử dụng anon key cho operations nhạy cảm
