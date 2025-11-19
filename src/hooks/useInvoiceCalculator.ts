import { useState, useEffect } from "react";
import {
  InvoiceData,
  BangGia,
  HopDongInfo,
  RoomInfo,
} from "../types/invoice.types";
import {
  calculateInvoiceAmounts,
  createInitialInvoiceData,
} from "../utils/invoice.utils";
// @ts-ignore
import { getBangGia } from "../services/bang-gia.service";
// @ts-ignore
import { listHopDongByToaNha } from "../services/hop-dong.service";

interface UseInvoiceCalculatorProps {
  isOpen: boolean;
  room: RoomInfo | null;
  selectedHostel: any;
}

export function useInvoiceCalculator({
  isOpen,
  room,
  selectedHostel,
}: UseInvoiceCalculatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [bangGia, setBangGia] = useState<BangGia | null>(null);
  const [hopDong, setHopDong] = useState<HopDongInfo | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    createInitialInvoiceData()
  );

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen && room && selectedHostel) {
      loadData();
    }
  }, [isOpen, room, selectedHostel]);

  // Recalculate when bangGia changes (after it's loaded)
  useEffect(() => {
    if (bangGia && room && hopDong) {
      setInvoiceData(prev => {
        const calculations = calculateInvoiceAmounts(
          prev,
          bangGia,
          room?.gia_thue || 0
        );

        return {
          ...prev,
          tien_dien: calculations.tien_dien,
          tien_nuoc: calculations.tien_nuoc,
          tien_dich_vu: calculations.tien_dich_vu,
          tong_tien: calculations.tong_tien,
        };
      });
    }
  }, [
    bangGia?.gia_dich_vu,
    bangGia?.gia_dien,
    bangGia?.gia_nuoc,
    room?.gia_thue,
  ]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load bảng giá dùng chung
      const bangGiaData = await getBangGia();
      console.log("Loaded bangGia:", bangGiaData);
      console.log("gia_dich_vu:", bangGiaData?.gia_dich_vu);
      setBangGia(bangGiaData);

      // Load hợp đồng của phòng này
      let currentHopDong: any = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const hopDongList = await listHopDongByToaNha(selectedHostel.id);
        currentHopDong = hopDongList.find(
          (hd: any) =>
            hd.can_ho_id === (room?.id as any) && hd.trang_thai === "hieu_luc"
        );
        if (currentHopDong) break;
        // chờ dữ liệu vừa tạo đồng bộ xong
        await new Promise(res => setTimeout(res, 500));
      }
      setHopDong(currentHopDong);

      // Update invoice data với hop_dong_id và tính lại các khoản tiền
      setInvoiceData(prev => {
        const newData = {
          ...prev,
          hop_dong_id: currentHopDong?.id || prev.hop_dong_id,
        };

        // Tính lại các khoản tiền khi đã có bangGia
        if (bangGiaData && room) {
          const calculations = calculateInvoiceAmounts(
            newData,
            bangGiaData,
            room?.gia_thue || 0
          );

          console.log("Calculations result:", calculations);
          console.log("tien_dich_vu calculated:", calculations.tien_dich_vu);

          return {
            ...newData,
            tien_dien: calculations.tien_dien,
            tien_nuoc: calculations.tien_nuoc,
            tien_dich_vu: calculations.tien_dich_vu,
            tong_tien: calculations.tong_tien,
          };
        }

        return newData;
      });
    } catch (error) {
      console.error("Error loading data:", error);
      throw new Error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setInvoiceData(prev => {
      const newData = { ...prev, [field]: value };

      // Recalculate amounts when meter readings change
      if (bangGia) {
        const calculations = calculateInvoiceAmounts(
          newData,
          bangGia,
          room?.gia_thue || 0
        );

        return {
          ...newData,
          tien_dien: calculations.tien_dien,
          tien_nuoc: calculations.tien_nuoc,
          tien_dich_vu: calculations.tien_dich_vu,
          tong_tien: calculations.tong_tien,
        };
      }

      return newData;
    });
  };

  const resetInvoiceData = () => {
    setInvoiceData(createInitialInvoiceData());
    setBangGia(null);
    setHopDong(null);
  };

  return {
    // State
    isLoading,
    bangGia,
    hopDong,
    invoiceData,

    // Actions
    handleInputChange,
    resetInvoiceData,
    loadData,
  };
}
