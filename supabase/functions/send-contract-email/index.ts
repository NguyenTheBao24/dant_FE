// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
        const { toEmail, tenantName, contractPdfBase64, contractId, hostelName, roomNumber, subject, message } = await req.json()

        // Create Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

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
                subject: subject || `Hợp đồng thuê phòng - ${hostelName} - Phòng ${roomNumber}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Hợp đồng thuê phòng</h2>
            <p>Kính gửi <strong>${tenantName}</strong>,</p>
            <p>${message || `Vui lòng tìm đính kèm hợp đồng thuê phòng của bạn.`}</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Chi tiết hợp đồng:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Khu trọ:</strong> ${hostelName}</li>
                <li><strong>Phòng:</strong> ${roomNumber}</li>
                <li><strong>Mã hợp đồng:</strong> ${contractId}</li>
                <li><strong>Ngày tạo:</strong> ${new Date().toLocaleDateString('vi-VN')}</li>
              </ul>
            </div>
            <p>Trân trọng,<br>Quản lý khu trọ</p>
          </div>
        `,
                attachments: [
                    {
                        filename: `hop-dong-${tenantName}-${roomNumber}.pdf`,
                        content: contractPdfBase64,
                        type: 'application/pdf',
                    },
                ],
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
                message: 'Contract email sent successfully',
                emailId: emailResult.id
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error sending contract email:', error)
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
