import { useState, useEffect } from 'react'
import { InvoiceData, BangGia, HopDongInfo, RoomInfo } from '../types/invoice.types'
import { calculateInvoiceAmounts, createInitialInvoiceData } from '../utils/invoice.utils'
// @ts-ignore
import { getBangGiaByToaNha } from '../services/bang-gia.service'
// @ts-ignore
import { listHopDongByToaNha } from '../services/hop-dong.service'

interface UseInvoiceCalculatorProps {
    isOpen: boolean
    room: RoomInfo | null
    selectedHostel: any
}

export function useInvoiceCalculator({ isOpen, room, selectedHostel }: UseInvoiceCalculatorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [bangGia, setBangGia] = useState<BangGia | null>(null)
    const [hopDong, setHopDong] = useState<HopDongInfo | null>(null)
    const [invoiceData, setInvoiceData] = useState<InvoiceData>(createInitialInvoiceData())

    // Load data when dialog opens
    useEffect(() => {
        if (isOpen && room && selectedHostel) {
            loadData()
        }
    }, [isOpen, room, selectedHostel])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Load bảng giá
            const bangGiaData = await getBangGiaByToaNha(selectedHostel.id)
            setBangGia(bangGiaData)

            // Load hợp đồng của phòng này
            const hopDongList = await listHopDongByToaNha(selectedHostel.id)
            const currentHopDong = hopDongList.find((hd: any) =>
                hd.can_ho_id === room.id && hd.trang_thai === 'hieu_luc'
            )
            setHopDong(currentHopDong)

            if (currentHopDong) {
                setInvoiceData(prev => ({
                    ...prev,
                    hop_dong_id: currentHopDong.id
                }))
            }

        } catch (error) {
            console.error('Error loading data:', error)
            throw new Error('Không thể tải dữ liệu. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setInvoiceData(prev => {
            const newData = { ...prev, [field]: value }

            // Recalculate amounts when meter readings change
            if (bangGia) {
                const calculations = calculateInvoiceAmounts(
                    newData,
                    bangGia,
                    room?.gia_thue || 0
                )

                return {
                    ...newData,
                    tien_dien: calculations.tien_dien,
                    tien_nuoc: calculations.tien_nuoc,
                    tien_dich_vu: calculations.tien_dich_vu,
                    tong_tien: calculations.tong_tien
                }
            }

            return newData
        })
    }

    const resetInvoiceData = () => {
        setInvoiceData(createInitialInvoiceData())
        setBangGia(null)
        setHopDong(null)
    }

    return {
        // State
        isLoading,
        bangGia,
        hopDong,
        invoiceData,

        // Actions
        handleInputChange,
        resetInvoiceData,
        loadData
    }
}
