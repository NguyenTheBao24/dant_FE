import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { EmployDashboard } from "@/components/employ/pages/EmployDashboard"
import { getKhachThueByTaiKhoanId } from "@/services/khach-thue.service"
import { listHopDongByKhachThue } from "@/services/hop-dong.service"
import { getInvoiceSummaryForTenant } from "@/services/employ-invoice.service"

export default function EmployIndex() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
    const [userContracts, setUserContracts] = useState([])
    const [invoiceData, setInvoiceData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleUserInfoUpdate = (updatedInfo) => {
        console.log('User info updated:', updatedInfo)
        setUserInfo(updatedInfo)
    }

    useEffect(() => {
        const loadEmployData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Kiểm tra authentication
                const authUser = sessionStorage.getItem('auth_user')
                if (!authUser) {
                    navigate('/auth/login')
                    return
                }

                const userData = JSON.parse(authUser)
                console.log('Employ user data:', userData)

                if (userData.role !== 'khach_thue') {
                    alert('Bạn không có quyền truy cập trang này')
                    navigate('/auth/login')
                    return
                }

                // Tìm thông tin khách thuê từ tài khoản
                const khachThue = await getKhachThueByTaiKhoanId(userData.id)
                console.log('Found khach thue:', khachThue)

                if (!khachThue) {
                    setError('Không tìm thấy thông tin khách thuê')
                    return
                }

                // Tìm các hợp đồng của khách thuê này
                console.log('Loading hop dong for khach_thue_id:', khachThue.id)
                const hopDongList = await listHopDongByKhachThue(khachThue.id)
                console.log('Found hop dong list:', hopDongList)

                // Load thông tin hóa đơn cho hợp đồng hiệu lực đầu tiên
                let invoiceSummary = null
                const activeContract = hopDongList.find(contract => contract.trang_thai === 'hieu_luc')
                if (activeContract) {
                    try {
                        console.log('Loading invoice summary for hop_dong_id:', activeContract.id)
                        invoiceSummary = await getInvoiceSummaryForTenant(activeContract.id)
                        console.log('Found invoice summary:', invoiceSummary)
                    } catch (error) {
                        console.error('Error loading invoice summary for hop_dong_id:', activeContract.id, error)
                        // Không throw error, chỉ log để không làm crash app
                    }
                } else {
                    console.log('No active contract found for khach_thue_id:', khachThue.id)
                }

                setUserInfo(khachThue)
                setUserContracts(hopDongList)
                setInvoiceData(invoiceSummary)

            } catch (error) {
                console.error('Error loading employ data:', error)
                setError('Không thể tải dữ liệu. Vui lòng thử lại.')
            } finally {
                setIsLoading(false)
            }
        }

        loadEmployData()
    }, [navigate])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải thông tin...</h3>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EmployDashboard
                userInfo={userInfo}
                userContracts={userContracts}
                invoiceData={invoiceData}
                onUserInfoUpdate={handleUserInfoUpdate}
            />
        </div>
    )
}
