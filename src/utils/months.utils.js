export function toYearMonth(dateLike) {
    const d = new Date(dateLike)
    if (!isFinite(d.getTime())) return ''
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function toYearMonthFromString(dateStr) {
    const s = String(dateStr || '')
    return s.slice(0, 7)
}

export function monthLabelVi(ym) {
    if (!ym) return ''
    const [y, m] = ym.split('-').map(Number)
    return new Date(y, m - 1, 1).toLocaleDateString('vi-VN', { month: 'short' })
}

export function currentYearMonth() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

