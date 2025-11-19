import { useState, useEffect } from 'react'
import { listAvailableCanHoByToaNha, determineRoomType } from '@/services/can-ho.service'

export function useRooms(selectedHostel) {
    const [availableRooms, setAvailableRooms] = useState([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)

    useEffect(() => {
        async function loadAvailableRooms() {
            if (!selectedHostel?.id) {
                setAvailableRooms([])
                return
            }

            setIsLoadingRooms(true)
            try {
                const rooms = await listAvailableCanHoByToaNha(selectedHostel?.id)
                // Map can_ho data to expected format
                const mappedRooms = rooms.map((room) => ({
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

    return {
        availableRooms,
        isLoadingRooms
    }
}
