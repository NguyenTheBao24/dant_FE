# Cách Fix Lỗi 401 "Auth header is not 'Bearer {token}'"

## Vấn đề

Khi SePay gọi webhook, bạn nhận được lỗi:

```json
{ "code": 401, "message": "Auth header is not 'Bearer {token}'" }
```

Đây là lỗi từ **Supabase platform layer**, không phải từ Edge Function code. Supabase platform layer chặn request trước khi đến Edge Function.

## Nguyên nhân

Supabase Edge Functions **LUÔN** yêu cầu authentication ở platform layer. Không thể disable authentication cho một Edge Function cụ thể.

Supabase platform layer chỉ chấp nhận:

- `Authorization: Bearer {ANON_KEY}` header
- `apikey: {ANON_KEY}` header
- `?apikey={ANON_KEY}` query parameter

SePay tự động gửi `Authorization: Apikey {KEY}` (không phải `Bearer`), nên bị chặn.

## Giải pháp: Dùng Query Parameter

**BẮT BUỘC:** Thêm query parameter `?apikey={ANON_KEY}` vào webhook URL trong SePay.

### Bước 1: Lấy Supabase Anon Key

1. Vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy **anon** key (bắt đầu bằng `eyJ...`)

**Anon Key của bạn:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
```

### Bước 2: Cấu hình SePay Webhook URL

**URL CŨ (SAI - Thiếu query parameter):**

```
https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay_webhook
```

**URL MỚI (ĐÚNG - Có query parameter):**

```
https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay_webhook?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
```

### Bước 3: Set SEPAY_API_KEY = Anon Key

```bash
supabase secrets set SEPAY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
```

### Bước 4: Deploy lại Edge Function

```bash
supabase functions deploy sepay-webhook
```

## Cách hoạt động

1. **Supabase Platform Layer:**

   - Check query parameter `?apikey={ANON_KEY}`
   - Nếu có và đúng → Bypass authentication ✅
   - Request được chuyển đến Edge Function

2. **Edge Function:**
   - Check `Authorization: Apikey {KEY}` từ SePay
   - So sánh với `SEPAY_API_KEY` (đã set = anon key)
   - Nếu khớp → Xác thực SePay thành công ✅
   - Xử lý webhook và cập nhật invoice

## Test

Sau khi cấu hình, test với:

```bash
curl -X POST "https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay_webhook?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ" \
  -H "Authorization: Apikey eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": "MBBank",
    "transactionDate": "2025-11-17 10:46:00",
    "accountNumber": "0570101451408",
    "content": "HD20250101000001 FT25321380809594 Ma giao dich Trace023103 Trace 023103",
    "transferType": "in",
    "description": "BankAPINotify HD20250101000001 FT25321380809594 Ma giao dich Trace023103 Trace 023103",
    "transferAmount": 2000
  }'
```

## Lưu ý quan trọng

- **Query parameter là BẮT BUỘC** để bypass Supabase platform auth
- **Không thể** disable authentication cho Edge Function
- Anon key là public key, nhưng vẫn nên bảo mật
- URL sẽ dài hơn, nhưng đây là cách duy nhất để bypass platform auth

## Nếu vẫn bị lỗi

1. Kiểm tra URL có đúng format không (có `?apikey=...`)
2. Kiểm tra anon key có đúng không
3. Kiểm tra `SEPAY_API_KEY` đã được set chưa
4. Deploy lại Edge Function sau khi set secret
