export function useTenantForm(): {
    editForm: any
    setEditForm: (form: any) => void
    editRoomSearchTerm: string
    showEditRoomSuggestions: boolean
    setShowEditRoomSuggestions: (show: boolean) => void
    selectedEditRoom: any
    editRoomInputRef: any
    handleEditRoomSelect: (room: any) => void
    handleEditRoomInputChange: (value: string) => void
    initializeEditForm: (tenant: any, availableRooms: any[]) => void
    resetEditForm: () => void
}
