# Hướng dẫn Bypass Supabase Platform Auth cho SePay Webhook

## Vấn đề

SePay tự động gửi `Authorization: Apikey {KEY}` và bạn **KHÔNG THỂ** thay đổi format header này. Nhưng Supabase platform layer yêu cầu `Authorization: Bearer {token}` hoặc `apikey` header để bypass authentication.

## Giải pháp: Dùng `apikey` Header hoặc Query Parameter

Supabase Edge Functions có thể bypass platform auth bằng cách:

1. `Authorization: Bearer {ANON_KEY}` (chuẩn)
2. `apikey: {ANON_KEY}` header (alternative)
3. URL query: `?apikey={ANON_KEY}` (nếu không thể set header)

## Cách 1: Cấu hình SePay gửi `apikey` Header (Nếu SePay hỗ trợ)

1. **Set `SEPAY_API_KEY` = Supabase anon key:**

   ```bash
   supabase secrets set SEPAY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
   ```

2. **Cấu hình SePay webhook:**

   - **Webhook URL:**

     ```
     https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay-webhook
     ```

   - **Header 1 (Để bypass Supabase platform auth):**

     - Name: `apikey`
     - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ`

   - **Header 2 (SePay tự động gửi - không cần cấu hình):**
     - Name: `Authorization`
     - Value: `Apikey {SEPAY_API_KEY}` (SePay sẽ tự động gửi)

3. **Deploy lại function:**
   ```bash
   supabase functions deploy sepay-webhook
   ```

## Cách 2: Dùng Query Parameter (Nếu SePay không hỗ trợ `apikey` header)

Nếu SePay không cho phép set header `apikey`, có thể dùng query parameter trong URL:

1. **Set `SEPAY_API_KEY` = Supabase anon key:**

   ```bash
   supabase secrets set SEPAY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
   ```

2. **Cấu hình SePay webhook URL với query parameter:**

   ```
   https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay-webhook?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
   ```

   **Lưu ý:** SePay sẽ tự động gửi `Authorization: Apikey {KEY}` (không cần cấu hình)

3. **Deploy lại function:**
   ```bash
   supabase functions deploy sepay-webhook
   ```

## Cách hoạt động

1. **Platform Layer (Supabase):**

   - Check `apikey` header hoặc query parameter
   - Nếu có và đúng → Bypass authentication ✅
   - Request được chuyển đến Edge Function

2. **Edge Function:**
   - Check `Authorization: Apikey {KEY}` từ SePay
   - So sánh với `SEPAY_API_KEY` (đã set = anon key)
   - Nếu khớp → Xác thực SePay thành công ✅
   - Xử lý webhook và cập nhật invoice

## Test

Sau khi cấu hình, test với payload từ SePay:

```bash
curl -X POST "https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay-webhook?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ" \
  -H "Authorization: Apikey eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": "MBBank",
    "transactionDate": "2025-11-17 10:21:00",
    "accountNumber": "0570101451408",
    "content": "HD20250101000001 FT25321859460704",
    "transferType": "in",
    "transferAmount": 2000
  }'
```

## Lưu ý

- **Query parameter ít an toàn hơn** header vì key sẽ hiển thị trong URL logs
- **Nên dùng `apikey` header** nếu SePay hỗ trợ
- Anon key là public key, nhưng vẫn nên bảo mật
