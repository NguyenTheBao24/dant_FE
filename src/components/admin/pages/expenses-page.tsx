import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { ExpenseDialog } from "@/components/admin/dashboard/dialogs/ExpenseDialog"
import { PriceUpdateDialog } from "@/components/admin/dashboard/dialogs/PriceUpdateDialog"
import {
    listChiTieuByToaNha,
    deleteChiTieu,
    getChiTieuStatsByType
} from "@/services/chi-tieu.service"
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    Calendar,
    Trash2,
    Edit,
    TrendingDown,
    Building2,
    Settings
} from "lucide-react"
// @ts-ignore
import { getExpenseTypeLabel, EXPENSE_TYPE, EXPENSE_TYPE_LABELS } from "@/utils/translations"

interface ExpensesPageProps {
    selectedHostel: any
}

// Lấy danh sách loại chi tiêu từ translations (enum values)
const EXPENSE_TYPE_OPTIONS = [
    EXPENSE_TYPE.DIEN_NUOC,
    EXPENSE_TYPE.BAO_TRI,
    EXPENSE_TYPE.VE_SINH,
    EXPENSE_TYPE.AN_NINH,
    EXPENSE_TYPE.MARKETING,
    EXPENSE_TYPE.THUE,
    EXPENSE_TYPE.BAO_HIEM,
    EXPENSE_TYPE.LUONG_QUAN_LY,
    EXPENSE_TYPE.KHAC,
]

export function ExpensesPage({ selectedHostel }: ExpensesPageProps) {
    const [expenses, setExpenses] = useState<any[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterMonth, setFilterMonth] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    const [stats, setStats] = useState<{
        totalAmount: number
        statsByType: any[]
    }>({
        totalAmount: 0,
        statsByType: []
    })

    // Load expenses data
    const loadExpenses = async () => {
        if (!selectedHostel?.id) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const data = await listChiTieuByToaNha(selectedHostel.id)
            setExpenses(data)
            setFilteredExpenses(data)

            // Calculate stats
            const totalAmount = data.reduce((sum, item) => sum + (item.so_tien || 0), 0)

            // Get current month stats
            const currentDate = new Date()
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

            const statsByType = await getChiTieuStatsByType(
                selectedHostel.id,
                startOfMonth.toISOString().split('T')[0],
                endOfMonth.toISOString().split('T')[0]
            )

            setStats({
                totalAmount,
                statsByType
            })
        } catch (error) {
            console.error('Error loading expenses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadExpenses()
    }, [selectedHostel?.id])

    // Filter expenses
    useEffect(() => {
        let filtered = expenses

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(expense =>
                expense.loai_chi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.mo_ta?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Type filter
        if (filterType !== "all") {
            filtered = filtered.filter(expense => expense.loai_chi === filterType)
        }

        // Month filter
        if (filterMonth !== "all") {
            const [year, month] = filterMonth.split('-')
            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.ngay)
                return expenseDate.getFullYear() === parseInt(year) &&
                    expenseDate.getMonth() === parseInt(month) - 1
            })
        }

        setFilteredExpenses(filtered)
    }, [expenses, searchTerm, filterType, filterMonth])

    const handleDeleteExpense = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
            return
        }

        try {
            await deleteChiTieu(id)
            await loadExpenses()
        } catch (error) {
            console.error('Error deleting expense:', error)
            alert('Có lỗi xảy ra khi xóa chi tiêu')
        }
    }

    const handleEditExpense = (expense: any) => {
        setEditingExpense(expense)
        setIsDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setEditingExpense(null)
    }

    const handleDialogSuccess = () => {
        loadExpenses()
    }

    const getMonthOptions = () => {
        const options = []
        const currentDate = new Date()

        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
            const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            const label = date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })
            options.push({ value, label })
        }

        return options
    }

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn tòa nhà</h3>
                    <p className="text-gray-500">Vui lòng chọn một tòa nhà để xem chi tiêu</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu</h3>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-red-600">
                        Quản lý chi tiêu
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Quản lý chi tiêu cho khu trọ <span className="font-semibold">{selectedHostel.name}</span>
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setIsPriceDialogOpen(true)}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Bảng giá dịch vụ
                    </Button>
                    <Button
                        onClick={() => {
                            console.log('ExpensesPage - Button clicked, selectedHostel:', selectedHostel)
                            if (!selectedHostel) {
                                console.error('ExpensesPage - selectedHostel is null/undefined')
                                alert('Vui lòng chọn tòa nhà trước khi thêm chi tiêu')
                                return
                            }
                            if (!selectedHostel.id && !selectedHostel.toa_nha_id) {
                                console.error('ExpensesPage - selectedHostel.id and toa_nha_id are both missing:', selectedHostel)
                                alert('Vui lòng chọn tòa nhà trước khi thêm chi tiêu')
                                return
                            }
                            console.log('ExpensesPage - Opening dialog with selectedHostel:', selectedHostel)
                            setIsDialogOpen(true)
                        }}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm chi tiêu
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold text-red-700">
                                    {stats.totalAmount.toLocaleString('vi-VN')}₫
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Số giao dịch</p>
                                <p className="text-2xl font-bold text-orange-700">
                                    {expenses.length}
                                </p>
                            </div>
                            <TrendingDown className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Loại chi tiêu</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {stats.statsByType.length}
                                </p>
                            </div>
                            <Filter className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Chi tiêu tháng này</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {stats.statsByType.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('vi-VN')}₫
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Search className="mr-2 h-5 w-5" />
                        Bộ lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
                            <Input
                                placeholder="Tìm theo loại chi hoặc mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Loại chi</label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    {EXPENSE_TYPE_OPTIONS.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {getExpenseTypeLabel(type)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Tháng</label>
                            <Select value={filterMonth} onValueChange={setFilterMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả tháng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả tháng</SelectItem>
                                    {getMonthOptions().map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card>
                <CardContent>
                    {filteredExpenses.length === 0 ? (
                        <div className="text-center py-8">
                            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Không có chi tiêu nào</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead>Loại chi</TableHead>
                                    <TableHead>Số tiền</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                {new Date(expense.ngay).toLocaleDateString('vi-VN')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                {getExpenseTypeLabel(expense.loai_chi)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-red-600">
                                                {expense.so_tien.toLocaleString('vi-VN')}₫
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-gray-600 max-w-xs truncate">
                                                {expense.mo_ta || 'Không có mô tả'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditExpense(expense)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Expense Dialog */}
            <ExpenseDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onSuccess={handleDialogSuccess}
                selectedHostel={selectedHostel}
                expenseData={editingExpense}
                isEdit={!!editingExpense}
            />

            {/* Price Update Dialog */}
            <PriceUpdateDialog
                isOpen={isPriceDialogOpen}
                onClose={() => setIsPriceDialogOpen(false)}
                onSuccess={() => {
                    console.log('Price updated successfully')
                }}
                selectedHostel={selectedHostel}
            />
        </div>
    )
}
