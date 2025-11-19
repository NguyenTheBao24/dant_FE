import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EmploySidebar } from "../dashboard/sidebar"
import { OverviewPage } from "./overview-page"
import { ContractsPage } from "./contracts-page"
import { InvoicesPage } from "./invoices-page"
import { ProfilePage } from "./profile-page"
import { NotificationsPage } from "./notifications-page"

interface EmployDashboardProps {
    userInfo: any
    userContracts: any[]
    invoiceData?: any
    onUserInfoUpdate?: (updatedInfo: any) => void
}

export function EmployDashboard({ userInfo, userContracts, invoiceData, onUserInfoUpdate }: EmployDashboardProps) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")

    const handleLogout = () => {
        // Show confirmation
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Clear any stored authentication data
            sessionStorage.removeItem('auth_user')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')

            // Show success message
            alert('Đăng xuất thành công!')

            // Navigate to login page
            navigate('/auth/login')
        }
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewPage userInfo={userInfo} userContracts={userContracts} invoiceData={invoiceData} />
            case "contracts":
                return <ContractsPage userContracts={userContracts} invoiceData={invoiceData} />
            case "invoices":
                return <InvoicesPage invoiceData={invoiceData} userContracts={userContracts} />
            case "notifications":
                return <NotificationsPage userInfo={userInfo} userContracts={userContracts} />
            case "profile":
                return <ProfilePage userInfo={userInfo} onUserInfoUpdate={onUserInfoUpdate} />
            default:
                return <OverviewPage userInfo={userInfo} userContracts={userContracts} invoiceData={invoiceData} />
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <EmploySidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userInfo={userInfo}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    )
}
