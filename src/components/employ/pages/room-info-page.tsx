import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import {
	Home,
	Zap,
	Droplet,
	Wifi,
	Sparkles,
	ParkingCircle,
	AlertCircle,
	Loader2
} from 'lucide-react'
import { getBangGia } from '@/services/bang-gia.service'

interface RoomInfoPageProps {
	userContracts: any[]
}

export function RoomInfoPage({ userContracts }: RoomInfoPageProps) {
	const [bangGia, setBangGia] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadBangGia = async () => {
			try {
				setIsLoading(true)
				const data = await getBangGia()
				setBangGia(data)
			} catch (error) {
				console.error('Error loading bang gia:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadBangGia()
	}, [])

	// Lấy hợp đồng hiệu lực đầu tiên
	const activeContract = userContracts?.find(
		(contract) => contract.trang_thai === 'hieu_luc'
	)
	const room = activeContract?.can_ho

	// Tính giá dịch vụ
	const giaDichVu =
		bangGia?.gia_dich_vu ||
		(bangGia?.gia_internet || 0) +
			(bangGia?.gia_ve_sinh || 0) +
			(bangGia?.gia_gui_xe || 0)

	const formatCurrency = (amount: number) => {
		if (!amount) return '0₫'
		return amount.toLocaleString('vi-VN') + '₫'
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<Loader2 className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
					<p className="text-gray-600">Đang tải thông tin...</p>
				</div>
			</div>
		)
	}

	if (!activeContract || !room) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
						Chưa có thông tin phòng
					</h3>
					<p className="text-gray-500">
						Bạn chưa có hợp đồng thuê phòng hiệu lực
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-gray-900">
						Thông tin phòng
					</h2>
					<p className="text-gray-600 mt-1">
						Chi tiết về phòng và bảng giá dịch vụ
					</p>
				</div>
			</div>

			{/* Thông tin phòng */}
			<Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
				<CardHeader>
					<CardTitle className="flex items-center text-green-800">
						<Home className="h-5 w-5 mr-2" />
						Thông tin phòng thuê
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-white rounded-lg p-4 border border-green-200">
							<div className="flex items-center mb-2">
								<Home className="h-5 w-5 text-green-600 mr-2" />
								<span className="text-sm font-medium text-gray-600">
									Số phòng
								</span>
							</div>
							<p className="text-2xl font-bold text-green-700">
								{room.so_can || 'N/A'}
							</p>
						</div>

						<div className="bg-white rounded-lg p-4 border border-green-200">
							<div className="flex items-center mb-2">
								<Home className="h-5 w-5 text-green-600 mr-2" />
								<span className="text-sm font-medium text-gray-600">
									Diện tích
								</span>
							</div>
							<p className="text-2xl font-bold text-green-700">
								{room.dien_tich ? `${room.dien_tich}m²` : 'N/A'}
							</p>
						</div>

						<div className="bg-white rounded-lg p-4 border border-green-200">
							<div className="flex items-center mb-2">
								<Home className="h-5 w-5 text-green-600 mr-2" />
								<span className="text-sm font-medium text-gray-600">
									Giá thuê/tháng
								</span>
							</div>
							<p className="text-2xl font-bold text-green-700">
								{formatCurrency(room.gia_thue || 0)}
							</p>
						</div>
					</div>

					{/* Thông tin hợp đồng */}
					<div className="mt-6 pt-6 border-t border-green-200">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span className="text-sm font-medium text-gray-600">
									Ngày bắt đầu hợp đồng:
								</span>
								<p className="text-gray-900 font-semibold mt-1">
									{activeContract.ngay_bat_dau
										? new Date(
												activeContract.ngay_bat_dau
										  ).toLocaleDateString('vi-VN')
										: 'N/A'}
								</p>
							</div>
							<div>
								<span className="text-sm font-medium text-gray-600">
									Ngày kết thúc hợp đồng:
								</span>
								<p className="text-gray-900 font-semibold mt-1">
									{activeContract.ngay_ket_thuc
										? new Date(
												activeContract.ngay_ket_thuc
										  ).toLocaleDateString('vi-VN')
										: 'N/A'}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bảng giá dịch vụ */}
			<Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
				<CardHeader>
					<CardTitle className="flex items-center text-blue-800">
						<Sparkles className="h-5 w-5 mr-2" />
						Bảng giá dịch vụ
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Giá điện */}
						<div className="bg-white rounded-lg p-5 border border-blue-200 hover:shadow-md transition-shadow">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
										<Zap className="h-6 w-6 text-yellow-600" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">
											Giá điện
										</h4>
										<p className="text-sm text-gray-600">
											Giá trên mỗi kWh (số điện)
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold text-yellow-600">
										{formatCurrency(bangGia?.gia_dien || 0)}
									</p>
									<p className="text-xs text-gray-500">
										/kWh
									</p>
								</div>
							</div>
						</div>

						{/* Giá nước */}
						<div className="bg-white rounded-lg p-5 border border-blue-200 hover:shadow-md transition-shadow">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
										<Droplet className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">
											Giá nước
										</h4>
										<p className="text-sm text-gray-600">
											Giá trên mỗi m³ (khối nước)
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold text-blue-600">
										{formatCurrency(bangGia?.gia_nuoc || 0)}
									</p>
									<p className="text-xs text-gray-500">/m³</p>
								</div>
							</div>
						</div>

						{/* Dịch vụ */}
						<div className="bg-white rounded-lg p-5 border border-blue-200">
							<div className="mb-4">
								<h4 className="font-semibold text-gray-900 mb-1">
									Dịch vụ phòng
								</h4>
								<p className="text-sm text-gray-600">
									Các dịch vụ được tính cố định hàng tháng
								</p>
							</div>

							<div className="space-y-3">
								{/* Internet */}
								{bangGia?.gia_internet && (
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<Wifi className="h-5 w-5 text-purple-600 mr-3" />
											<span className="text-gray-700">
												Internet/WiFi
											</span>
										</div>
										<span className="font-semibold text-gray-900">
											{formatCurrency(
												bangGia.gia_internet
											)}
											<span className="text-xs font-normal text-gray-500 ml-1">
												/tháng
											</span>
										</span>
									</div>
								)}

								{/* Vệ sinh */}
								{bangGia?.gia_ve_sinh && (
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<Sparkles className="h-5 w-5 text-pink-600 mr-3" />
											<span className="text-gray-700">
												Vệ sinh
											</span>
										</div>
										<span className="font-semibold text-gray-900">
											{formatCurrency(
												bangGia.gia_ve_sinh
											)}
											<span className="text-xs font-normal text-gray-500 ml-1">
												/tháng
											</span>
										</span>
									</div>
								)}

								{/* Gửi xe */}
								{bangGia?.gia_gui_xe && (
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<ParkingCircle className="h-5 w-5 text-indigo-600 mr-3" />
											<span className="text-gray-700">
												Gửi xe
											</span>
										</div>
										<span className="font-semibold text-gray-900">
											{formatCurrency(bangGia.gia_gui_xe)}
											<span className="text-xs font-normal text-gray-500 ml-1">
												/tháng
											</span>
										</span>
									</div>
								)}

								{/* Tổng dịch vụ */}
								<div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 mt-4">
									<span className="font-semibold text-purple-900">
										Tổng dịch vụ/tháng
									</span>
									<span className="text-2xl font-bold text-purple-700">
										{formatCurrency(giaDichVu)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Thông tin tổng hợp */}
			<Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
				<CardHeader>
					<CardTitle className="flex items-center text-purple-800">
						<Home className="h-5 w-5 mr-2" />
						Tổng chi phí ước tính
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-white rounded-lg p-6 border border-purple-200">
						<div className="space-y-3 mb-4">
							<div className="flex justify-between text-gray-700">
								<span>Tiền phòng:</span>
								<span className="font-medium">
									{formatCurrency(room.gia_thue || 0)}
								</span>
							</div>
							<div className="flex justify-between text-gray-700">
								<span>Dịch vụ cố định:</span>
								<span className="font-medium">
									{formatCurrency(giaDichVu)}
								</span>
							</div>
							<div className="flex justify-between text-gray-700 text-sm">
								<span className="italic">
									Điện (tính theo số sử dụng):
								</span>
								<span className="italic text-gray-500">
									{formatCurrency(bangGia?.gia_dien || 0)}
									/kWh
								</span>
							</div>
							<div className="flex justify-between text-gray-700 text-sm">
								<span className="italic">
									Nước (tính theo số sử dụng):
								</span>
								<span className="italic text-gray-500">
									{formatCurrency(bangGia?.gia_nuoc || 0)}
									/m³
								</span>
							</div>
						</div>
						<div className="pt-4 border-t border-purple-200">
							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold text-purple-900">
									Tổng cố định hàng tháng:
								</span>
								<span className="text-2xl font-bold text-purple-700">
									{formatCurrency(
										(room.gia_thue || 0) + giaDichVu
									)}
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-2">
								* Chưa bao gồm điện và nước (tính theo số sử
								dụng thực tế)
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

