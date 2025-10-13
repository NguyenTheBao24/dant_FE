import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
    message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{message}</p>
            </div>
        </div>
    )
}
