/**
 * Utility functions để convert các enum/constant từ Supabase sang tiếng Việt
 * Thay vì export thẳng enum từ Supabase, chúng ta convert sang tiếng Việt để dễ sử dụng
 */

// ============================================
// TRẠNG THÁI THÔNG BÁO
// ============================================
export const NOTIFICATION_STATUS = {
    CHUA_XU_LY: 'chua_xu_ly',
    DANG_XU_LY: 'dang_xu_ly',
    DA_XU_LY: 'da_xu_ly',
}

export const NOTIFICATION_STATUS_LABELS = {
    [NOTIFICATION_STATUS.CHUA_XU_LY]: 'Chưa xử lý',
    [NOTIFICATION_STATUS.DANG_XU_LY]: 'Đang xử lý',
    [NOTIFICATION_STATUS.DA_XU_LY]: 'Đã xử lý',
}

export const NOTIFICATION_STATUS_COLORS = {
    [NOTIFICATION_STATUS.CHUA_XU_LY]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [NOTIFICATION_STATUS.DANG_XU_LY]: 'bg-blue-100 text-blue-800 border-blue-200',
    [NOTIFICATION_STATUS.DA_XU_LY]: 'bg-green-100 text-green-800 border-green-200',
}

/**
 * Convert trạng thái thông báo sang tiếng Việt
 */
export function getNotificationStatusLabel(status) {
    return NOTIFICATION_STATUS_LABELS[status] || status
}

/**
 * Lấy màu cho badge trạng thái thông báo
 */
export function getNotificationStatusColor(status) {
    return NOTIFICATION_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// ============================================
// LOẠI THÔNG BÁO
// ============================================
export const NOTIFICATION_TYPE = {
    LIEN_HE: 'lien_he',
    THANH_TOAN: 'thanh_toan',
    SUA_CHUA: 'sua_chua',
    PHAN_ANH: 'phan_anh',
    KHAC: 'khac',
}

export const NOTIFICATION_TYPE_LABELS = {
    [NOTIFICATION_TYPE.LIEN_HE]: 'Liên hệ',
    [NOTIFICATION_TYPE.THANH_TOAN]: 'Thanh toán',
    [NOTIFICATION_TYPE.SUA_CHUA]: 'Sửa chữa',
    [NOTIFICATION_TYPE.PHAN_ANH]: 'Phản ánh',
    [NOTIFICATION_TYPE.KHAC]: 'Khác',
}

/**
 * Convert loại thông báo sang tiếng Việt
 */
export function getNotificationTypeLabel(type) {
    return NOTIFICATION_TYPE_LABELS[type] || type || 'Khác'
}

// ============================================
// TRẠNG THÁI PHÒNG
// ============================================
export const ROOM_STATUS = {
    DA_THUE: 'da_thue',
    OCCUPIED: 'occupied', // Alias cho da_thue
    TRONG: 'trong',
    AVAILABLE: 'available', // Alias cho trong
    SUA_CHUA: 'sua_chua',
    MAINTENANCE: 'maintenance', // Alias cho sua_chua
}

export const ROOM_STATUS_LABELS = {
    [ROOM_STATUS.DA_THUE]: 'Đã thuê',
    [ROOM_STATUS.OCCUPIED]: 'Đã thuê',
    [ROOM_STATUS.TRONG]: 'Trống',
    [ROOM_STATUS.AVAILABLE]: 'Trống',
    [ROOM_STATUS.SUA_CHUA]: 'Sửa chữa',
    [ROOM_STATUS.MAINTENANCE]: 'Sửa chữa',
}

export const ROOM_STATUS_COLORS = {
    [ROOM_STATUS.DA_THUE]: 'bg-red-100 text-red-800',
    [ROOM_STATUS.OCCUPIED]: 'bg-red-100 text-red-800',
    [ROOM_STATUS.TRONG]: 'bg-green-100 text-green-800',
    [ROOM_STATUS.AVAILABLE]: 'bg-green-100 text-green-800',
    [ROOM_STATUS.SUA_CHUA]: 'bg-yellow-100 text-yellow-800',
    [ROOM_STATUS.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
}

/**
 * Convert trạng thái phòng sang tiếng Việt
 */
export function getRoomStatusLabel(status) {
    return ROOM_STATUS_LABELS[status] || status
}

/**
 * Lấy màu cho badge trạng thái phòng
 */
export function getRoomStatusColor(status) {
    return ROOM_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

// ============================================
// TRẠNG THÁI HỢP ĐỒNG
// ============================================
export const CONTRACT_STATUS = {
    HIEU_LUC: 'hieu_luc',
    HET_HAN: 'het_han',
    HUY: 'huy',
}

export const CONTRACT_STATUS_LABELS = {
    [CONTRACT_STATUS.HIEU_LUC]: 'Hiệu lực',
    [CONTRACT_STATUS.HET_HAN]: 'Hết hạn',
    [CONTRACT_STATUS.HUY]: 'Đã hủy',
}

export const CONTRACT_STATUS_COLORS = {
    [CONTRACT_STATUS.HIEU_LUC]: 'bg-green-100 text-green-800 border-green-200',
    [CONTRACT_STATUS.HET_HAN]: 'bg-red-100 text-red-800 border-red-200',
    [CONTRACT_STATUS.HUY]: 'bg-gray-100 text-gray-800 border-gray-200',
}

/**
 * Convert trạng thái hợp đồng sang tiếng Việt
 */
export function getContractStatusLabel(status) {
    return CONTRACT_STATUS_LABELS[status] || status
}

/**
 * Lấy màu cho badge trạng thái hợp đồng
 */
export function getContractStatusColor(status) {
    return CONTRACT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// ============================================
// TRẠNG THÁI THANH TOÁN (HÓA ĐƠN)
// ============================================
export const PAYMENT_STATUS = {
    CHUA_TT: 'chua_tt',
    CHUA_THANH_TOAN: 'chua_thanh_toan',
    DA_THANH_TOAN: 'da_thanh_toan',
    QUA_HAN: 'qua_han',
}

export const PAYMENT_STATUS_LABELS = {
    [PAYMENT_STATUS.CHUA_TT]: 'Chưa thanh toán',
    [PAYMENT_STATUS.CHUA_THANH_TOAN]: 'Chưa thanh toán',
    [PAYMENT_STATUS.DA_THANH_TOAN]: 'Đã thanh toán',
    [PAYMENT_STATUS.QUA_HAN]: 'Quá hạn',
}

export const PAYMENT_STATUS_COLORS = {
    [PAYMENT_STATUS.CHUA_TT]: 'bg-yellow-100 text-yellow-800',
    [PAYMENT_STATUS.CHUA_THANH_TOAN]: 'bg-yellow-100 text-yellow-800',
    [PAYMENT_STATUS.DA_THANH_TOAN]: 'bg-green-100 text-green-800',
    [PAYMENT_STATUS.QUA_HAN]: 'bg-red-100 text-red-800',
}

/**
 * Convert trạng thái thanh toán sang tiếng Việt
 */
export function getPaymentStatusLabel(status) {
    return PAYMENT_STATUS_LABELS[status] || status
}

/**
 * Lấy màu cho badge trạng thái thanh toán
 */
export function getPaymentStatusColor(status) {
    return PAYMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

// ============================================
// LOẠI CHI TIÊU
// ============================================
export const EXPENSE_TYPE = {
    DIEN_NUOC: 'dien_nuoc',
    BAO_TRI: 'bao_tri',
    VE_SINH: 've_sinh',
    AN_NINH: 'an_ninh',
    MARKETING: 'marketing',
    THUE: 'thue',
    BAO_HIEM: 'bao_hiem',
    LUONG_QUAN_LY: 'luong_quan_ly',
    KHAC: 'khac',
}

export const EXPENSE_TYPE_LABELS = {
    [EXPENSE_TYPE.DIEN_NUOC]: 'Điện nước',
    [EXPENSE_TYPE.BAO_TRI]: 'Bảo trì',
    [EXPENSE_TYPE.VE_SINH]: 'Vệ sinh',
    [EXPENSE_TYPE.AN_NINH]: 'An ninh',
    [EXPENSE_TYPE.MARKETING]: 'Marketing',
    [EXPENSE_TYPE.THUE]: 'Thuế',
    [EXPENSE_TYPE.BAO_HIEM]: 'Bảo hiểm',
    [EXPENSE_TYPE.LUONG_QUAN_LY]: 'Lương quản lý',
    [EXPENSE_TYPE.KHAC]: 'Khác',
}

/**
 * Convert loại chi tiêu sang tiếng Việt
 */
export function getExpenseTypeLabel(type) {
    return EXPENSE_TYPE_LABELS[type] || type || 'Khác'
}

// ============================================
// VAI TRÒ NGƯỜI DÙNG
// ============================================
export const USER_ROLE = {
    ADMIN: 'admin',
    QUAN_LY: 'quan_ly',
    KHACH_THUE: 'khach_thue',
}

export const USER_ROLE_LABELS = {
    [USER_ROLE.ADMIN]: 'Quản trị viên',
    [USER_ROLE.QUAN_LY]: 'Quản lý',
    [USER_ROLE.KHACH_THUE]: 'Khách thuê',
}

/**
 * Convert vai trò người dùng sang tiếng Việt
 */
export function getUserRoleLabel(role) {
    return USER_ROLE_LABELS[role] || role
}

// ============================================
// LOẠI PHÒNG (dựa trên diện tích/giá)
// ============================================
export const ROOM_TYPE = {
    DON: 'don',
    DOI: 'doi',
    VIP: 'vip',
}

export const ROOM_TYPE_LABELS = {
    [ROOM_TYPE.DON]: 'Phòng đơn',
    [ROOM_TYPE.DOI]: 'Phòng đôi',
    [ROOM_TYPE.VIP]: 'Phòng VIP',
}

/**
 * Xác định loại phòng dựa trên diện tích và giá thuê
 */
export function getRoomType(dienTich, giaThue) {
    if (dienTich >= 45 || giaThue >= 6000000) {
        return { type: ROOM_TYPE.VIP, label: ROOM_TYPE_LABELS[ROOM_TYPE.VIP], color: 'bg-purple-100 text-purple-800' }
    } else if (dienTich >= 30 || giaThue >= 4000000) {
        return { type: ROOM_TYPE.DOI, label: ROOM_TYPE_LABELS[ROOM_TYPE.DOI], color: 'bg-blue-100 text-blue-800' }
    }
    return { type: ROOM_TYPE.DON, label: ROOM_TYPE_LABELS[ROOM_TYPE.DON], color: 'bg-green-100 text-green-800' }
}

// ============================================
// EXPORT TẤT CẢ CONSTANTS VÀ FUNCTIONS
// ============================================
export default {
    // Constants
    NOTIFICATION_STATUS,
    NOTIFICATION_TYPE,
    ROOM_STATUS,
    CONTRACT_STATUS,
    PAYMENT_STATUS,
    EXPENSE_TYPE,
    USER_ROLE,
    ROOM_TYPE,

    // Labels
    NOTIFICATION_STATUS_LABELS,
    NOTIFICATION_TYPE_LABELS,
    ROOM_STATUS_LABELS,
    CONTRACT_STATUS_LABELS,
    PAYMENT_STATUS_LABELS,
    EXPENSE_TYPE_LABELS,
    USER_ROLE_LABELS,
    ROOM_TYPE_LABELS,

    // Colors
    NOTIFICATION_STATUS_COLORS,
    ROOM_STATUS_COLORS,
    CONTRACT_STATUS_COLORS,
    PAYMENT_STATUS_COLORS,

    // Functions
    getNotificationStatusLabel,
    getNotificationStatusColor,
    getNotificationTypeLabel,
    getRoomStatusLabel,
    getRoomStatusColor,
    getContractStatusLabel,
    getContractStatusColor,
    getPaymentStatusLabel,
    getPaymentStatusColor,
    getExpenseTypeLabel,
    getUserRoleLabel,
    getRoomType,
}

