# Hướng dẫn thiết lập gửi email

## 1. Cài đặt thư viện

Đã cài đặt các thư viện cần thiết:
- `jspdf`: Tạo file PDF từ HTML
- `html2canvas`: Chuyển đổi HTML thành canvas để tạo PDF

## 2. Thiết lập Resend API

### Bước 1: Tạo tài khoản Resend
1. Truy cập [https://resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí
3. Xác thực email

### Bước 2: Lấy API Key
1. Vào Dashboard → API Keys
2. Tạo API Key mới
3. Copy API Key

### Bước 3: Cấu hình domain
1. Vào Settings → Domains
2. Thêm domain của bạn (ví dụ: yourdomain.com)
3. Cấu hình DNS records theo hướng dẫn
4. Xác thực domain

## 3. Cấu hình Supabase Edge Functions

### Bước 1: Cài đặt Supabase CLI
```bash
npm install -g supabase
```

### Bước 2: Đăng nhập Supabase
```bash
supabase login
```

### Bước 3: Link project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Bước 4: Deploy Edge Functions
```bash
supabase functions deploy send-contract-email
supabase functions deploy send-notification-email
```

### Bước 5: Cấu hình environment variables
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

## 4. Cập nhật code

### Trong file `supabase/functions/send-contract-email/index.ts`:
- Thay `noreply@yourdomain.com` bằng domain đã xác thực của bạn

### Trong file `supabase/functions/send-notification-email/index.ts`:
- Thay `noreply@yourdomain.com` bằng domain đã xác thực của bạn

## 5. Test chức năng

### Test tạo PDF:
1. Vào trang quản lý khách thuê
2. Bấm "Tải PDF" - sẽ tải file PDF về máy

### Test gửi email:
1. Vào trang quản lý khách thuê  
2. Bấm "Gửi Email" - sẽ gửi PDF qua email cho khách thuê

### Test tạo khách mới:
1. Thêm khách thuê mới
2. Sau khi tạo thành công, hệ thống sẽ tự động tạo PDF và gửi email

## 6. Troubleshooting

### Lỗi "RESEND_API_KEY not found":
- Kiểm tra đã set environment variable chưa
- Chạy lại: `supabase secrets set RESEND_API_KEY=your_key`

### Lỗi "Domain not verified":
- Kiểm tra domain đã được xác thực trong Resend chưa
- Cập nhật domain trong Edge Functions

### Lỗi "PDF generation failed":
- Kiểm tra thư viện jsPDF và html2canvas đã cài đặt
- Kiểm tra console để xem lỗi chi tiết

## 7. Tính năng đã implement

✅ **Tạo PDF từ HTML**: Sử dụng jsPDF + html2canvas
✅ **Tải PDF về máy**: Button "Tải PDF" 
✅ **Gửi email với PDF đính kèm**: Button "Gửi Email"
✅ **Tự động gửi email khi tạo khách mới**: Sau khi thêm khách thuê
✅ **Email template đẹp**: HTML template với thông tin hợp đồng
✅ **Error handling**: Xử lý lỗi và thông báo cho user

## 8. Cấu trúc file

```
src/
├── utils/
│   └── pdf.utils.ts          # Tạo PDF từ HTML
├── services/
│   └── email.service.js      # Gửi email qua Supabase Edge Functions
└── components/manager/
    ├── pages/tenants-page.tsx # Button tải PDF và gửi email
    └── dialogs/AddTenantDialog.tsx # Tự động gửi email khi tạo khách mới

supabase/functions/
├── send-contract-email/      # Edge Function gửi email hợp đồng
└── send-notification-email/  # Edge Function gửi email thông báo
```
