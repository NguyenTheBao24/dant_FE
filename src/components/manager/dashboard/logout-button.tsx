import { useState } from "react"
import { Button } from "@/components/admin/ui/button"
import { LogOut, Loader2 } from "lucide-react"

interface LogoutButtonProps {
    onLogout: () => void
    isLoading?: boolean
}

export function LogoutButton({ onLogout, isLoading = false }: LogoutButtonProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            // Simulate logout process
            await new Promise(resolve => setTimeout(resolve, 1000))
            onLogout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <Button
            variant="ghost"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
            disabled={isLoggingOut || isLoading}
        >
            {isLoggingOut ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
                <LogOut className="mr-3 h-5 w-5" />
            )}
            <span className="font-semibold">
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </span>
        </Button>
    )
}
