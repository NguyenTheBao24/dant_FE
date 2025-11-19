import { currentYearMonth, toYearMonthFromString } from '@/utils/months.utils'

export function aggregateExpensesByMonth(expenses) {
    const map = {}
        ; (expenses || []).forEach((e) => {
            const ym = toYearMonthFromString(e.ngay)
            const amount = Number(e.so_tien) || 0
            if (ym && ym.length === 7 && amount > 0) map[ym] = (map[ym] || 0) + amount
        })
    return map
}

export function getCurrentMonthExpenses(expenses) {
    const ymNow = currentYearMonth()
    return (expenses || []).reduce((sum, e) => {
        const ym = toYearMonthFromString(e.ngay)
        return ym === ymNow ? sum + (Number(e.so_tien) || 0) : sum
    }, 0)
}

