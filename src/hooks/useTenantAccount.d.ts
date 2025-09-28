export function useTenantAccount(): {
    hasAccount: (tenant: any) => boolean
    createAccount: (tenant: any, onSuccess: (updatedTenant: any) => void) => Promise<void>
    isCreating: boolean
}
