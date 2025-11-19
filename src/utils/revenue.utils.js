import { monthLabelVi } from '@/utils/months.utils'

export function aggregateRevenueByMonth(contracts, clampFuture = true) {
    const map = {}
    const today = new Date()
        ; (contracts || []).forEach((c) => {
            const start = new Date(c.ngay_bat_dau)
            let end = c.ngay_ket_thuc ? new Date(c.ngay_ket_thuc) : new Date()
            if (clampFuture && end > today) end = new Date(today.getFullYear(), today.getMonth(), 1)
            const rent = c.can_ho?.gia_thue || 0
            if (!isFinite(start.getTime()) || !isFinite(end.getTime()) || rent <= 0) return
            const loop = new Date(start.getFullYear(), start.getMonth(), 1)
            const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
            while (loop <= endMonth) {
                const ym = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, '0')}`
                map[ym] = (map[ym] || 0) + rent
                loop.setMonth(loop.getMonth() + 1)
            }
        })
    return map
}

export function buildMonthlyStats(revenueByMonth, expensesByMonth, occupancyRate, fallbackYm) {
    const keys = Array.from(new Set([
        ...Object.keys(revenueByMonth || {}),
        ...Object.keys(expensesByMonth || {})
    ])).sort()
    const effective = keys.length ? keys : [fallbackYm]
    const last12 = effective.slice(-12)
    return last12.map((ym) => {
        const revenue = Math.round(revenueByMonth?.[ym] || 0)
        const expenses = Math.round(expensesByMonth?.[ym] || 0)
        return {
            month: monthLabelVi(ym),
            revenue,
            expenses,
            profit: revenue - expenses,
            occupancy: occupancyRate
        }
    })
}

