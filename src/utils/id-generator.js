/**
 * Helper function để generate ID theo format: PREFIX + 10 chữ số (zero-padded)
 * Format: PREFIX0000000001
 * Ví dụ: TN0000000001, QL0000000001, TK0000000001, CH0000000001
 * 
 * @param {string} prefix - Prefix cho ID (ví dụ: 'TN', 'QL', 'TK', 'CH')
 * @param {Array} existingIds - Mảng các ID hiện có (có thể là string hoặc number)
 * @returns {string} ID mới theo format PREFIX0000000001
 */
export function generateFormattedId(prefix, existingIds = []) {
    if (!prefix || typeof prefix !== 'string') {
        throw new Error('Prefix must be a non-empty string')
    }

    // Extract số từ các ID hiện có
    let maxSequence = 0

    if (existingIds && existingIds.length > 0) {
        for (const id of existingIds) {
            if (!id) continue

            // Nếu là string có prefix, extract số
            if (typeof id === 'string' && id.startsWith(prefix)) {
                const sequenceStr = id.slice(prefix.length)
                const sequence = parseInt(sequenceStr, 10)
                if (!isNaN(sequence) && sequence > maxSequence) {
                    maxSequence = sequence
                }
            }
            // Nếu là số hoặc string số, dùng trực tiếp
            else {
                const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id)
                if (!isNaN(numId) && numId > maxSequence) {
                    maxSequence = numId
                }
            }
        }
    }

    // Tăng lên 1 và format 10 chữ số
    const nextSequence = maxSequence + 1
    const sequenceStr = String(nextSequence).padStart(10, '0')

    return `${prefix}${sequenceStr}`
}

/**
 * Extract số từ ID có format PREFIX + số
 * @param {string} id - ID cần extract (ví dụ: 'TN0000000001')
 * @returns {number} Số được extract (ví dụ: 1)
 */
export function extractIdNumber(id) {
    if (!id) return 0
    if (typeof id === 'number') return id

    // Nếu là string, tìm phần số
    const match = id.match(/\d+$/)
    if (match) {
        return parseInt(match[0], 10)
    }

    return parseInt(id, 10) || 0
}

