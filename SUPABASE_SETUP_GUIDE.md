# Hướng dẫn Setup Supabase

## 1. Tạo Project Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng nhập/Đăng ký tài khoản
3. Click "New Project"
4. Chọn Organization và nhập thông tin:
   - **Name**: `boarding-house-management`
   - **Database Password**: Tạo password mạnh (lưu lại)
   - **Region**: Chọn gần nhất (Singapore)
5. Click "Create new project"
6. Đợi project được tạo (2-3 phút)

## 2. Lấy API Keys

1. Vào **Settings** → **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Tạo file .env

Tạo file `.env` trong thư mục gốc của project:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Lưu ý**: Thay `your-project-id` và `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` bằng giá trị thực từ Supabase.

## 4. Chạy SQL Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Click "New query"
3. Copy toàn bộ nội dung file `supabase-schema.sql`
4. Paste vào SQL Editor
5. Click "Run" để thực thi

## 5. Kiểm tra Tables

Vào **Table Editor** để kiểm tra các bảng đã được tạo:
- `managers` - Thông tin quản lý
- `hostels` - Thông tin khu trọ
- `tenants` - Thông tin khách thuê
- `employees` - Thông tin nhân viên
- `notifications` - Thông báo
- `revenue_data` - Dữ liệu doanh thu
- `expense_categories` - Danh mục chi phí

## 6. Cài đặt Dependencies

```bash
npm install @supabase/supabase-js
```

## 7. Restart Dev Server

```bash
npm run dev
```

## 8. Kiểm tra Kết nối

1. Mở Developer Console (F12)
2. Vào trang Dashboard
3. Kiểm tra console logs:
   - Nếu thấy "Loading data from Supabase" → Kết nối thành công
   - Nếu thấy "Supabase not configured" → Kiểm tra lại .env

## 9. Troubleshooting

### Lỗi "Failed to resolve import"
- Kiểm tra file `.env` có đúng format không
- Restart dev server sau khi tạo .env

### Lỗi "Invalid API key"
- Kiểm tra lại API key trong .env
- Đảm bảo copy đúng anon key (không phải service role key)

### Lỗi "Table doesn't exist"
- Chạy lại SQL schema
- Kiểm tra tên bảng trong SQL Editor

### Dữ liệu không hiển thị
- Kiểm tra RLS policies
- Kiểm tra dữ liệu mẫu đã được insert chưa

## 10. Cấu trúc Database

```
managers (1) ←→ (n) hostels (1) ←→ (n) tenants
                    ↓
                employees
                    ↓
            notifications, revenue_data, expense_categories
```

## 11. Row Level Security (RLS)

Hiện tại đã enable RLS với policy "allow all" cho tất cả bảng. Trong production, bạn nên:
1. Tạo authentication system
2. Cập nhật policies để chỉ cho phép user đã đăng nhập
3. Thêm user_id vào các bảng để phân quyền

## 12. Backup & Restore

### Backup
```sql
-- Export data
pg_dump -h your-host -U postgres -d postgres > backup.sql
```

### Restore
```sql
-- Import data
psql -h your-host -U postgres -d postgres < backup.sql
```

## 13. Monitoring

- Vào **Logs** để xem API calls
- Vào **Database** → **Logs** để xem SQL queries
- Vào **API** → **Usage** để xem số lượng requests

## 14. Production Deployment

1. Tạo production project riêng
2. Cập nhật environment variables
3. Cập nhật RLS policies
4. Setup monitoring và alerts
5. Backup định kỳ

---

**Lưu ý**: Hướng dẫn này sử dụng Supabase free tier. Nếu cần scale, hãy upgrade lên Pro plan.
