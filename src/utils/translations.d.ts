/**
 * Type definitions for translations.js
 */

// ============================================
// TRẠNG THÁI THÔNG BÁO
// ============================================
export const NOTIFICATION_STATUS: {
	CHUA_XU_LY: 'chua_xu_ly'
	DANG_XU_LY: 'dang_xu_ly'
	DA_XU_LY: 'da_xu_ly'
}

export const NOTIFICATION_STATUS_LABELS: Record<string, string>
export const NOTIFICATION_STATUS_COLORS: Record<string, string>

export function getNotificationStatusLabel(status: string): string
export function getNotificationStatusColor(status: string): string

// ============================================
// LOẠI THÔNG BÁO
// ============================================
export const NOTIFICATION_TYPE: {
	LIEN_HE: 'lien_he'
	THANH_TOAN: 'thanh_toan'
	SUA_CHUA: 'sua_chua'
	PHAN_ANH: 'phan_anh'
	KHAC: 'khac'
}

export const NOTIFICATION_TYPE_LABELS: Record<string, string>
export function getNotificationTypeLabel(type: string): string

// ============================================
// TRẠNG THÁI PHÒNG
// ============================================
export const ROOM_STATUS: {
	DA_THUE: 'da_thue'
	OCCUPIED: 'occupied'
	TRONG: 'trong'
	AVAILABLE: 'available'
	SUA_CHUA: 'sua_chua'
	MAINTENANCE: 'maintenance'
}

export const ROOM_STATUS_LABELS: Record<string, string>
export const ROOM_STATUS_COLORS: Record<string, string>

export function getRoomStatusLabel(status: string): string
export function getRoomStatusColor(status: string): string

// ============================================
// TRẠNG THÁI HỢP ĐỒNG
// ============================================
export const CONTRACT_STATUS: {
	HIEU_LUC: 'hieu_luc'
	HET_HAN: 'het_han'
	HUY: 'huy'
}

export const CONTRACT_STATUS_LABELS: Record<string, string>
export const CONTRACT_STATUS_COLORS: Record<string, string>

export function getContractStatusLabel(status: string): string
export function getContractStatusColor(status: string): string

// ============================================
// TRẠNG THÁI THANH TOÁN (HÓA ĐƠN)
// ============================================
export const PAYMENT_STATUS: {
	CHUA_TT: 'chua_tt'
	CHUA_THANH_TOAN: 'chua_thanh_toan'
	DA_THANH_TOAN: 'da_thanh_toan'
	QUA_HAN: 'qua_han'
}

export const PAYMENT_STATUS_LABELS: Record<string, string>
export const PAYMENT_STATUS_COLORS: Record<string, string>

export function getPaymentStatusLabel(status: string): string
export function getPaymentStatusColor(status: string): string

// ============================================
// LOẠI CHI TIÊU
// ============================================
export const EXPENSE_TYPE: {
	DIEN_NUOC: 'dien_nuoc'
	BAO_TRI: 'bao_tri'
	VE_SINH: 've_sinh'
	AN_NINH: 'an_ninh'
	MARKETING: 'marketing'
	THUE: 'thue'
	BAO_HIEM: 'bao_hiem'
	LUONG_QUAN_LY: 'luong_quan_ly'
	KHAC: 'khac'
}

export const EXPENSE_TYPE_LABELS: Record<string, string>
export function getExpenseTypeLabel(type: string): string

// ============================================
// VAI TRÒ NGƯỜI DÙNG
// ============================================
export const USER_ROLE: {
	ADMIN: 'admin'
	QUAN_LY: 'quan_ly'
	KHACH_THUE: 'khach_thue'
}

export const USER_ROLE_LABELS: Record<string, string>
export function getUserRoleLabel(role: string): string

// ============================================
// LOẠI PHÒNG
// ============================================
export const ROOM_TYPE: {
	DON: 'don'
	DOI: 'doi'
	VIP: 'vip'
}

export const ROOM_TYPE_LABELS: Record<string, string>

export interface RoomTypeResult {
	type: string
	label: string
	color: string
}

export function getRoomType(dienTich: number, giaThue: number): RoomTypeResult

// ============================================
// DEFAULT EXPORT
// ============================================
declare const translations: {
	NOTIFICATION_STATUS: typeof NOTIFICATION_STATUS
	NOTIFICATION_TYPE: typeof NOTIFICATION_TYPE
	ROOM_STATUS: typeof ROOM_STATUS
	CONTRACT_STATUS: typeof CONTRACT_STATUS
	PAYMENT_STATUS: typeof PAYMENT_STATUS
	EXPENSE_TYPE: typeof EXPENSE_TYPE
	USER_ROLE: typeof USER_ROLE
	ROOM_TYPE: typeof ROOM_TYPE
	NOTIFICATION_STATUS_LABELS: typeof NOTIFICATION_STATUS_LABELS
	NOTIFICATION_TYPE_LABELS: typeof NOTIFICATION_TYPE_LABELS
	ROOM_STATUS_LABELS: typeof ROOM_STATUS_LABELS
	CONTRACT_STATUS_LABELS: typeof CONTRACT_STATUS_LABELS
	PAYMENT_STATUS_LABELS: typeof PAYMENT_STATUS_LABELS
	EXPENSE_TYPE_LABELS: typeof EXPENSE_TYPE_LABELS
	USER_ROLE_LABELS: typeof USER_ROLE_LABELS
	ROOM_TYPE_LABELS: typeof ROOM_TYPE_LABELS
	NOTIFICATION_STATUS_COLORS: typeof NOTIFICATION_STATUS_COLORS
	ROOM_STATUS_COLORS: typeof ROOM_STATUS_COLORS
	CONTRACT_STATUS_COLORS: typeof CONTRACT_STATUS_COLORS
	PAYMENT_STATUS_COLORS: typeof PAYMENT_STATUS_COLORS
	getNotificationStatusLabel: typeof getNotificationStatusLabel
	getNotificationStatusColor: typeof getNotificationStatusColor
	getNotificationTypeLabel: typeof getNotificationTypeLabel
	getRoomStatusLabel: typeof getRoomStatusLabel
	getRoomStatusColor: typeof getRoomStatusColor
	getContractStatusLabel: typeof getContractStatusLabel
	getContractStatusColor: typeof getContractStatusColor
	getPaymentStatusLabel: typeof getPaymentStatusLabel
	getPaymentStatusColor: typeof getPaymentStatusColor
	getExpenseTypeLabel: typeof getExpenseTypeLabel
	getUserRoleLabel: typeof getUserRoleLabel
	getRoomType: typeof getRoomType
}

export default translations


