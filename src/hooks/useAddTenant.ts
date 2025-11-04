import { useState, useEffect, useRef } from 'react'
import { Room, TenantFormData, TenantPayload } from '../types/tenant.types'
import { filterRooms, generateContractInfo, createInitialFormData, getErrorMessage } from '../utils/tenant.utils'
// @ts-ignore
import { listAvailableCanHoByToaNha, updateCanHoTrangThai, determineRoomType } from '../services/can-ho.service'
// @ts-ignore
import { createKhachThue } from '../services/khach-thue.service'
// @ts-ignore
import { createHopDong } from '../services/hop-dong.service'

interface UseAddTenantProps {
    selectedHostel?: any
    onAddTenant: (payload: TenantPayload) => void
    onContractCreated?: (data: {
        hopDong: any
        khachThue: any
        room: Room
        contractInfo: { startDate: string, endDate: string }
        hostel?: any
    }) => void
}

export function useAddTenant({ selectedHostel, onAddTenant, onContractCreated }: UseAddTenantProps) {
    const [availableRooms, setAvailableRooms] = useState<Room[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [roomSearchTerm, setRoomSearchTerm] = useState("")
    const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [formData, setFormData] = useState<TenantFormData>(createInitialFormData())
    const roomInputRef = useRef<HTMLDivElement>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Load available rooms when selectedHostel changes
    useEffect(() => {
        async function loadAvailableRooms() {
            if (!selectedHostel?.id) {
                setAvailableRooms([])
                return
            }

            setIsLoadingRooms(true)
            try {
                const rooms = await listAvailableCanHoByToaNha(selectedHostel?.id)
                const mappedRooms: Room[] = rooms.map((room: any) => ({
                    id: room.id,
                    room_number: room.so_can,
                    room_type: determineRoomType(room.dien_tich, room.gia_thue),
                    rent_amount: room.gia_thue,
                    status: room.trang_thai === 'trong' ? 'available' : 'occupied',
                    hostel_id: room.toa_nha_id
                }))
                setAvailableRooms(mappedRooms)
            } catch (error) {
                console.error('Failed to load available rooms:', error)
                setAvailableRooms([])
            } finally {
                setIsLoadingRooms(false)
            }
        }

        loadAvailableRooms()
    }, [selectedHostel?.id])

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roomInputRef.current && !roomInputRef.current.contains(event.target as Node)) {
                setShowRoomSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Filter rooms based on search term
    const filteredRooms = filterRooms(availableRooms, roomSearchTerm)

    // Handle room selection
    const handleRoomSelect = (room: Room) => {
        if (room.status !== 'available') {
            alert(`Phòng ${room.room_number} đã có người thuê. Vui lòng chọn phòng khác.`)
            return
        }

        setSelectedRoom(room)
        setRoomSearchTerm(room.room_number)
        setShowRoomSuggestions(false)
    }

    // Handle room input change
    const handleRoomInputChange = (value: string) => {
        setRoomSearchTerm(value)
        setShowRoomSuggestions(true)
        setSelectedRoom(null)
    }

    // Handle form field change
    const handleFormFieldChange = (field: keyof TenantFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Reset form
    const resetForm = () => {
        setRoomSearchTerm("")
        setSelectedRoom(null)
        setShowRoomSuggestions(false)
        setFormData(createInitialFormData())
    }

    // Handle save tenant
    const handleSave = async () => {
        if (isSaving) return
        setIsSaving(true)
        try {
            // Create tenant data
            const khachThueData: any = {
                ho_ten: formData.name,
                sdt: formData.phone,
            }

            // Add optional fields if they have values
            if (formData.email && formData.email.trim()) {
                khachThueData.email = formData.email.trim()
            }
            if (formData.cccd && formData.cccd.trim()) {
                khachThueData.cccd = formData.cccd.trim()
            }

            const newKhachThue = await createKhachThue(khachThueData)

            if (!newKhachThue?.id) {
                alert('Không thể tạo thông tin khách thuê')
                return
            }

            // Create rental contract
            const contractInfo = generateContractInfo(formData.rentMonths)
            const newHopDong = await createHopDong({
                can_ho_id: selectedRoom!.id,
                khach_thue_id: newKhachThue.id,
                ngay_bat_dau: contractInfo.startDate,
                ngay_ket_thuc: contractInfo.endDate,
                trang_thai: 'hieu_luc'
            })

            if (!newHopDong?.id) {
                alert('Không thể tạo hợp đồng thuê')
                return
            }

            // Update room status to "occupied"
            await updateCanHoTrangThai(selectedRoom!.id, 'da_thue')

            // Call callback to update UI
            const payload: TenantPayload = {
                name: formData.name,
                roomNumber: selectedRoom!.room_number,
                address: formData.address,
                phone: formData.phone,
                rentMonths: formData.rentMonths,
                roomId: selectedRoom!.id,
                roomType: selectedRoom!.room_type,
                rentAmount: selectedRoom!.rent_amount,
                khachThueId: newKhachThue.id,
                hopDongId: newHopDong.id
            }

            onAddTenant(payload)

            // Callback để hiển thị hợp đồng HTML
            try {
                onContractCreated && onContractCreated({
                    hopDong: newHopDong,
                    khachThue: newKhachThue,
                    room: selectedRoom!,
                    contractInfo,
                    hostel: selectedHostel
                })
            } catch { }

            // Thành công: reset form, không chặn UI bằng alert
            resetForm()

        } catch (error) {
            console.error('Failed to create rental contract:', error)
            const errorMessage = getErrorMessage(error)
            alert(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    return {
        // State
        availableRooms,
        isLoadingRooms,
        roomSearchTerm,
        showRoomSuggestions,
        selectedRoom,
        formData,
        filteredRooms,
        roomInputRef,

        // Actions
        handleRoomSelect,
        handleRoomInputChange,
        handleFormFieldChange,
        handleSave,
        resetForm,
        isSaving
    }
}
