// Test script để kiểm tra bang-gia service
import { getBangGiaByToaNha, upsertBangGia } from './src/services/bang-gia.service.js'

async function testBangGia() {
    try {
        console.log('Testing bang-gia service...')

        // Test với một tòa nhà giả định
        const testToaNhaId = 1

        console.log('1. Testing getBangGiaByToaNha...')
        try {
            const existing = await getBangGiaByToaNha(testToaNhaId)
            console.log('Existing prices:', existing)
        } catch (error) {
            console.log('No existing prices found (expected for new hostel)')
        }

        console.log('2. Testing upsertBangGia (create new)...')
        const testData = {
            gia_dien: 3000,
            gia_nuoc: 15000,
            gia_dich_vu: 200000
        }

        const result = await upsertBangGia(testToaNhaId, testData)
        console.log('Create result:', result)

        console.log('3. Testing upsertBangGia (update existing)...')
        const updateData = {
            gia_dien: 3500,
            gia_nuoc: 18000,
            gia_dich_vu: 250000
        }

        const updateResult = await upsertBangGia(testToaNhaId, updateData)
        console.log('Update result:', updateResult)

        console.log('✅ All tests passed!')

    } catch (error) {
        console.error('❌ Test failed:', error)
    }
}

// Chạy test nếu file được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
    testBangGia()
}

export { testBangGia }
