// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        const data = await req.json()
        const { toEmail, tenantName, subject, message } = data

        // Validate required fields
        if (!toEmail || !tenantName) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Missing required fields: toEmail and tenantName are required'
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                }
            )
        }

        const brevoApiKey = Deno.env.get("BREVO_API_KEY")
        if (!brevoApiKey) {
            console.error('BREVO_API_KEY is not set in environment variables')
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Server configuration error: BREVO_API_KEY is not configured. Please set it in Supabase Edge Function secrets.'
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500,
                }
            )
        }

        const fromEmail = Deno.env.get('EMAIL_FROM') || 'noreply@thebao.dev'

        // Prepare email payload
        const emailPayload: any = {
            sender: { email: fromEmail, name: "KTX TheBao" },
            to: [{ email: toEmail, name: tenantName }],
            subject: subject || "Thông báo từ khu trọ",
            htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thông báo từ khu trọ</h2>
          <p>Kính gửi <strong>${tenantName}</strong>,</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-line;">${message}</p>
          </div>
          <p>Trân trọng,<br>Quản lý khu trọ</p>
        </div>
      `,
            textContent: `Kính gửi ${tenantName},\n\n${message}\n\nTrân trọng,\nQuản lý khu trọ`,
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": brevoApiKey,
            },
            body: JSON.stringify(emailPayload),
        })

        let result
        try {
            const responseText = await response.text()
            result = responseText ? JSON.parse(responseText) : {}
        } catch (parseError) {
            console.error("Failed to parse Brevo response:", parseError)
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: `Failed to parse response from Brevo API. Status: ${response.status}` 
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            )
        }

        if (!response.ok) {
            console.error("Brevo API error:", {
                status: response.status,
                statusText: response.statusText,
                result: result
            })
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: `Brevo API failed: ${result.message || result.error || JSON.stringify(result)}` 
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status || 400 }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Notification email sent successfully',
                result
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        )

    } catch (error) {
        console.error('Error sending notification email:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        return new Response(
            JSON.stringify({
                success: false,
                error: errorMessage || 'Unknown error occurred while sending notification email'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})
