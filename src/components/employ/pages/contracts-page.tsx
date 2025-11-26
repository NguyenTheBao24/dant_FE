import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { FileText, Eye, Calendar, Home, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { ContractViewDialog } from "../dialogs/ContractViewDialog"

interface ContractsPageProps {
    userContracts: any[]
    invoiceData?: any
    userInfo?: any
}

export function ContractsPage({ userContracts, invoiceData, userInfo }: ContractsPageProps) {
    const [showContractDialog, setShowContractDialog] = useState(false)
    const [selectedContract, setSelectedContract] = useState<any>(null)

    const activeContracts = userContracts?.filter(contract => contract.trang_thai === 'hieu_luc') || []
    const expiredContracts = userContracts?.filter(contract => contract.trang_thai === 'het_han') || []

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'hieu_luc':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Hiệu lực
                    </Badge>
                )
            case 'het_han':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                        <XCircle className="h-3 w-3 mr-1" />
                        Hết hạn
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                )
        }
    }

    const handleViewContract = (contract: any) => {
        setSelectedContract(contract)
        setShowContractDialog(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Hợp đồng thuê
                </h2>
                <p className="text-gray-600 mt-1">
                    Quản lý và theo dõi các hợp đồng thuê phòng của bạn
                </p>
            </div>

            {/* Active Contracts */}
            {activeContracts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Hợp đồng đang hiệu lực ({activeContracts.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {activeContracts.map((contract) => (
                            <Card key={contract.id} className="border-green-200 hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center">
                                            <Home className="h-5 w-5 mr-2 text-green-600" />
                                            Phòng {contract.can_ho?.so_can || 'N/A'}
                                        </CardTitle>
                                        {getStatusBadge(contract.trang_thai)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-600">Ngày bắt đầu:</p>
                                            <p className="font-semibold">
                                                {contract.ngay_bat_dau
                                                    ? new Date(contract.ngay_bat_dau).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Ngày kết thúc:</p>
                                            <p className="font-semibold">
                                                {contract.ngay_ket_thuc
                                                    ? new Date(contract.ngay_ket_thuc).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Giá thuê:</p>
                                            <p className="font-semibold text-green-600">
                                                {(contract.can_ho?.gia_thue || 0).toLocaleString('vi-VN')}₫/tháng
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Diện tích:</p>
                                            <p className="font-semibold">
                                                {contract.can_ho?.dien_tich ? `${contract.can_ho.dien_tich}m²` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleViewContract(contract)}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Xem hợp đồng
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Expired Contracts */}
            {expiredContracts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <XCircle className="h-5 w-5 mr-2 text-red-600" />
                        Hợp đồng đã hết hạn ({expiredContracts.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {expiredContracts.map((contract) => (
                            <Card key={contract.id} className="border-red-200 bg-red-50/50 hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center">
                                            <Home className="h-5 w-5 mr-2 text-red-600" />
                                            Phòng {contract.can_ho?.so_can || 'N/A'}
                                        </CardTitle>
                                        {getStatusBadge(contract.trang_thai)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-600">Ngày bắt đầu:</p>
                                            <p className="font-semibold">
                                                {contract.ngay_bat_dau
                                                    ? new Date(contract.ngay_bat_dau).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Ngày kết thúc:</p>
                                            <p className="font-semibold">
                                                {contract.ngay_ket_thuc
                                                    ? new Date(contract.ngay_ket_thuc).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Giá thuê:</p>
                                            <p className="font-semibold text-green-600">
                                                {(contract.can_ho?.gia_thue || 0).toLocaleString('vi-VN')}₫/tháng
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Diện tích:</p>
                                            <p className="font-semibold">
                                                {contract.can_ho?.dien_tich ? `${contract.can_ho.dien_tich}m²` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleViewContract(contract)}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Xem hợp đồng
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* No Contracts */}
            {userContracts?.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có hợp đồng</h3>
                        <p className="text-gray-500">Bạn chưa có hợp đồng thuê phòng nào</p>
                    </CardContent>
                </Card>
            )}

            {/* Contract View Dialog */}
            {selectedContract && (
                <ContractViewDialog
                    isOpen={showContractDialog}
                    onOpenChange={setShowContractDialog}
                    contract={selectedContract}
                    userInfo={userInfo}
                />
            )}
        </div>
    )
}