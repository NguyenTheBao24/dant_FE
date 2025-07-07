import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tenants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const tenants = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      room: '101',
      rentPrice: '3.500.000',
      startDate: '2024-01-15',
      status: 'active',
      deposit: '7.000.000'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@email.com',
      room: '103',
      rentPrice: '5.000.000',
      startDate: '2024-02-01',
      status: 'active',
      deposit: '10.000.000'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0923456789',
      email: 'levanc@email.com',
      room: '203',
      rentPrice: '7.500.000',
      startDate: '2024-01-10',
      status: 'active',
      deposit: '15.000.000'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      phone: '0934567890',
      email: 'phamthid@email.com',
      room: null,
      rentPrice: null,
      startDate: null,
      status: 'pending',
      deposit: '5.000.000'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang thuê';
      case 'pending': return 'Chờ xác nhận';
      case 'inactive': return 'Đã chuyển đi';
      default: return 'Không xác định';
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.room && tenant.room.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ← Quay lại Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Người Thuê</h1>
          </div>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            + Thêm người thuê mới
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, số điện thoại, email, số phòng..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                Xuất danh sách
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng số người thuê</p>
                <p className="text-2xl font-bold text-gray-800">45</p>
                <p className="text-sm text-green-600">+3 so với tháng trước</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Đang thuê</p>
                <p className="text-2xl font-bold text-gray-800">42</p>
                <p className="text-sm text-gray-500">93% tỷ lệ lấp đầy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
                <p className="text-sm text-yellow-600">Cần xem xét</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tenants List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin cá nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiền thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">ID: #{tenant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.phone}</div>
                      <div className="text-sm text-gray-500">{tenant.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.room ? `#${tenant.room}` : 'Chưa có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.rentPrice ? `${tenant.rentPrice}đ` : 'Chưa có'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cọc: {tenant.deposit}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tenant.startDate || 'Chưa có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                        {getStatusText(tenant.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                        <button className="text-green-600 hover:text-green-900">Sửa</button>
                        <button className="text-red-600 hover:text-red-900">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Action */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate('/bills')}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
            title="Tạo hóa đơn"
          >
            <span className="text-xl">💰</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tenants; 