/**
 * Script test webhook SePay
 * Chạy: node test-webhook.js
 */

// Cấu hình
// BẮT BUỘC: Phải có query parameter ?apikey={ANON_KEY} để bypass Supabase platform auth
const WEBHOOK_URL =
  "https://mclmmiltihncbrzsfpox.supabase.co/functions/v1/sepay_webhook?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ";
const API_KEY = "sb_secret_110eoohQR4aS4EdOil8qsw_1U_oVz-U"; // Thay bằng API key của bạn (SEPAY_API_KEY)
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbG1taWx0aWhuY2JyenNmcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzAzNTIsImV4cCI6MjA3MzkwNjM1Mn0.rUUa7QVfh4pBbVLayecORR5ye71GTzMyakjwZBm6kMQ"; // Supabase Anon Key để bypass platform auth

const INVOICE_ID = "HD20241201000001";

// Test data - mô phỏng payload từ SePay
const testPayload = {
  des: String(INVOICE_ID), // Description chứa invoice ID
  amount: 1000,
  status: "success", // Có thể là: 'success', 'paid', 'failed'
};

async function testWebhook() {
  try {
    console.log("🚀 Testing SePay Webhook...");
    console.log("📍 URL:", WEBHOOK_URL);
    console.log("📦 Payload:", JSON.stringify(testPayload, null, 2));
    console.log("🔑 API Key:", API_KEY.substring(0, 10) + "...");
    console.log("\n");

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`, // Supabase platform auth (required)
        "x-custom-sepay-key": `Apikey ${API_KEY}`, // Custom SePay API key (sepay_api_key từ .env)
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    const responseData = await response.json();

    console.log("📊 Response Status:", response.status);
    console.log(
      "📋 Response Headers:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("📄 Response Body:", JSON.stringify(responseData, null, 2));
    console.log("\n");

    if (response.ok) {
      if (responseData.success) {
        console.log("✅ SUCCESS: Invoice status updated successfully!");
        if (responseData.invoice) {
          console.log("📝 Invoice:", responseData.invoice);
        }
      } else {
        console.log("⚠️  Payment not completed yet:", responseData.message);
      }
    } else {
      console.error("❌ ERROR:", responseData.error || "Unknown error");
      if (responseData.details) {
        console.error("📝 Details:", responseData.details);
      }
    }
  } catch (error) {
    console.error("❌ Error testing webhook:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Test các trường hợp khác nhau
async function testMultipleScenarios() {
  console.log("=".repeat(60));
  console.log("🧪 TEST CASE 1: Payment Success");
  console.log("=".repeat(60));
  await testWebhook();

  // Đợi 1 giây trước khi test tiếp
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 2: Payment Failed (Missing API Key)");
  console.log("=".repeat(60));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Không có Authorization header
      },
      body: JSON.stringify(testPayload),
    });

    const responseData = await response.json();
    console.log("📊 Response Status:", response.status);
    console.log("📄 Response:", JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 3: Invalid Invoice ID");
  console.log("=".repeat(60));

  try {
    const invalidPayload = {
      des: "invalid", // Không phải số
      amount: 1000,
      status: "success",
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "x-custom-sepay-key": `Apikey ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidPayload),
    });

    const responseData = await response.json();
    console.log("📊 Response Status:", response.status);
    console.log("📄 Response:", JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 4: Payment Not Completed");
  console.log("=".repeat(60));

  try {
    const pendingPayload = {
      des: String(INVOICE_ID),
      amount: 1000,
      status: "pending", // Trạng thái chưa hoàn thành
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "x-custom-sepay-key": `Apikey ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pendingPayload),
    });

    const responseData = await response.json();
    console.log("📊 Response Status:", response.status);
    console.log("📄 Response:", JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Chạy test
// Kiểm tra API_KEY
if (API_KEY === "YOUR_SEPAY_API_KEY") {
  console.error(
    "❌ ERROR: Vui lòng thay YOUR_SEPAY_API_KEY bằng API key thật!"
  );
  console.error("📝 Sửa trong file test-webhook.js dòng 8");
  process.exit(1);
}

// Chạy test đơn giản hoặc test nhiều trường hợp
const testMode = process.argv[2] || "single";

if (testMode === "all") {
  testMultipleScenarios();
} else {
  testWebhook();
}

// Export để có thể import trong file khác
export { testWebhook, testMultipleScenarios };
