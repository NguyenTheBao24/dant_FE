# 🔍 Hướng dẫn Debug Bảng Giá

## ✅ **Đã sửa các vấn đề:**

### 1. **Service Logic:**
- ✅ Sửa `upsertBangGia` để xử lý trường hợp không tìm thấy bảng giá
- ✅ Thêm logging chi tiết để debug
- ✅ Cải thiện error handling

### 2. **Dialog Logic:**
- ✅ Thêm logging khi load và save dữ liệu
- ✅ Cải thiện error messages
- ✅ Thêm thông báo thành công

## 🧪 **Cách kiểm tra:**

### **Bước 1: Mở Developer Console**
1. Mở trang web
2. Nhấn `F12` để mở Developer Tools
3. Chuyển sang tab "Console"

### **Bước 2: Test chức năng**
1. Vào mục "Chi tiêu" trong sidebar
2. Click nút "Bảng giá dịch vụ" (màu xanh)
3. Xem console logs:
   ```
   Loading prices for hostel: [ID]
   Loaded bang gia: [data hoặc null]
   ```

### **Bước 3: Thử cập nhật**
1. Điền giá điện, nước, dịch vụ
2. Click "Cập nhật bảng giá"
3. Xem console logs:
   ```
   Submitting price data: {gia_dien: 3000, gia_nuoc: 15000, gia_dich_vu: 200000}
   Creating new price for toa nha: [ID]
   Price update result: [result]
   ```

## 🚨 **Các lỗi có thể gặp:**

### **1. Lỗi Database:**
```
Error: relation "bang_gia" does not exist
```
**Giải pháp:** Tạo bảng `bang_gia` trong database:
```sql
CREATE TABLE bang_gia (
    id INT4 PRIMARY KEY,
    gia_dien NUMERIC,
    gia_nuoc NUMERIC,
    gia_dich_vu NUMERIC
);
```

### **2. Lỗi Permission:**
```
Error: permission denied for table bang_gia
```
**Giải pháp:** Kiểm tra RLS policies trong Supabase

### **3. Lỗi Network:**
```
Error: Failed to fetch
```
**Giải pháp:** Kiểm tra kết nối internet và Supabase URL

## 🔧 **Debug Commands:**

### **Kiểm tra Supabase connection:**
```javascript
// Trong console
import { supabase } from './src/services/supabase-client.js'
console.log('Supabase client:', supabase)
```

### **Test service trực tiếp:**
```javascript
// Trong console
import { getBangGiaByToaNha, upsertBangGia } from './src/services/bang-gia.service.js'

// Test get
getBangGiaByToaNha(1).then(console.log).catch(console.error)

// Test upsert
upsertBangGia(1, {gia_dien: 3000, gia_nuoc: 15000, gia_dich_vu: 200000})
  .then(console.log)
  .catch(console.error)
```

## 📊 **Expected Console Output:**

### **Khi mở dialog lần đầu:**
```
Loading prices for hostel: 1
No existing price found, will create new
```

### **Khi cập nhật lần đầu:**
```
Submitting price data: {gia_dien: 3000, gia_nuoc: 15000, gia_dich_vu: 200000} for hostel: 1
Creating new price for toa nha: 1
Price update result: {id: 1, gia_dien: 3000, gia_nuoc: 15000, gia_dich_vu: 200000}
```

### **Khi cập nhật lần sau:**
```
Submitting price data: {gia_dien: 3500, gia_nuoc: 18000, gia_dich_vu: 250000} for hostel: 1
Updating existing price: 1
Price update result: {id: 1, gia_dien: 3500, gia_nuoc: 18000, gia_dich_vu: 250000}
```

## 🎯 **Nếu vẫn không hoạt động:**

1. **Kiểm tra database:** Đảm bảo bảng `bang_gia` tồn tại
2. **Kiểm tra permissions:** Đảm bảo user có quyền read/write
3. **Kiểm tra network:** Test kết nối Supabase
4. **Kiểm tra console:** Xem có lỗi JavaScript nào không

## 📞 **Support:**
Nếu vẫn gặp vấn đề, hãy copy toàn bộ console logs và gửi cho tôi!
