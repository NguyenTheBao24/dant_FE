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
        const { toEmail, tenantName, subject, message } = await req.json()

        // Send email using Resend
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        if (!resendApiKey) {
            throw new Error('RESEND_API_KEY not found')
        }

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'noreply@yourdomain.com', // Replace with your verified domain
                to: [toEmail],
                subject: subject,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thông báo từ khu trọ</h2>
            <p>Kính gửi <strong>${tenantName}</strong>,</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-line;">${message}</p>
            </div>
            <p>Trân trọng,<br>Quản lý khu trọ</p>
          </div>
        `,
            }),
        })

        if (!emailResponse.ok) {
            const errorData = await emailResponse.text()
            throw new Error(`Email sending failed: ${errorData}`)
        }

        const emailResult = await emailResponse.json()

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Notification email sent successfully',
                emailId: emailResult.id
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error sending notification email:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})
