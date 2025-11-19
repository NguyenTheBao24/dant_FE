import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Receipt,
  DollarSign,
  Zap,
  Droplets,
  Wrench,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
// @ts-ignore
import { getInvoiceDetails } from "@/services/employ-invoice.service";
import { PaymentDialog } from "./PaymentDialog";

interface InvoiceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | number | null;
  onPaymentSuccess?: () => void;
}

interface InvoiceDetails {
  invoice: any;
  breakdown: any;
  calculatedTotal: number;
}

export function InvoiceDetailDialog({
  isOpen,
  onClose,
  invoiceId,
  onPaymentSuccess,
}: InvoiceDetailDialogProps) {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      loadInvoiceDetails();
    }
  }, [isOpen, invoiceId]);

  const loadInvoiceDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await getInvoiceDetails(invoiceId);
      setInvoiceDetails(details);
    } catch (error) {
      console.error("Error loading invoice details:", error);
      setError("Không thể tải chi tiết hóa đơn");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("vi-VN")
      : "N/A";
  };

  const getStatusBadge = (invoice: any) => {
    if (invoice.trang_thai === "da_thanh_toan") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Đã thanh toán
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Clock className="h-4 w-4 mr-1" />
          Chưa thanh toán
        </span>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Receipt className="h-6 w-6 mr-2" />
            Chi tiết hóa đơn
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải chi tiết hóa đơn...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadInvoiceDetails} variant="outline">
                Thử lại
              </Button>
            </div>
          </div>
        ) : invoiceDetails ? (
          <div className="space-y-6">
            {/* Thông tin hóa đơn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Thông tin hóa đơn
                  </span>
                  {getStatusBadge(invoiceDetails.invoice)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tháng/Năm</p>
                    <p className="font-semibold">
                      {invoiceDetails.breakdown.thang}/
                      {invoiceDetails.breakdown.nam}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày tạo</p>
                    <p className="font-semibold">
                      {formatDate(invoiceDetails.invoice.ngay_tao)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-semibold text-lg text-blue-600">
                      {formatCurrency(invoiceDetails.invoice.so_tien)}
                    </p>
                  </div>
                  {invoiceDetails.invoice.trang_thai === "da_thanh_toan" && (
                    <div>
                      <p className="text-sm text-gray-600">Ngày thanh toán</p>
                      <p className="font-semibold text-green-600">
                        Đã thanh toán
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chi tiết các khoản phí */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Chi tiết các khoản phí
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tiền phòng */}
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-800">Tiền phòng</p>
                      <p className="text-sm text-blue-600">Phòng thuê</p>
                    </div>
                  </div>
                  <p className="font-bold text-blue-800 text-lg">
                    {formatCurrency(invoiceDetails.breakdown.tienPhong)}
                  </p>
                </div>

                {/* Tiền điện */}
                {invoiceDetails.breakdown.tienDien > 0 && (
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <p className="font-medium text-yellow-800">Tiền điện</p>
                        <p className="text-sm text-yellow-600">
                          {invoiceDetails.breakdown.chiSoDienCu} →{" "}
                          {invoiceDetails.breakdown.chiSoDienMoi}(
                          {invoiceDetails.breakdown.soKwh} kWh)
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-yellow-800 text-lg">
                      {formatCurrency(invoiceDetails.breakdown.tienDien)}
                    </p>
                  </div>
                )}

                {/* Tiền nước */}
                {invoiceDetails.breakdown.tienNuoc > 0 && (
                  <div className="flex justify-between items-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-cyan-600 mr-3" />
                      <div>
                        <p className="font-medium text-cyan-800">Tiền nước</p>
                        <p className="text-sm text-cyan-600">
                          {invoiceDetails.breakdown.chiSoNuocCu} →{" "}
                          {invoiceDetails.breakdown.chiSoNuocMoi}(
                          {invoiceDetails.breakdown.soM3} m³)
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-cyan-800 text-lg">
                      {formatCurrency(invoiceDetails.breakdown.tienNuoc)}
                    </p>
                  </div>
                )}

                {/* Tiền dịch vụ */}
                {invoiceDetails.breakdown.tienDichVu > 0 && (
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <Wrench className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-purple-800">
                          Dịch vụ dùng chung
                        </p>
                        <p className="text-sm text-purple-600">
                          Internet, trông xe, bảo vệ, vệ sinh
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-purple-800 text-lg">
                      {formatCurrency(invoiceDetails.breakdown.tienDichVu)}
                    </p>
                  </div>
                )}

                {/* Tổng cộng */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                    <div className="flex items-center">
                      <Receipt className="h-6 w-6 text-gray-700 mr-3" />
                      <p className="text-xl font-bold text-gray-800">
                        TỔNG CỘNG
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(invoiceDetails.invoice.so_tien)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <DialogFooter>
          {invoiceDetails?.invoice.trang_thai === "chua_tt" && (
            <Button
              onClick={() => {
                setIsPaymentDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Thanh toán
            </Button>
          )}
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Payment Dialog */}
      {invoiceDetails && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          invoiceId={invoiceId}
          amount={
            invoiceDetails.invoice.tong_tien || invoiceDetails.invoice.so_tien
          }
          onPaymentSuccess={onPaymentSuccess}
          onCloseInvoiceDetail={onClose}
        />
      )}
    </Dialog>
  );
}
