import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Convert HTML content to PDF and download
 */
export async function generatePDFFromHTML(htmlContent: string, filename: string = 'hop-dong-thue-phong.pdf', options: { forEmail?: boolean } = {}): Promise<Blob> {
    // Create a temporary container
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = htmlContent
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '800px'
    tempContainer.style.backgroundColor = 'white'
    document.body.appendChild(tempContainer)

    try {
        // For email: use lower scale and JPEG compression to reduce file size
        // For download: use higher quality
        const scale = options.forEmail ? 1.5 : 2
        const imageFormat = options.forEmail ? 'image/jpeg' : 'image/png'
        const imageQuality = options.forEmail ? 0.75 : 1.0

        // Convert HTML to canvas
        const canvas = await html2canvas(tempContainer, {
            scale: scale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 800,
            height: tempContainer.scrollHeight,
            logging: false // Disable logging for better performance
        })

        // Create PDF
        const imgData = canvas.toDataURL(imageFormat, imageQuality)
        const pdf = new jsPDF('p', 'mm', 'a4')

        const imgWidth = 210 // A4 width in mm
        const pageHeight = 295 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        // Add first page
        pdf.addImage(imgData, imageFormat === 'image/jpeg' ? 'JPEG' : 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, imageFormat === 'image/jpeg' ? 'JPEG' : 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
            heightLeft -= pageHeight
        }

        // Convert to blob
        const pdfBlob = pdf.output('blob')

        return pdfBlob
    } finally {
        // Clean up
        document.body.removeChild(tempContainer)
    }
}

/**
 * Download PDF file
 */
export function downloadPDF(blob: Blob, filename: string = 'hop-dong-thue-phong.pdf') {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Generate PDF from HTML and download
 */
export async function generateAndDownloadPDF(htmlContent: string, filename: string = 'hop-dong-thue-phong.pdf') {
    try {
        const pdfBlob = await generatePDFFromHTML(htmlContent, filename)
        downloadPDF(pdfBlob, filename)
        return pdfBlob
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw error
    }
}

/**
 * Generate PDF and prepare for email sending
 * Uses optimized settings to reduce file size for email
 */
export async function generatePDFForEmail(htmlContent: string, filename: string = 'hop-dong-thue-phong.pdf'): Promise<{ blob: Blob, base64: string }> {
    try {
        // Generate PDF with email-optimized settings (lower quality, smaller size)
        const pdfBlob = await generatePDFFromHTML(htmlContent, filename, { forEmail: true })

        // Log file size for debugging
        const fileSizeKB = (pdfBlob.size / 1024).toFixed(2)
        console.log(`PDF generated for email: ${fileSizeKB} KB`)

        // Convert to base64 for email attachment
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                resolve(result.split(',')[1]) // Remove data:application/pdf;base64, prefix
            }
            reader.onerror = reject
            reader.readAsDataURL(pdfBlob)
        })

        return { blob: pdfBlob, base64 }
    } catch (error) {
        console.error('Error generating PDF for email:', error)
        throw error
    }
}
