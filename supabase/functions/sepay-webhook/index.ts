// @ts-ignore - Deno types are available at runtime
/// <reference types="https://deno.land/x/types/index.d.ts" />
// @ts-ignore - Deno std library
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - ESM module
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-custom-sepay-key",
};

// Lưu ý: Supabase Edge Functions có thể bypass platform auth bằng cách:
// 1. Authorization: Bearer {ANON_KEY} (chuẩn)
// 2. apikey: {ANON_KEY} header (alternative)
// 3. URL query: ?apikey={ANON_KEY} (không khuyến nghị)

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // SePay tự động gửi: Authorization: Apikey {KEY} (không thể thay đổi format)
    // Supabase platform layer yêu cầu: Authorization: Bearer {ANON_KEY} hoặc apikey header/query
    // Giải pháp: Dùng apikey header hoặc query parameter để bypass platform auth

    const url = new URL(req.url);
    const apikeyFromQuery = url.searchParams.get("apikey");
    const apikeyFromHeader = req.headers.get("apikey");
    const authHeader = req.headers.get("Authorization");
    const customHeader = req.headers.get("x-custom-sepay-key");

    // Lấy API key từ SePay (Authorization: Apikey {KEY})
    let apiKey: string | null = null;

    // Ưu tiên check custom header trước
    if (customHeader && customHeader.startsWith("Apikey ")) {
      apiKey = customHeader.replace("Apikey ", "");
    } else if (authHeader) {
      // SePay tự động gửi: Authorization: Apikey {KEY}
      if (authHeader.startsWith("Apikey ")) {
        apiKey = authHeader.replace("Apikey ", "");
      } else if (authHeader.startsWith("Bearer ")) {
        // Nếu là Bearer token, có thể dùng làm API key nếu SEPAY_API_KEY = anon key
        const bearerToken = authHeader.replace("Bearer ", "");
        // @ts-ignore - Deno is available at runtime
        const expectedApiKey = Deno.env.get("SEPAY_API_KEY");
        if (expectedApiKey && bearerToken === expectedApiKey) {
          apiKey = bearerToken;
        }
      }
    }

    // Nếu chưa có API key từ Authorization, thử lấy từ apikey header hoặc query
    if (!apiKey) {
      // @ts-ignore - Deno is available at runtime
      const expectedApiKey = Deno.env.get("SEPAY_API_KEY");
      // Kiểm tra apikey header hoặc query parameter (để bypass platform auth)
      const apikeyValue = apikeyFromHeader || apikeyFromQuery;
      if (apikeyValue && expectedApiKey && apikeyValue === expectedApiKey) {
        // Nếu apikey header/query = SEPAY_API_KEY, có thể dùng làm API key
        // Nhưng vẫn ưu tiên API key từ Authorization header của SePay
        // Chỉ dùng nếu không có Authorization header
        if (!authHeader) {
          apiKey = apikeyValue;
        }
      }
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized: Missing or invalid API key",
          hint: "SePay needs to send either 'x-custom-sepay-key: Apikey {KEY}' header or 'Authorization: Bearer {ANON_KEY}' if SEPAY_API_KEY is set to anon key",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // @ts-ignore - Deno is available at runtime
    const expectedApiKey = Deno.env.get("SEPAY_API_KEY");

    if (!expectedApiKey || apiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid API key" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const payload = await req.json();
    console.log("Received SePay webhook:", payload);

    // Initialize Supabase client
    // @ts-ignore - Deno is available at runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    // @ts-ignore - Deno is available at runtime
    const supabaseServiceKey =
      // @ts-ignore - Deno is available at runtime
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      // @ts-ignore - Deno is available at runtime
      Deno.env.get("SERVICE_ROLE_KEY");

    // Debug: Log environment variables (không log full key để bảo mật)
    console.log("Environment check:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      url: supabaseUrl,
      serviceKeyPrefix: supabaseServiceKey
        ? supabaseServiceKey.substring(0, 10) + "..."
        : "NOT SET",
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables:", {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      });
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details:
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Please set secrets in Edge Function.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Kiểm tra format của service key (phải bắt đầu bằng "eyJ" hoặc "sb_")
    // Service role key thường bắt đầu bằng "eyJ" (JWT), nhưng có thể có format khác
    const isValidFormat =
      supabaseServiceKey.startsWith("eyJ") ||
      supabaseServiceKey.startsWith("sb_");

    if (!isValidFormat) {
      console.error("Invalid service role key format:", {
        prefix: supabaseServiceKey.substring(0, 20),
        length: supabaseServiceKey.length,
      });
      return new Response(
        JSON.stringify({
          error: "Invalid service role key format",
          details: `SUPABASE_SERVICE_ROLE_KEY should be a valid JWT token (starting with 'eyJ') or Supabase key (starting with 'sb_'). Please check your secret in Edge Function settings. ${supabaseServiceKey}, ${supabaseUrl}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: "public",
      },
    });

    // Test connection với service role key bằng cách query một bảng đơn giản
    console.log("Testing database connection with service role key...");
    const { error: testError } = await supabase
      .from("hoa_don")
      .select("id")
      .limit(1);

    if (testError) {
      console.error("Database connection test failed:", testError);
      return new Response(
        JSON.stringify({
          error: "Database connection error",
          details:
            "Cannot connect to database with service role key. Please verify SUPABASE_SERVICE_ROLE_KEY secret is set correctly.",
          debug: testError.message,
          code: testError.code,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Database connection test successful");

    // Parse invoice identifier từ payload SePay
    // SePay gửi invoice ID trong các field: content, description, hoặc des
    // Format cũ: "HD20250101000001 FT25321859460704 Ma giao dich Trace866229 Trace 866229"
    // Format mới (VPBank): "NHAN TU 1013913921 TRACE 106398 ND MBVCB.11850114728.5327BFTVG2JIB9N6. HD20251123000001.CT tu..."
    // Cần extract invoice ID (format HD + 14 digits = HDYYYYMMDDXXXXXX)
    let invoiceIdentifier: string | null = null;

    // Thử các field khác nhau từ SePay payload
    const content = payload.content || payload.description || payload.des || "";

    if (content) {
      // Extract invoice ID từ content (có thể ở đầu hoặc giữa chuỗi)
      // Format: HD + 14 digits (HDYYYYMMDDXXXXXX), ví dụ: HD20251123000001
      // Có thể có dấu chấm sau mã hóa đơn (HD20251123000001.CT)
      const match = content.match(/HD\d{14}(?:\.\w+)?/);
      if (match) {
        // Lấy phần mã hóa đơn (bỏ phần mở rộng sau dấu chấm nếu có)
        invoiceIdentifier = match[0].split('.')[0];
        console.log("Extracted invoice ID from content:", invoiceIdentifier);
      } else {
        // Fallback: tìm bất kỳ pattern HD + digits nào
        const fallbackMatch = content.match(/HD\d+/);
        if (fallbackMatch) {
          invoiceIdentifier = fallbackMatch[0];
          console.log("Extracted invoice ID (fallback):", invoiceIdentifier);
        } else {
          // Nếu không match format HD..., thử lấy phần đầu tiên
          invoiceIdentifier = content.split(/\s+/)[0].trim();
          console.log("Using first word as invoice ID:", invoiceIdentifier);
        }
      }
    } else if (payload.invoiceId) {
      invoiceIdentifier = String(payload.invoiceId).trim();
      console.log("Using invoiceId from payload:", invoiceIdentifier);
    }

    if (!invoiceIdentifier) {
      return new Response(
        JSON.stringify({
          error: "Invalid payload: Missing invoice identifier",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Tìm hóa đơn bằng id (chuỗi)
    let existingInvoice = null;
    let findError: { message?: string; code?: string } | null = null;

    // Tìm bằng id (chuỗi như "HD012312321")
    console.log("Trying to find invoice by id:", invoiceIdentifier);
    const { data, error } = await supabase
      .from("hoa_don")
      .select("*")
      .eq("id", invoiceIdentifier)
      .maybeSingle(); // Dùng maybeSingle để không throw error nếu không tìm thấy

    if (error) {
      console.error("Error finding by id:", error);
      findError = error as { message?: string; code?: string };
    } else if (data) {
      console.log("Found invoice by id:", data);
      existingInvoice = data;
      findError = null;
    } else {
      console.log("Invoice not found with id:", invoiceIdentifier);
    }

    if (!existingInvoice) {
      console.error("Invoice not found:", invoiceIdentifier, findError);

      // Nếu có lỗi permission, trả về lỗi 500 thay vì 404
      if (
        findError &&
        (findError.message?.includes("permission") ||
          findError.code === "42501")
      ) {
        return new Response(
          JSON.stringify({
            error: "Database permission error",
            identifier: invoiceIdentifier,
            details:
              "Service role key may be missing or invalid. Please check SUPABASE_SERVICE_ROLE_KEY secret.",
            debug: findError.message || "Unknown error",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: "Invoice not found",
          identifier: invoiceIdentifier,
          details: findError?.message || "Invoice not found by id",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const invoiceId = (existingInvoice as any).id;

    // Kiểm tra trạng thái thanh toán từ SePay
    // SePay gửi transferType: "in" (nhận tiền) = thanh toán thành công
    // Hoặc có thể có các field khác: status, result, transactionStatus
    const isPaid =
      payload.transferType === "in" || // SePay: "in" = nhận tiền = thanh toán thành công
      payload.status === "success" ||
      payload.status === "paid" ||
      payload.result === "success" ||
      payload.transactionStatus === "completed";

    if (isPaid) {
      // Cập nhật trạng thái hóa đơn thành đã thanh toán
      const { data, error } = await supabase
        .from("hoa_don")
        .update({ trang_thai: "da_thanh_toan" })
        .eq("id", invoiceId)
        .select()
        .single();

      if (error) {
        console.error("Error updating invoice status:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to update invoice status",
            details: error.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Invoice updated successfully:", data);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Invoice status updated successfully",
          invoiceId: invoiceId,
          invoiceIdentifier: invoiceIdentifier,
          invoice: data || null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Thanh toán chưa thành công hoặc đang xử lý
      console.log("Payment not completed yet:", payload);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment not completed",
          invoiceId: invoiceId,
          invoiceIdentifier: invoiceIdentifier,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: (error as any).message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
