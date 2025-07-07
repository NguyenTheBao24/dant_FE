import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const rooms = [
    { id: 101, type: 'Phòng đơn', price: '3.500.000', status: 'occupied', tenant: 'Nguyễn Văn A', area: '25m²' },
    { id: 102, type: 'Phòng đơn', price: '3.500.000', status: 'available', tenant: null, area: '25m²' },
    { id: 103, type: 'Phòng đôi', price: '5.000.000', status: 'occupied', tenant: 'Trần Thị B', area: '35m²' },
    { id: 201, type: 'Phòng VIP', price: '7.500.000', status: 'maintenance', tenant: null, area: '45m²' },
    { id: 202, type: 'Phòng đôi', price: '5.000.000', status: 'available', tenant: null, area: '35m²' },
    { id: 203, type: 'Phòng VIP', price: '7.500.000', status: 'occupied', tenant: 'Lê Văn C', area: '45m²' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Trống';
      case 'occupied': return 'Đã thuê';
      case 'maintenance': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.id.toString().includes(searchTerm) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.tenant && room.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phòng</h1>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Thêm phòng mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo số phòng, loại phòng, tên người thuê..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="available">Phòng trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Đang bảo trì</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">50</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng số phòng</p>
                <p className="font-bold text-gray-800">50 phòng</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phòng trống</p>
                <p className="font-bold text-gray-800">3 phòng</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold">45</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Đã thuê</p>
                <p className="font-bold text-gray-800">45 phòng</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Đang bảo trì</p>
                <p className="font-bold text-gray-800">2 phòng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diện tích
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">#{room.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{room.price}đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                        {getStatusText(room.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {room.tenant || 'Chưa có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                      <button className="text-green-600 hover:text-green-900">Sửa</button>
                      <button className="text-red-600 hover:text-red-900">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 