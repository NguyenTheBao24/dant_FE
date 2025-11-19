import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
// import { Alert, AlertDescription } from "@/components/admin/ui/alert"
import { Receipt, Save, X, AlertTriangle, Info } from "lucide-react";

// Import types
import { CreateInvoiceDialogProps } from "../../../types/invoice.types";

// Import custom hook
import { useInvoiceCalculator } from "../../../hooks/useInvoiceCalculator";

// Import utils
import { validateInvoiceForm } from "../../../utils/invoice.utils";

// Import components
import {
  RoomInfoCard,
  MeterInputCard,
  RoomRentCard,
  ServiceCard,
  TotalCard,
  ErrorAlert,
} from "./invoice";

// Import services
// @ts-ignore
import { createHoaDon } from "@/services/hoa-don.service";
// @ts-ignore
import {
  createOrUpdateInvoice,
  canCreateInvoice,
} from "@/services/invoice-management.service";

export function CreateInvoiceDialog({
  isOpen,
  onOpenChange,
  room,
  selectedHostel,
  onInvoiceCreated,
}: CreateInvoiceDialogProps) {
  const { isLoading, bangGia, hopDong, invoiceData, handleInputChange } =
    useInvoiceCalculator({ isOpen, room, selectedHostel });

  const [invoiceStatus, setInvoiceStatus] = useState<any>(null);
  const [isCheckingInvoice, setIsCheckingInvoice] = useState(false);

  // Kiểm tra hóa đơn hiện tại khi mở dialog
  useEffect(() => {
    if (isOpen && hopDong?.id) {
      checkCurrentInvoice();
    }
  }, [isOpen, hopDong?.id]);

  const checkCurrentInvoice = async () => {
    if (!hopDong?.id) return;

    setIsCheckingInvoice(true);
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const status = await canCreateInvoice(
        hopDong.id,
        currentYear,
        currentMonth
      );
      setInvoiceStatus(status);
    } catch (error) {
      console.error("Error checking current invoice:", error);
      setInvoiceStatus({
        canCreate: false,
        reason: "Error checking invoice status",
      });
    } finally {
      setIsCheckingInvoice(false);
    }
  };

  const validateForm = () => {
    const validation = validateInvoiceForm(invoiceData, hopDong, bangGia);
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Lấy tháng và năm hiện tại
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // Chuẩn bị dữ liệu hóa đơn
      // Tính gia_dich_vu từ tổng các dịch vụ
      const giaDichVu =
        bangGia?.gia_dich_vu ||
        (bangGia?.gia_internet || 0) +
          (bangGia?.gia_ve_sinh || 0) +
          (bangGia?.gia_gui_xe || 0);

      const invoiceDataPayload = {
        so_tien: invoiceData.tong_tien,
        so_dien_cu: invoiceData.chi_so_dien_cu || 0,
        so_dien_moi: invoiceData.chi_so_dien_moi || 0,
        so_nuoc_cu: invoiceData.chi_so_nuoc_cu || 0,
        so_nuoc_moi: invoiceData.chi_so_nuoc_moi || 0,
        gia_dien: bangGia?.gia_dien || 0,
        gia_nuoc: bangGia?.gia_nuoc || 0,
        gia_dich_vu: giaDichVu,
        tong_tien: invoiceData.tong_tien,
      };

      console.log(
        "Creating/updating invoice for month:",
        currentMonth,
        currentYear
      );
      console.log("Invoice data:", invoiceDataPayload);

      // Sử dụng logic mới để tạo hoặc cập nhật hóa đơn
      const result = await createOrUpdateInvoice(
        invoiceData.hop_dong_id,
        invoiceDataPayload,
        currentYear,
        currentMonth
      );

      console.log("Invoice result:", result);

      if (result.action === "created") {
        alert("Tạo hóa đơn mới thành công!");
      } else if (result.action === "updated") {
        alert("Cập nhật hóa đơn hiện tại thành công!");
      }

      onInvoiceCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating/updating invoice:", error);
      alert(
        error.message || "Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại."
      );
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!room || !selectedHostel) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-blue-600" />
              Tạo hóa đơn thanh toán
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Đang tải dữ liệu...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-blue-600" />
            Tạo hóa đơn thanh toán tháng {invoiceData.thang}/{invoiceData.nam}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông báo trạng thái hóa đơn hiện tại */}
          {isCheckingInvoice && (
            <div className="flex items-center p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">
                Đang kiểm tra hóa đơn hiện tại...
              </span>
            </div>
          )}

          {invoiceStatus && !isCheckingInvoice && (
            <div
              className={`flex items-center p-4 border rounded-lg ${
                invoiceStatus.canCreate
                  ? "border-blue-200 bg-blue-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {invoiceStatus.canCreate ? (
                <Info className="h-4 w-4 text-blue-600 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              )}
              <span
                className={
                  invoiceStatus.canCreate ? "text-blue-800" : "text-red-800"
                }
              >
                {invoiceStatus.reason === "No invoice exists for this month" &&
                  "Chưa có hóa đơn cho tháng này. Bạn có thể tạo hóa đơn mới."}
                {invoiceStatus.reason ===
                  "Can update existing unpaid invoice" &&
                  `Đã có hóa đơn chưa thanh toán cho tháng này (${invoiceStatus.existingInvoice?.so_tien?.toLocaleString(
                    "vi-VN"
                  )}₫). Bạn có thể cập nhật hóa đơn này.`}
                {invoiceStatus.reason === "Invoice already paid" &&
                  `Hóa đơn tháng này đã được thanh toán (${invoiceStatus.existingInvoice?.so_tien?.toLocaleString(
                    "vi-VN"
                  )}₫). Không thể tạo hóa đơn mới.`}
              </span>
            </div>
          )}

          {/* Thông tin phòng và khách thuê */}
          <RoomInfoCard room={room} hopDong={hopDong} />

          {/* Error alert nếu không có hợp đồng */}
          {!hopDong && (
            <ErrorAlert message="Phòng này chưa có hợp đồng hiệu lực. Không thể tạo hóa đơn." />
          )}

          {/* Form tạo hóa đơn */}
          {hopDong && bangGia && (
            <>
              {/* Chỉ số điện nước */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MeterInputCard
                  type="electricity"
                  invoiceData={invoiceData}
                  bangGia={bangGia}
                  onInputChange={handleInputChange}
                />
                <MeterInputCard
                  type="water"
                  invoiceData={invoiceData}
                  bangGia={bangGia}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Tiền phòng */}
              <RoomRentCard room={room} />

              {/* Dịch vụ dùng chung */}
              <ServiceCard invoiceData={invoiceData} bangGia={bangGia} />

              {/* Tổng cộng */}
              <TotalCard
                invoiceData={invoiceData}
                bangGia={bangGia}
                room={room}
              />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !hopDong ||
              !bangGia ||
              !invoiceStatus?.canCreate ||
              isCheckingInvoice
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {invoiceStatus?.reason === "Can update existing unpaid invoice"
              ? "Cập nhật hóa đơn"
              : "Tạo hóa đơn"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
