import { useEffect, useState } from "react";
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
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Send,
} from "lucide-react";
// @ts-ignore
import { getInvoiceDetails } from "@/services/employ-invoice.service";
import { generateAndDownloadPDF } from "@/utils/pdf.utils";
import { buildInvoiceHtml } from "@/utils/invoice-template";
// @ts-ignore
import { createThongBao } from "@/services/thong-bao.service";
// @ts-ignore
import { supabase } from "@/services/supabase-client";
// @ts-ignore
import { sendNotificationEmail } from "@/services/email.service";

interface ManagerInvoiceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null;
  invoiceMeta?: any;
  selectedHostel?: any;
}

interface InvoiceDetailsPayload {
  invoice: any;
  breakdown: any;
}

export function ManagerInvoiceDetailDialog({
  isOpen,
  onClose,
  invoiceId,
  invoiceMeta,
  selectedHostel,
}: ManagerInvoiceDetailDialogProps) {
  const [invoiceDetails, setInvoiceDetails] =
    useState<InvoiceDetailsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

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
    } catch (err) {
      console.error("Error loading invoice details:", err);
      setError("Không thể tải chi tiết hóa đơn");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (invoice: any) => {
    if (invoice.trang_thai === "da_thanh_toan") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Đã thanh toán
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-4 w-4 mr-1" />
        Chưa thanh toán
      </span>
    );
  };

  const handleDownload = async () => {
    if (!invoiceDetails?.invoice) return;
    setIsDownloading(true);
    try {
      const html = buildInvoiceHtml(invoiceDetails, {
        hostelName:
          selectedHostel?.ten_toa ||
          selectedHostel?.ten ||
          selectedHostel?.name ||
          "Khu trọ",
        hostelAddress: selectedHostel?.dia_chi || selectedHostel?.address || "",
        tenantName:
          invoiceMeta?.hop_dong?.khach_thue?.ho_ten || "Không xác định",
        roomNumber: invoiceMeta?.hop_dong?.can_ho?.so_can || "N/A",
      });
      await generateAndDownloadPDF(
        html,
        `hoa-don-${invoiceDetails.invoice.id}.pdf`
      );
    } catch (err: any) {
      console.error("Failed to download invoice:", err);
      alert(err?.message || "Không thể tải hóa đơn, vui lòng thử lại");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendPaymentNotification = async () => {
    if (!invoiceDetails?.invoice) {
      alert("Không có đủ thông tin để gửi thông báo");
      return;
    }

    setIsSendingNotification(true);
    try {
      // Lấy thông tin hợp đồng và khách thuê từ database
      const hopDongId = invoiceDetails.invoice.hop_dong_id;
      if (!hopDongId) {
        alert("Không tìm thấy thông tin hợp đồng");
        setIsSendingNotification(false);
        return;
      }

      // Query hợp đồng với thông tin khách thuê và căn hộ
      const { data: hopDong, error: hopDongError } = await supabase
        .from("hop_dong")
        .select(
          "*, khach_thue:khach_thue_id(id, ho_ten, sdt, email), can_ho:can_ho_id(id, so_can, toa_nha_id)"
        )
        .eq("id", hopDongId)
        .single();

      if (hopDongError || !hopDong) {
        console.error("Error fetching hop_dong:", hopDongError);
        alert("Không thể lấy thông tin hợp đồng");
        setIsSendingNotification(false);
        return;
      }

      const khachThue = hopDong.khach_thue;
      const canHo = hopDong.can_ho;
      const toaNhaId = selectedHostel?.id || canHo?.toa_nha_id;

      if (!khachThue?.id || !toaNhaId) {
        alert("Không tìm thấy thông tin khách thuê hoặc tòa nhà");
        setIsSendingNotification(false);
        return;
      }

      const tenantName = khachThue.ho_ten || "Khách thuê";
      const roomNumber = canHo?.so_can || "N/A";
      const invoiceId = invoiceDetails.invoice.id;
      const totalAmount = invoiceDetails.invoice.so_tien || 0;
      const formattedAmount = new Intl.NumberFormat("vi-VN").format(totalAmount);
      const hostelName =
        selectedHostel?.ten_toa ||
        selectedHostel?.ten ||
        selectedHostel?.name ||
        "Khu trọ";

      // Tạo nội dung thông báo
      const tieuDe = `Thông báo đóng tiền phòng - Hóa đơn ${invoiceId}`;
      const noiDung = `Kính gửi ${tenantName},\n\nBạn có hóa đơn cần thanh toán:\n\n- Mã hóa đơn: ${invoiceId}\n- Phòng: ${roomNumber}\n- Khu trọ: ${hostelName}\n- Tổng tiền: ${formattedAmount}₫\n- Ngày tạo: ${formatDate(invoiceDetails.invoice.ngay_tao)}\n\nVui lòng thanh toán sớm để tránh phát sinh phí trễ hạn.\n\nTrân trọng,\nQuản lý khu trọ`;

      // Tạo thông báo trong hệ thống
      const notificationData = {
        khach_thue_id: khachThue.id,
        toa_nha_id: toaNhaId,
        can_ho_id: canHo?.id || null,
        tieu_de: tieuDe,
        noi_dung: noiDung,
        loai_thong_bao: "thanh_toan",
      };

      await createThongBao(notificationData);

      // Gửi email thông báo nếu khách thuê có email
      const tenantEmail = khachThue.email;
      if (tenantEmail && tenantEmail.trim()) {
        try {
          await sendNotificationEmail({
            toEmail: tenantEmail.trim(),
            tenantName: tenantName,
            subject: tieuDe,
            message: noiDung,
          });
          alert("Đã gửi thông báo và email thành công đến khách thuê!");
        } catch (emailError: any) {
          console.error("Error sending email:", emailError);
          // Vẫn hiển thị thành công vì đã tạo thông báo trong hệ thống
          alert("Đã gửi thông báo thành công! (Gửi email thất bại, vui lòng kiểm tra lại email của khách thuê)");
        }
      } else {
        alert("Đã gửi thông báo thành công đến khách thuê! (Khách thuê chưa có email)");
      }
    } catch (err: any) {
      console.error("Error sending payment notification:", err);
      alert(
        err?.message ||
        "Không thể gửi thông báo. Vui lòng thử lại sau."
      );
    } finally {
      setIsSendingNotification(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Receipt className="h-5 w-5 mr-2" />
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
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={loadInvoiceDetails}>
                Thử lại
              </Button>
            </div>
          </div>
        ) : invoiceDetails ? (
          <div className="space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã hóa đơn</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoiceDetails.invoice.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(invoiceDetails.invoice.ngay_tao)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Khách thuê</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoiceMeta?.hop_dong?.khach_thue?.ho_ten ||
                        "Không xác định"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phòng</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoiceMeta?.hop_dong?.can_ho?.so_can || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(invoiceDetails.invoice.so_tien || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày thanh toán</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoiceDetails.invoice.trang_thai === "da_thanh_toan"
                        ? formatDate(invoiceDetails.invoice.ngay_thanh_toan)
                        : "Chưa thanh toán"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Chi tiết các khoản phí
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-blue-900">Tiền phòng</p>
                      <p className="text-sm text-blue-600">
                        Chi phí thuê phòng
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(invoiceDetails.breakdown.tienPhong)}
                  </p>
                </div>

                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-semibold text-yellow-800">Tiền điện</p>
                      <p className="text-sm text-yellow-600">
                        {invoiceDetails.breakdown.chiSoDienCu} →{" "}
                        {invoiceDetails.breakdown.chiSoDienMoi} (
                        {invoiceDetails.breakdown.soKwh} kWh)
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-yellow-800">
                    {formatCurrency(invoiceDetails.breakdown.tienDien)}
                  </p>
                </div>

                <div className="flex justify-between items-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-cyan-600 mr-3" />
                    <div>
                      <p className="font-semibold text-cyan-800">Tiền nước</p>
                      <p className="text-sm text-cyan-600">
                        {invoiceDetails.breakdown.chiSoNuocCu} →{" "}
                        {invoiceDetails.breakdown.chiSoNuocMoi} (
                        {invoiceDetails.breakdown.soM3} m³)
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-cyan-800">
                    {formatCurrency(invoiceDetails.breakdown.tienNuoc)}
                  </p>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <Wrench className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold text-purple-800">Dịch vụ</p>
                      <p className="text-sm text-purple-600">
                        Internet, vệ sinh, gửi xe...
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-purple-800">
                    {formatCurrency(invoiceDetails.breakdown.tienDichVu)}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center">
                      <Receipt className="h-6 w-6 text-gray-700 mr-3" />
                      <p className="text-xl font-bold text-gray-800">
                        Tổng cộng
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(invoiceDetails.invoice.so_tien || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <DialogFooter className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-500">
            Khu trọ:{" "}
            <span className="font-semibold text-gray-800">
              {selectedHostel?.ten_toa ||
                selectedHostel?.ten ||
                selectedHostel?.name ||
                "N/A"}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            {invoiceDetails?.invoice.trang_thai !== "da_thanh_toan" && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSendPaymentNotification}
                disabled={isSendingNotification || !invoiceDetails}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSendingNotification
                  ? "Đang gửi..."
                  : "Gửi thông báo đóng tiền"}
              </Button>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleDownload}
              disabled={isDownloading || !invoiceDetails}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Đang tải..." : "Tải PDF"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
