import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import {
    DollarSign,
    Calendar,
    FileText,
    AlertCircle,
    Receipt
} from "lucide-react"
import { buildContractHtml } from "@/utils/tenant.utils"
import { generateAndDownloadPDF } from "@/utils/pdf.utils"

interface OverviewPageProps {
    userInfo: any
    userContracts: any[]
    invoiceData?: any
}

export function OverviewPage({ userInfo, userContracts, invoiceData }: OverviewPageProps) {

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có thông tin</h3>
                    <p className="text-gray-500">Không thể tải thông tin người dùng</p>
                </div>
            </div>
        )
    }

    const activeContracts = userContracts?.filter(contract => contract.trang_thai === 'hieu_luc') || []
    const expiredContracts = userContracts?.filter(contract => contract.trang_thai === 'het_han') || []
    const totalRent = activeContracts.reduce((sum, contract) => sum + (contract.can_ho?.gia_thue || 0), 0)

    // Tính hợp đồng sắp hết hạn (trong 30 ngày)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringContracts = activeContracts.filter(contract => {
        if (!contract.ngay_ket_thuc) return false
        const endDate = new Date(contract.ngay_ket_thuc)
        return endDate <= thirtyDaysFromNow && endDate >= today
    })

    // Lấy hợp đồng hiệu lực đầu tiên để hiển thị thông tin
    const currentContract = activeContracts[0]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Tổng quan
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Xin chào, <span className="font-semibold">{userInfo.ho_ten}</span>
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Hợp đồng hiệu lực</p>
                                <p className="text-2xl font-bold text-blue-700">{activeContracts.length}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    {activeContracts.length > 0 ? `${activeContracts.length} hợp đồng đang hiệu lực` : 'Chưa có hợp đồng'}
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Tiền thuê/tháng</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {totalRent.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    {activeContracts.length > 0 ? `Từ ${activeContracts.length} hợp đồng` : 'Chưa có hợp đồng'}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-sm transition"
                    onClick={async () => {
                        const html = buildContractHtml({
                            hostelName: currentContract?.toa_nha?.ten_toa || currentContract?.can_ho?.toa_nha?.ten_toa,
                            roomNumber: currentContract?.can_ho?.so_can,
                            tenantName: userInfo?.ho_ten,
                            phone: userInfo?.sdt,
                            email: userInfo?.email,
                            startDate: currentContract?.ngay_bat_dau,
                            rentAmount: currentContract?.can_ho?.gia_thue,
                            contractId: currentContract?.id,
                            managerName: currentContract?.toa_nha?.quan_ly?.ho_ten,
                            managerPhone: currentContract?.toa_nha?.quan_ly?.sdt,
                            managerEmail: currentContract?.toa_nha?.quan_ly?.email
                        })

                        try {
                            await generateAndDownloadPDF(html, `hop-dong-${userInfo?.ho_ten}-${currentContract?.can_ho?.so_can}.pdf`)
                        } catch (error) {
                            console.error('Error generating PDF:', error)
                            alert('Có lỗi khi tạo PDF. Vui lòng thử lại.')
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') (e.currentTarget as any).click()
                    }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Xem hợp đồng</p>
                                <p className="text-xs text-purple-600 mt-1">Nhấn để mở hợp đồng thuê của bạn</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br ${invoiceData?.hasUnpaidInvoice
                    ? 'from-red-50 to-red-100 border-red-200'
                    : 'from-green-50 to-green-100 border-green-200'
                    }`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${invoiceData?.hasUnpaidInvoice
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                    }`}>
                                    {invoiceData?.hasUnpaidInvoice ? 'Chưa thanh toán' : 'Đã thanh toán'}
                                </p>
                                <p className={`text-2xl font-bold ${invoiceData?.hasUnpaidInvoice
                                    ? 'text-red-700'
                                    : 'text-green-700'
                                    }`}>
                                    {invoiceData?.hasUnpaidInvoice
                                        ? (invoiceData.unpaidInvoice?.so_tien || 0).toLocaleString('vi-VN') + '₫'
                                        : 'Đầy đủ'
                                    }
                                </p>
                                <p className={`text-xs ${invoiceData?.hasUnpaidInvoice
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                    } mt-1`}>
                                    {invoiceData?.hasUnpaidInvoice
                                        ? `Hóa đơn ${new Date(invoiceData.unpaidInvoice?.ngay_tao).toLocaleDateString('vi-VN')}`
                                        : 'Không có hóa đơn chưa thanh toán'
                                    }
                                </p>
                            </div>
                            <Receipt className={`h-8 w-8 ${invoiceData?.hasUnpaidInvoice
                                ? 'text-red-600'
                                : 'text-green-600'
                                }`} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current Contracts - Đã comment */}
            {/* <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            Hợp đồng hiệu lực
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeContracts.length === 0 ? (
                            <div className="text-center py-4">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Chưa có hợp đồng hiệu lực</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeContracts.map((contract) => (
                                    <div key={contract.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-green-800">
                                                    Phòng {contract.can_ho?.so_can || 'N/A'}
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    {contract.can_ho?.dien_tich}m² - {contract.can_ho?.gia_thue?.toLocaleString('vi-VN')}₫/tháng
                                                </p>
                                                <p className="text-xs text-green-500">
                                                    {contract.ngay_bat_dau && new Date(contract.ngay_bat_dau).toLocaleDateString('vi-VN')} - {contract.ngay_ket_thuc && new Date(contract.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            {getStatusBadge(contract.trang_thai)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                            Thông báo gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {expiringContracts.length > 0 ? (
                                expiringContracts.map((contract) => (
                                    <div key={contract.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-yellow-800">
                                                Hợp đồng phòng {contract.can_ho?.so_can} sắp hết hạn
                                            </p>
                                            <p className="text-xs text-yellow-600">
                                                Hết hạn: {contract.ngay_ket_thuc && new Date(contract.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Không có thông báo nào</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div> */}

            {/* Thông tin hóa đơn chi tiết */}
            {invoiceData?.hasUnpaidInvoice ? (
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg text-red-800">
                            <Receipt className="h-5 w-5 text-red-600 mr-2" />
                            Hóa đơn chưa thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-red-800">
                                        Hóa đơn tháng {new Date(invoiceData.unpaidInvoice?.ngay_tao).toLocaleDateString('vi-VN')}
                                    </h4>
                                    <p className="text-sm text-red-600">
                                        Ngày tạo: {new Date(invoiceData.unpaidInvoice?.ngay_tao).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-700">
                                        {(invoiceData.unpaidInvoice?.so_tien || 0).toLocaleString('vi-VN')}₫
                                    </p>
                                    <p className="text-sm text-red-600">Tổng tiền</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                    <p className="font-medium text-gray-700">Điện cũ</p>
                                    <p className="text-red-600">{invoiceData.unpaidInvoice?.so_dien_cu || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-700">Điện mới</p>
                                    <p className="text-red-600">{invoiceData.unpaidInvoice?.so_dien_moi || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-700">Nước cũ</p>
                                    <p className="text-red-600">{invoiceData.unpaidInvoice?.so_nuoc_cu || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-700">Nước mới</p>
                                    <p className="text-red-600">{invoiceData.unpaidInvoice?.so_nuoc_moi || 0}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-green-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg text-green-800">
                            <Receipt className="h-5 w-5 text-green-600 mr-2" />
                            Trạng thái thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Receipt className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-green-800 mb-2">Đã thanh toán đầy đủ</h4>
                            <p className="text-green-600">
                                Không có hóa đơn chưa thanh toán. Tình trạng tài khoản của bạn đang tốt!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
