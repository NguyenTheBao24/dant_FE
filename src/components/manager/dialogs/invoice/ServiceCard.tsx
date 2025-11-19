import { Card, CardContent, CardHeader } from "@/components/admin/ui/card";
import { Wifi } from "lucide-react";
import { InvoiceData, BangGia } from "../../../../types/invoice.types";

interface ServiceCardProps {
  invoiceData: InvoiceData;
  bangGia: BangGia;
}

export function ServiceCard({ invoiceData, bangGia }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Wifi className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-semibold">Dịch vụ dùng chung</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-purple-700 font-medium">
                Internet + Trông xe + Bảo vệ
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Dịch vụ chung cho toàn tòa nhà
              </p>
              {(() => {
                const giaDichVu =
                  bangGia?.gia_dich_vu ||
                  (bangGia?.gia_internet || 0) +
                    (bangGia?.gia_ve_sinh || 0) +
                    (bangGia?.gia_gui_xe || 0);
                return (
                  giaDichVu > 0 && (
                    <p className="text-xs text-purple-500 mt-1">
                      Giá dịch vụ: {giaDichVu.toLocaleString("vi-VN")}₫/tháng
                    </p>
                  )
                );
              })()}
            </div>
            <span className="text-xl font-bold text-purple-700">
              {invoiceData.tien_dich_vu.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
