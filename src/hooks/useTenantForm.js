import { useState, useRef, useEffect } from 'react'

export function useTenantForm() {
    const [editForm, setEditForm] = useState({
        name: "",
        roomNumber: "",
        address: "",
        phone: "",
        emergencyPhone: "",
        rentMonths: "",
    })

    // State cho form chỉnh sửa
    const [editRoomSearchTerm, setEditRoomSearchTerm] = useState("")
    const [showEditRoomSuggestions, setShowEditRoomSuggestions] = useState(false)
    const [selectedEditRoom, setSelectedEditRoom] = useState(null)
    const editRoomInputRef = useRef(null)

    // Xử lý chọn phòng cho form chỉnh sửa
    const handleEditRoomSelect = (room) => {
        setSelectedEditRoom(room)
        setEditRoomSearchTerm(room.room_number)
        setShowEditRoomSuggestions(false)
    }

    // Xử lý thay đổi input cho form chỉnh sửa
    const handleEditRoomInputChange = (value) => {
        setEditRoomSearchTerm(value)
        setShowEditRoomSuggestions(true)
        setSelectedEditRoom(null)
    }

    // Xử lý click outside để đóng suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editRoomInputRef.current && !editRoomInputRef.current.contains(event.target)) {
                setShowEditRoomSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const initializeEditForm = (tenant, availableRooms) => {
        setEditForm({
            name: tenant.name || "",
            roomNumber: tenant.room_number || tenant.roomNumber || "", // Ưu tiên backend field
            address: tenant.address || "",
            phone: tenant.phone || "",
            emergencyPhone: tenant.emergency_phone || tenant.emergencyPhone || "", // Ưu tiên backend field
            rentMonths: String(tenant.months_rented ?? tenant.rentMonths ?? ""), // Ưu tiên backend field
        })

        // Khởi tạo phòng đã chọn nếu có
        const currentRoomNumber = tenant.room_number || tenant.roomNumber || ""
        if (currentRoomNumber) {
            setEditRoomSearchTerm(currentRoomNumber)
            // Tìm phòng hiện tại trong danh sách
            const currentRoom = availableRooms.find(room => room.room_number === currentRoomNumber)
            if (currentRoom) {
                setSelectedEditRoom(currentRoom)
            }
        } else {
            setEditRoomSearchTerm("")
            setSelectedEditRoom(null)
        }
    }

    const resetEditForm = () => {
        setEditRoomSearchTerm("")
        setSelectedEditRoom(null)
        setShowEditRoomSuggestions(false)
    }

    return {
        editForm,
        setEditForm,
        editRoomSearchTerm,
        showEditRoomSuggestions,
        setShowEditRoomSuggestions,
        selectedEditRoom,
        editRoomInputRef,
        handleEditRoomSelect,
        handleEditRoomInputChange,
        initializeEditForm,
        resetEditForm
    }
}
