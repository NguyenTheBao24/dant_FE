import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { ManagerInvoiceDetailDialog } from "@/components/manager/dialogs/ManagerInvoiceDetailDialog";
// @ts-ignore
import { listHoaDonByToaNha, updateHoaDon } from "@/services/hoa-don.service";
import {
  Receipt,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Eye,
  Calendar,
  X,
} from "lucide-react";

interface InvoicesPageProps {
  selectedHostel: any;
}

interface InvoiceRecord {
  id: string;
  so_tien: number;
  ngay_tao?: string;
  ngay_thanh_toan?: string | null;
  trang_thai: string;
  hop_dong?: {
    id: string;
    khach_thue?: { ho_ten?: string | null };
    can_ho?: { so_can?: string | null };
  };
}

// @ts-ignore
import { getPaymentStatusLabel, getPaymentStatusColor } from "@/utils/translations"

export function InvoicesPage({ selectedHostel }: InvoicesPageProps) {
  const currentMonthValue = new Date().toISOString().slice(0, 7);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [monthFilter, setMonthFilter] = useState<"all" | string>(
    currentMonthValue
  );
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null
  );
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    if (!selectedHostel?.id) {
      setInvoices([]);
      return;
    }
    loadInvoices();
  }, [selectedHostel?.id]);

  async function loadInvoices() {
    if (!selectedHostel?.id) return;
    setIsLoading(true);
    try {
      const data = await listHoaDonByToaNha(selectedHostel.id);
      setInvoices(data || []);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }

  function formatCurrency(amount?: number) {
    if (!amount) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "Không xác định";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const tenantName =
        invoice.hop_dong?.khach_thue?.ho_ten?.toLowerCase() || "";
      const roomNumber = invoice.hop_dong?.can_ho?.so_can?.toLowerCase() || "";
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchValue) ||
        tenantName.includes(searchValue) ||
        roomNumber.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || invoice.trang_thai === statusFilter;

      const matchesMonth =
        monthFilter === "all" ||
        (invoice.ngay_tao || "").startsWith(monthFilter as string);

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [invoices, searchTerm, statusFilter, monthFilter]);

  const unpaidInvoices = filteredInvoices.filter(
    invoice => invoice.trang_thai !== "da_thanh_toan"
  );

  async function handleUpdateStatus(invoiceId: string, nextStatus: string) {
    try {
      const payload = {
        trang_thai: nextStatus,
        ngay_thanh_toan:
          nextStatus === "da_thanh_toan" ? new Date().toISOString() : null,
      };
      const updated = await updateHoaDon(invoiceId, payload);
      setInvoices(prev =>
        prev.map(invoice =>
          invoice.id === invoiceId ? { ...invoice, ...updated } : invoice
        )
      );
    } catch (error: any) {
      console.error("Failed to update invoice status:", error);
      alert(error?.message || "Không thể cập nhật trạng thái hóa đơn");
    }
  }

  const handleViewDetails = (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedInvoice(null);
  };

  if (!selectedHostel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Chưa chọn khu trọ
          </h3>
          <p className="text-gray-500">
            Vui lòng chọn một khu trọ để xem danh sách hóa đơn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý hóa đơn
          </h2>
          <p className="text-gray-600 mt-1">
            Danh sách hóa đơn của khu trọ{" "}
            <span className="font-semibold">
              {selectedHostel.ten_toa ||
                selectedHostel.ten ||
                selectedHostel.name ||
                "Không có tên"}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center"
          onClick={loadInvoices}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Tổng hóa đơn
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {isLoading ? "..." : filteredInvoices.length}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Đang chờ thanh toán
                </p>
                <p className="text-2xl font-bold text-yellow-700">
                  {isLoading ? "..." : unpaidInvoices.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Bộ lọc
              </CardTitle>
            </div>
            {(searchTerm || statusFilter !== "all" || monthFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setMonthFilter("all");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Search className="h-4 w-4" />
                <span>Tìm kiếm</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mã hóa đơn, khách thuê, phòng..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Trạng thái</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm appearance-none cursor-pointer"
                value={statusFilter}
                onChange={event =>
                  setStatusFilter(event.target.value as "all" | string)
                }
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="chua_tt">Chưa thanh toán</option>
                <option value="da_thanh_toan">Đã thanh toán</option>
                <option value="qua_han">Quá hạn</option>
              </select>
            </div>

            {/* Month Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Tháng/Năm</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="month"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm cursor-pointer"
                  value={monthFilter === "all" ? "" : monthFilter}
                  onChange={event => setMonthFilter(event.target.value || "all")}
                />
                {monthFilter !== "all" && (
                  <button
                    onClick={() => setMonthFilter("all")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all" || monthFilter !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Đang lọc:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Tìm kiếm: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {getPaymentStatusLabel(statusFilter)}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {monthFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Tháng: {monthFilter}
                    <button
                      onClick={() => setMonthFilter("all")}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không có hóa đơn phù hợp
              </h3>
              <p className="text-gray-500">
                Thử đổi bộ lọc hoặc kiểm tra lại thời gian
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invoice.id}
                        </h3>
                        <Badge
                          className={
                            getPaymentStatusColor(invoice.trang_thai)
                          }
                        >
                          {getPaymentStatusLabel(invoice.trang_thai)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Khách thuê:{" "}
                        <span className="font-medium">
                          {invoice.hop_dong?.khach_thue?.ho_ten ||
                            "Không xác định"}
                        </span>{" "}
                        | Phòng:{" "}
                        <span className="font-medium">
                          {invoice.hop_dong?.can_ho?.so_can || "N/A"}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          Tạo ngày:{" "}
                          <span className="font-medium text-gray-700">
                            {formatDate(invoice.ngay_tao)}
                          </span>
                        </span>
                        {invoice.ngay_thanh_toan && (
                          <span>
                            Thanh toán:{" "}
                            <span className="font-medium text-gray-700">
                              {formatDate(invoice.ngay_thanh_toan)}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(invoice.so_tien)}
                      </p>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(invoice)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ManagerInvoiceDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        invoiceId={selectedInvoice?.id || null}
        invoiceMeta={selectedInvoice}
        selectedHostel={selectedHostel}
      />
    </div>
  );
}
