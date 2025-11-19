import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import {
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Loader2,
  CreditCard,
} from "lucide-react";
// @ts-ignore
import { generateSePayQRUrl } from "@/services/payment.service";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number | string;
  amount: number;
  onPaymentSuccess?: () => void;
  onCloseInvoiceDetail?: () => void;
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  invoiceId,
  amount,
  onPaymentSuccess,
  onCloseInvoiceDetail,
}: PaymentDialogProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);

  // Tạo URL QR code khi mở dialog
  useEffect(() => {
    if (isOpen && invoiceId && amount) {
      const url = generateSePayQRUrl(amount, invoiceId);
      setQrUrl(url);
      // Bắt đầu polling khi mở dialog
      setIsPollingEnabled(true);
    } else {
      // Dừng polling khi đóng dialog
      setIsPollingEnabled(false);
    }
  }, [isOpen, invoiceId, amount]);

  // Long polling để check status
  const { isPolling, invoiceStatus, error, stopPolling } = usePaymentPolling({
    invoiceId,
    enabled: isPollingEnabled && isOpen,
    onSuccess: invoice => {
      console.log("Payment successful!", invoice);
      setIsPollingEnabled(false);
      // Đóng dialog sau 2 giây
      setTimeout(() => {
        handleClose();
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        if (onCloseInvoiceDetail) {
          onCloseInvoiceDetail();
        }
      }, 2000);
    },
    onError: err => {
      console.error("Payment polling error:", err);
    },
    pollInterval: 2000, // Check mỗi 2 giây
    maxPollingTime: 300000, // Tối đa 5 phút
  });

  const handleClose = () => {
    setIsPollingEnabled(false);
    stopPolling();
    onOpenChange(false);
  };

  const handleContinuePayment = () => {
    // Tiếp tục polling khi user bấm "Tiếp tục thanh toán"
    setIsPollingEnabled(true);
  };

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString("vi-VN") + "₫";
  };

  if (!isOpen) return null;

  // Nếu đã thanh toán thành công
  if (invoiceStatus === "da_thanh_toan") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              Thanh toán thành công
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Thanh toán thành công
            </h3>
            <p className="text-gray-600 mb-4">
              Hóa đơn #{invoiceId} đã được thanh toán thành công
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(amount)}
            </p>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            Thanh toán hóa đơn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin hóa đơn */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Hóa đơn #</span>
                <span className="font-semibold">{invoiceId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng tiền</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(amount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <Card className="">
              <CardContent className="p-0">
                {qrUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={qrUrl}
                      alt="QR Code thanh toán"
                      className="w-full h-full border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-64 h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trạng thái polling */}
          {isPollingEnabled && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              {isPolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    Đang chờ thanh toán... Vui lòng quét QR code và thanh toán
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Đang kiểm tra trạng thái thanh toán...
                  </span>
                </>
              )}
            </div>
          )}

          {/* Thông báo lỗi */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Thông báo đã dừng polling */}
          {!isPollingEnabled && invoiceStatus !== "da_thanh_toan" && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Đã tạm dừng kiểm tra thanh toán. Nhấn "Tiếp tục thanh toán" để
                tiếp tục.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button onClick={handleClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
          {!isPollingEnabled && invoiceStatus !== "da_thanh_toan" && (
            <Button onClick={handleContinuePayment} className="bg-blue-600">
              <CreditCard className="h-4 w-4 mr-2" />
              Tiếp tục thanh toán
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
