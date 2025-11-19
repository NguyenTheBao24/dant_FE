// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
declare const Deno: any

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const data = await req.json();

        const brevoApiKey = Deno.env.get("BREVO_API_KEY");
        if (!brevoApiKey) throw new Error("Missing BREVO_API_KEY");

        const fromEmail = Deno.env.get('EMAIL_FROM') || 'noreply@thebao.dev'

        // Prepare email payload
        const emailPayload: any = {
            sender: { email: fromEmail, name: "KTX TheBao" },
            to: [{ email: data.toEmail, name: data.tenantName }],
            subject: data.subject || "Hợp đồng thuê phòng",
            htmlContent: `
        <p>Xin chào ${data.tenantName},</p>
        <p>${data.message}</p>
        <p>Vui lòng xem file đính kèm để xem chi tiết hợp đồng.</p>
        <p>Trân trọng,<br>KTX TheBao</p>
      `,
            textContent: `Xin chào ${data.tenantName},\n\n${data.message}\n\nVui lòng xem file đính kèm để xem chi tiết hợp đồng.\n\nTrân trọng,\nKTX TheBao`,
        };

        // Add PDF attachment if provided
        if (data.contractPdfBase64) {
            const filename = `hop-dong-${data.contractId || 'contract'}.pdf`
            emailPayload.attachment = [
                {
                    name: filename,
                    content: data.contractPdfBase64
                }
            ]

            // Log attachment size for debugging
            const attachmentSizeKB = (data.contractPdfBase64.length * 3 / 4 / 1024).toFixed(2)
            console.log(`Attaching PDF: ${filename}, size: ${attachmentSizeKB} KB`)
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": brevoApiKey,
            },
            body: JSON.stringify(emailPayload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Brevo error:", result);
            return new Response(
                JSON.stringify({ success: false, error: `Brevo failed: ${JSON.stringify(result)}` }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
            );
        }

        return new Response(JSON.stringify({ success: true, result }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
