# Hướng dẫn Cấu hình SePay Webhook cho Supabase Edge Function

## Vấn đề

SePay gửi webhook với `Authorization: Apikey {KEY}` nhưng Supabase platform layer yêu cầu `Authorization: Bearer {token}` hoặc `apikey` header để bypass authentication. Nếu không có, request sẽ bị chặn với lỗi 401.

## Giải pháp

Cấu hình SePay webhook để gửi **cả 2 headers**:

1. `Authorization: Bearer {SUPABASE_ANON_KEY}` - Để bypass Supabase platform auth
2. `x-custom-sepay-key: Apikey {SEPAY_API_KEY}` - Để xác thực với Edge Function

## Cấu hình trong SePay Dashboard

### Bước 1: Lấy Supabase Anon Key

1. Vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy **anon** key (bắt đầu bằng `eyJ...`)

**Anon Key của bạn:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
```

### Bước 2: Cấu hình Webhook trong SePay

1. Đăng nhập vào **SePay Dashboard**
2. Vào mục **Webhook Settings** hoặc **API Configuration**
3. Thêm/Cập nhật webhook với thông tin sau:

   **Webhook URL:**

   ```
   https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay-webhook
   ```

   **Headers (Quan trọng):**

   SePay có thể hỗ trợ cấu hình headers. Nếu có, thêm 2 headers sau:

   **Header 1:**

   - Name: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ`

   **Header 2:**

   - Name: `x-custom-sepay-key`
   - Value: `Apikey sb_secret_110eoohQR4aS4EdOil8qsw_1U_oVz-U`

   **Content-Type:**

   - Name: `Content-Type`
   - Value: `application/json`

4. Lưu cấu hình

### Bước 3: Nếu SePay không hỗ trợ custom headers

Nếu SePay chỉ hỗ trợ gửi 1 header `Authorization`, bạn có 2 lựa chọn:

#### Lựa chọn 1: Dùng Bearer token và parse API key từ payload (Không khuyến nghị)

Cần sửa Edge Function để đọc API key từ payload thay vì header.

#### Lựa chọn 2: Dùng Supabase anon key làm API key (Khuyến nghị)

1. Set `SEPAY_API_KEY` trong Edge Function secrets = Supabase anon key
2. Cấu hình SePay chỉ gửi:
   - Header: `Authorization: Bearer {SUPABASE_ANON_KEY}`
3. Edge Function sẽ check `Authorization: Bearer` header và so sánh với `SEPAY_API_KEY`

**Cách set:**

```bash
supabase secrets set SEPAY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ
```

## Format Payload từ SePay

SePay gửi payload với format như sau:

```json
{
  "gateway": "MBBank",
  "transactionDate": "2025-11-17 10:21:00",
  "accountNumber": "0570101451408",
  "subAccount": null,
  "code": null,
  "content": "HD20250101000001 FT25321859460704 Ma giao dich Trace866229 Trace 866229",
  "transferType": "in",
  "description": "BankAPINotify HD20250101000001 FT25321859460704 Ma giao dich Trace866229 Trace 866229",
  "transferAmount": 2000,
  "referenceCode": "FT25321182677426",
  "accumulated": -95738,
  "id": 30984978
}
```

Edge Function sẽ:

1. Extract invoice ID từ `content` hoặc `description` (format: `HD20250101000001`)
2. Kiểm tra `transferType === "in"` để xác nhận thanh toán thành công
3. Cập nhật invoice status trong database

## Test Webhook

Sau khi cấu hình, test bằng cách:

```bash
node test-webhook.js
```

Hoặc test với payload thật từ SePay (sau khi set SEPAY_API_KEY = anon key):

```bash
curl -X POST https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay-webhook \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ" \
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

**Lưu ý:** Sau khi set `SEPAY_API_KEY` = anon key, chỉ cần gửi Bearer token, không cần `x-custom-sepay-key` header nữa.

## Troubleshooting

### Lỗi 401: "Auth header is not 'Bearer {token}'"

**Nguyên nhân:** SePay không gửi Bearer token trong header `Authorization`.

**Giải pháp:**

1. Kiểm tra cấu hình webhook trong SePay Dashboard
2. Đảm bảo header `Authorization` có format: `Bearer {SUPABASE_ANON_KEY}`
3. Nếu SePay không hỗ trợ custom headers, dùng Lựa chọn 2 ở trên

### Lỗi 401: "Unauthorized: Missing or invalid API key"

**Nguyên nhân:** SePay không gửi API key trong header `x-custom-sepay-key`.

**Giải pháp:**

1. Kiểm tra header `x-custom-sepay-key` có được gửi không
2. Hoặc dùng Lựa chọn 2: set `SEPAY_API_KEY` = Supabase anon key

### Invoice không được cập nhật

**Nguyên nhân:** Invoice ID không được extract đúng từ payload.

**Giải pháp:**

1. Kiểm tra logs trong Supabase Dashboard → Edge Functions → sepay-webhook → Logs
2. Xem log "Received SePay webhook" để kiểm tra payload
3. Xem log "Trying to find invoice by id" để kiểm tra invoice ID được extract
