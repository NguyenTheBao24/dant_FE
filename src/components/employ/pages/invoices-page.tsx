import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Receipt,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Zap,
  Droplets,
  Home,
  Wrench,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
// @ts-ignore
import { getInvoicesByHopDong } from "@/services/employ-invoice.service";
import { InvoiceDetailDialog } from "../dialogs/InvoiceDetailDialog";

interface InvoicesPageProps {
  invoiceData?: any;
  userContracts?: any[];
}

export function InvoicesPage({
  invoiceData,
  userContracts,
}: InvoicesPageProps) {
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<
    number | string | null
  >(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const loadAllInvoices = useCallback(async (hopDongId: number) => {
    setIsLoading(true);
    try {
      console.log("Loading invoices for hop_dong_id:", hopDongId);
      const invoices = await getInvoicesByHopDong(hopDongId);
      console.log("Found invoices:", invoices);
      setAllInvoices(invoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activeContractId = useMemo(() => {
    const activeContract = userContracts?.find(
      contract => contract.trang_thai === "hieu_luc"
    );
    return activeContract?.id ?? null;
  }, [userContracts]);

  useEffect(() => {
    if (activeContractId) {
      loadAllInvoices(activeContractId); 
    }
  }, [activeContractId, loadAllInvoices]);

  const handleViewDetails = (invoiceId: number | string) => {
    setSelectedInvoiceId(invoiceId);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedInvoiceId(null);
  };
  const handleInvoicePaid = () => {
    if (activeContractId) {
      loadAllInvoices(activeContractId);
    }
  };

  const toggleMonthExpansion = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  const groupInvoicesByMonth = () => {
    const grouped = allInvoices.reduce((acc: any, invoice: any) => {
      const date = new Date(invoice.ngay_tao);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthName,
          monthKey,
          invoices: [],
          totalAmount: 0,
          paidCount: 0,
          unpaidCount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
        };
      }

      acc[monthKey].invoices.push(invoice);
      acc[monthKey].totalAmount += invoice.so_tien || 0;

      if (invoice.trang_thai === "da_thanh_toan") {
        acc[monthKey].paidCount++;
        acc[monthKey].paidAmount += invoice.so_tien || 0;
      } else {
        acc[monthKey].unpaidCount++;
        acc[monthKey].unpaidAmount += invoice.so_tien || 0;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) =>
      b.monthKey.localeCompare(a.monthKey)
    );
  };

  const getStatusBadge = (invoice: any) => {
    if (invoice.trang_thai === "da_thanh_toan") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã thanh toán
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Chưa thanh toán
        </span>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString("vi-VN") + "₫";
  };

  if (!invoiceData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Hóa đơn
            </h2>
            <p className="text-gray-600 mt-1">Quản lý hóa đơn thanh toán</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Không có thông tin hóa đơn
            </h3>
            <p className="text-gray-500">
              Không tìm thấy hợp đồng hoặc hóa đơn liên quan
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Hóa đơn
            </h2>
            <p className="text-gray-600 mt-1">Quản lý hóa đơn thanh toán</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Tổng hóa đơn */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng hóa đơn
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allInvoices.length}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          {/* Hóa đơn chưa thanh toán */}
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Chưa thanh toán
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {
                      allInvoices.filter(inv => inv.trang_thai === "chua_tt")
                        .length
                    }
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Tổng:{" "}
                    {allInvoices
                      .filter(inv => inv.trang_thai === "chua_tt")
                      .reduce((sum, inv) => sum + (inv.so_tien || 0), 0)
                      .toLocaleString("vi-VN")}
                    ₫
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Hóa đơn đã thanh toán */}
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Đã thanh toán
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {
                      allInvoices.filter(
                        inv => inv.trang_thai === "da_thanh_toan"
                      ).length
                    }
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Tổng:{" "}
                    {allInvoices
                      .filter(inv => inv.trang_thai === "da_thanh_toan")
                      .reduce((sum, inv) => sum + (inv.so_tien || 0), 0)
                      .toLocaleString("vi-VN")}
                    ₫
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Tổng tiền đã thanh toán */}
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Tổng đã thanh toán
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {allInvoices
                      .filter(inv => inv.trang_thai === "da_thanh_toan")
                      .reduce((sum, inv) => sum + (inv.so_tien || 0), 0)
                      .toLocaleString("vi-VN")}
                    ₫
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {
                      allInvoices.filter(
                        inv => inv.trang_thai === "da_thanh_toan"
                      ).length
                    }{" "}
                    hóa đơn
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin hóa đơn chưa thanh toán - giống overview */}
        {(() => {
          const unpaidInvoice = allInvoices.find(
            inv => inv.trang_thai === "chua_tt"
          );
          if (!unpaidInvoice) return null;

          return (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-red-800">
                  <Receipt className="h-5 w-5 text-red-600 mr-2" />
                  Hóa đơn chưa thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Hóa đơn tháng{" "}
                        {new Date(unpaidInvoice.ngay_tao).toLocaleDateString(
                          "vi-VN"
                        )}
                      </h4>
                      <p className="text-sm text-red-600">
                        Ngày tạo:{" "}
                        {new Date(unpaidInvoice.ngay_tao).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700">
                        {(unpaidInvoice.so_tien || 0).toLocaleString("vi-VN")}₫
                      </p>
                      <p className="text-sm text-red-600">Tổng tiền</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Điện cũ</p>
                      <p className="text-red-600">
                        {unpaidInvoice.so_dien_cu || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Điện mới</p>
                      <p className="text-red-600">
                        {unpaidInvoice.so_dien_moi || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Nước cũ</p>
                      <p className="text-red-600">
                        {unpaidInvoice.so_nuoc_cu || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Nước mới</p>
                      <p className="text-red-600">
                        {unpaidInvoice.so_nuoc_moi || 0}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-700">Tiền điện</p>
                        <p className="text-red-600">
                          {((unpaidInvoice.so_dien_moi || 0) -
                            (unpaidInvoice.so_dien_cu || 0)) *
                            (unpaidInvoice.gia_dien || 0)}
                          ₫
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700">Tiền nước</p>
                        <p className="text-red-600">
                          {((unpaidInvoice.so_nuoc_moi || 0) -
                            (unpaidInvoice.so_nuoc_cu || 0)) *
                            (unpaidInvoice.gia_nuoc || 0)}
                          ₫
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700">Dịch vụ</p>
                        <p className="text-red-600">
                          {(unpaidInvoice.gia_dich_vu || 0).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700">Tiền phòng</p>
                        <p className="text-red-600">
                          {Math.max(
                            0,
                            (unpaidInvoice.so_tien || 0) -
                              ((unpaidInvoice.so_dien_moi || 0) -
                                (unpaidInvoice.so_dien_cu || 0)) *
                                (unpaidInvoice.gia_dien || 0) -
                              ((unpaidInvoice.so_nuoc_moi || 0) -
                                (unpaidInvoice.so_nuoc_cu || 0)) *
                                (unpaidInvoice.gia_nuoc || 0) -
                              (unpaidInvoice.gia_dich_vu || 0)
                          ).toLocaleString("vi-VN")}
                          ₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Danh sách hóa đơn theo tháng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Danh sách hóa đơn theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải hóa đơn...</p>
              </div>
            ) : allInvoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Chưa có hóa đơn
                </h3>
                <p className="text-gray-500">
                  Không có hóa đơn nào được tạo cho hợp đồng này
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupInvoicesByMonth().map((monthData: any) => (
                  <div
                    key={monthData.monthKey}
                    className="border border-gray-200 rounded-lg"
                  >
                    {/* Month Header */}
                    <div
                      className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleMonthExpansion(monthData.monthKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {expandedMonths.has(monthData.monthKey) ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {monthData.monthName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {monthData.invoices.length} hóa đơn • Tổng:{" "}
                              {monthData.totalAmount.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="text-green-600 font-medium">
                              {monthData.paidCount}
                            </p>
                            <p className="text-green-600">Đã thanh toán</p>
                          </div>
                          <div className="text-center">
                            <p className="text-red-600 font-medium">
                              {monthData.unpaidCount}
                            </p>
                            <p className="text-red-600">Chưa thanh toán</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Month Invoices */}
                    {expandedMonths.has(monthData.monthKey) && (
                      <div className="p-4 space-y-3">
                        {monthData.invoices.map((invoice: any) => {
                          // Tạo breakdown từ dữ liệu có sẵn
                          const soKwh =
                            (invoice.so_dien_moi || 0) -
                            (invoice.so_dien_cu || 0);
                          const soM3 =
                            (invoice.so_nuoc_moi || 0) -
                            (invoice.so_nuoc_cu || 0);
                          const tienDien = soKwh * (invoice.gia_dien || 0);
                          const tienNuoc = soM3 * (invoice.gia_nuoc || 0);
                          const tienDichVu = invoice.gia_dich_vu || 0;
                          const tienPhong =
                            (invoice.so_tien || 0) -
                            tienDien -
                            tienNuoc -
                            tienDichVu;

                          const breakdown = {
                            tienPhong: Math.max(0, tienPhong),
                            tienDien: tienDien,
                            tienNuoc: tienNuoc,
                            tienDichVu: tienDichVu,
                            chiSoDienCu: invoice.so_dien_cu || 0,
                            chiSoDienMoi: invoice.so_dien_moi || 0,
                            chiSoNuocCu: invoice.so_nuoc_cu || 0,
                            chiSoNuocMoi: invoice.so_nuoc_moi || 0,
                            soKwh: soKwh,
                            soM3: soM3,
                          };

                          return (
                            <div
                              key={invoice.id}
                              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                                invoice.trang_thai === "da_thanh_toan"
                                  ? "border-green-200 bg-green-50"
                                  : "border-red-200 bg-red-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                      Hóa đơn{" "}
                                      {new Date(
                                        invoice.ngay_tao
                                      ).toLocaleDateString("vi-VN", {
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>
                                          {invoice.ngay_tao
                                            ? new Date(
                                                invoice.ngay_tao
                                              ).toLocaleDateString("vi-VN")
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        <span className="font-medium">
                                          {(
                                            invoice.so_tien || 0
                                          ).toLocaleString("vi-VN")}
                                          ₫
                                        </span>
                                      </div>
                                      {invoice.trang_thai ===
                                        "da_thanh_toan" && (
                                        <div className="flex items-center">
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          <span>Đã thanh toán</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Breakdown preview */}
                                    {breakdown && (
                                      <div className="mt-2 flex items-center space-x-4 text-xs">
                                        <div className="flex items-center text-blue-600">
                                          <Home className="h-3 w-3 mr-1" />
                                          <span>
                                            Phòng:{" "}
                                            {formatCurrency(
                                              breakdown.tienPhong || 0
                                            )}
                                          </span>
                                        </div>
                                        {(breakdown.tienDien || 0) > 0 && (
                                          <div className="flex items-center text-yellow-600">
                                            <Zap className="h-3 w-3 mr-1" />
                                            <span>
                                              Điện:{" "}
                                              {formatCurrency(
                                                breakdown.tienDien
                                              )}
                                            </span>
                                          </div>
                                        )}
                                        {(breakdown.tienNuoc || 0) > 0 && (
                                          <div className="flex items-center text-cyan-600">
                                            <Droplets className="h-3 w-3 mr-1" />
                                            <span>
                                              Nước:{" "}
                                              {formatCurrency(
                                                breakdown.tienNuoc
                                              )}
                                            </span>
                                          </div>
                                        )}
                                        {(breakdown.tienDichVu || 0) > 0 && (
                                          <div className="flex items-center text-purple-600">
                                            <Wrench className="h-3 w-3 mr-1" />
                                            <span>
                                              DV:{" "}
                                              {formatCurrency(
                                                breakdown.tienDichVu
                                              )}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {getStatusBadge(invoice)}
                                  <div className="flex space-x-2">
                                    {invoice.trang_thai === "chua_tt" && (
                                      <button
                                        onClick={() =>
                                          handleViewDetails(invoice.id)
                                        }
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        title="Thanh toán"
                                      >
                                        Thanh toán
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleViewDetails(invoice.id)
                                      }
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Xem chi tiết"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                      title="Tải xuống"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        invoiceId={selectedInvoiceId}
        onPaymentSuccess={handleInvoicePaid}
      />
    </>
  );
}
