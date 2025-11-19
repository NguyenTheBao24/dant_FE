export interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  room: any;
  selectedHostel: any;
  onInvoiceCreated: () => void;
}

export interface BangGia {
  gia_dien?: number;
  gia_nuoc?: number;
  gia_dich_vu?: number; // Giá dịch vụ dùng chung (tổng của internet + vệ sinh + gửi xe)
  gia_internet?: number; // Giá internet
  gia_ve_sinh?: number; // Giá vệ sinh
  gia_gui_xe?: number; // Giá gửi xe
  [key: string]: any;
}

export interface InvoiceData {
  hop_dong_id: number;
  loai_hoa_don: string;
  thang: number;
  nam: number;
  chi_so_dien_cu: number;
  chi_so_dien_moi: number;
  chi_so_nuoc_cu: number;
  chi_so_nuoc_moi: number;
  tien_dien: number;
  tien_nuoc: number;
  tien_dich_vu: number; // Tiền dịch vụ dùng chung
  tong_tien: number;
}

export interface RoomInfo {
  id: number;
  so_can?: string;
  gia_thue?: number;
}

export interface HopDongInfo {
  id: number;
  khach_thue?: {
    ho_ten: string;
  };
  can_ho_id: number;
  trang_thai: string;
}

export interface InvoiceCalculationResult {
  tien_dien: number;
  tien_nuoc: number;
  tien_dich_vu: number;
  tien_phong: number;
  tong_tien: number;
}
