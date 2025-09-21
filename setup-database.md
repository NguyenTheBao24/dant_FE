# 🚨 SỬA LỖI SUPABASE - THIẾU CỘT 'note'

## Lỗi hiện tại:
```
PGRST204: Could not find the 'note' column of 'hostels' in the schema cache
```

## ✅ CÁCH SỬA NHANH:

### 1. Truy cập Supabase Dashboard
- Vào: https://supabase.com/dashboard
- Chọn project: `mclmmiltihncbrzsfpox`

### 2. Vào SQL Editor
- Click **SQL Editor** ở sidebar trái
- Click **New query**

### 3. Chạy SQL để thêm cột 'note'
Copy và paste SQL này:

```sql
-- Thêm cột note vào bảng hostels
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS note text NULL;

-- Thêm các cột khác nếu thiếu
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS type text NULL;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS manager_id bigint NULL;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS occupancy integer NULL;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS rooms integer NULL;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS address text NULL;
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS name text NULL;
```

### 4. Click RUN
- Click nút **Run** để thực thi SQL
- Đợi kết quả thành công

### 5. Test lại
- Restart dev server: `npm run dev`
- Thử tạo khu trọ mới

## 🔍 KIỂM TRA:

### Vào Table Editor
- Click **Table Editor** ở sidebar
- Chọn table **hostels**
- Kiểm tra có cột **note** chưa

### Nếu vẫn lỗi:
1. **Kiểm tra RLS Policies**:
   - Vào **Authentication** → **Policies**
   - Đảm bảo có policies cho phép public access

2. **Kiểm tra API Keys**:
   - Vào **Settings** → **API**
   - Đảm bảo anon key đúng

## 📋 SCHEMA ĐẦY ĐỦ (nếu cần tạo lại):

Nếu cần tạo lại toàn bộ schema, copy file `supabase-schema.sql` và chạy trong SQL Editor.

## 🎯 KẾT QUẢ MONG ĐỢI:
- ✅ Tạo khu trọ mới thành công
- ✅ Không còn lỗi PGRST204
- ✅ Dữ liệu được lưu vào Supabase
