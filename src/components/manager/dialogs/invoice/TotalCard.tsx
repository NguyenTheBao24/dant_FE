import { Card, CardContent } from "@/components/admin/ui/card";
import { Calculator } from "lucide-react";
import {
  InvoiceData,
  BangGia,
  RoomInfo,
} from "../../../../types/invoice.types";

interface TotalCardProps {
  invoiceData: InvoiceData;
  bangGia: BangGia;
  room: RoomInfo;
}

export function TotalCard({ invoiceData, bangGia, room }: TotalCardProps) {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-lg font-semibold text-green-800">
              Tổng cộng
            </span>
          </div>
          <span className="text-2xl font-bold text-green-700">
            {invoiceData.tong_tien.toLocaleString("vi-VN")}₫
          </span>
        </div>

        {/* Chi tiết các khoản */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Tiền phòng:</span>
            <span>{(room?.gia_thue || 0).toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tiền điện:</span>
            <span>{invoiceData.tien_dien.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tiền nước:</span>
            <span>{invoiceData.tien_nuoc.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Dịch vụ dùng chung:</span>
            <span>
              {invoiceData.tien_dich_vu.toLocaleString("vi-VN")}₫
              {(() => {
                const giaDichVu =
                  bangGia?.gia_dich_vu ||
                  (bangGia?.gia_internet || 0) +
                    (bangGia?.gia_ve_sinh || 0) +
                    (bangGia?.gia_gui_xe || 0);
                return (
                  giaDichVu > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({giaDichVu.toLocaleString("vi-VN")}₫/tháng)
                    </span>
                  )
                );
              })()}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-green-800">
            <span>Tổng cộng:</span>
            <span>{invoiceData.tong_tien.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
