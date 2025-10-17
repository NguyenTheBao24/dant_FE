export interface SendContractEmailParams {
    toEmail: string
    tenantName: string
    contractPdfBase64: string
    contractId: string | number
    hostelName: string
    roomNumber: string
}

export interface SendNotificationEmailParams {
    toEmail: string
    tenantName: string
    subject: string
    message: string
}

export function sendContractEmail(params: SendContractEmailParams): Promise<any>
export function sendNotificationEmail(params: SendNotificationEmailParams): Promise<any>
