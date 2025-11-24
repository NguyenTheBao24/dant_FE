import { useCallback, useMemo, useRef, useState } from "react"
import { Bot, Send, X } from "lucide-react"
import { askAdminChatbot } from "@/services/admin-chatbot.service"

interface AdminChatbotWidgetProps {
    selectedHostel?: any
}

interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    createdAt: number
}

export function AdminChatbotWidget({ selectedHostel }: AdminChatbotWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: "welcome",
            role: "assistant",
            content: "Xin chào! Tôi có thể giúp bạn với doanh thu, chi tiêu, hợp đồng và tình trạng phòng của từng khu trọ.",
            createdAt: Date.now()
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading])

    const appendMessage = useCallback((message: Omit<ChatMessage, "id" | "createdAt">) => {
        setMessages((prev) => [
            ...prev,
            {
                ...message,
                id: `${message.role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                createdAt: Date.now()
            }
        ])
    }, [])

    const handleSend = useCallback(async () => {
        if (!canSend) return
        const text = input.trim()
        setInput("")
        appendMessage({ role: "user", content: text })
        setIsLoading(true)

        try {
            const response = await askAdminChatbot(text, { hostel: selectedHostel })
            appendMessage({
                role: "assistant",
                content: response.answer || "Hiện tôi chưa có câu trả lời phù hợp."
            })
        } catch (error: any) {
            console.error("[AdminChatbotWidget] Error:", error)
            appendMessage({
                role: "assistant",
                content:
                    error?.message ||
                    "Xin lỗi, tôi đang gặp chút sự cố khi truy cập dữ liệu. Vui lòng thử lại sau."
            })
        } finally {
            setIsLoading(false)
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth"
                })
            }, 100)
        }
    }, [appendMessage, canSend, input, selectedHostel])

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                handleSend()
            }
        },
        [handleSend]
    )

    return (
        <>
            <button
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:bg-blue-700"
                onClick={() => setIsOpen(true)}
                aria-label="Mở trợ lý AI"
            >
                <Bot className="h-6 w-6" />
            </button>

            <div
                className={`fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
                    }`}
            >
                <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Trợ lý AI quản trị</p>
                        <p className="text-xs text-gray-500">
                            {selectedHostel?.ten_toa || selectedHostel?.name || "Chưa chọn khu trọ"}
                        </p>
                    </div>
                    <button
                        aria-label="Đóng chatbot"
                        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div className="flex h-96 flex-col">
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {message.content.split("\n").map((line, index) => (
                                        <p key={index} className="whitespace-pre-line">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
                                <span>Đang xử lý...</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Đặt câu hỏi cho khu trọ..."
                                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!canSend}
                                className="rounded-xl bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                aria-label="Gửi câu hỏi"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Gợi ý: “Doanh thu tháng này?”, “Bao nhiêu hợp đồng sắp hết hạn?”, “Tỷ lệ phòng trống?”
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

