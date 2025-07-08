import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    { icon: '🏠', title: 'Tổng số phòng', value: '50', change: '+2', color: 'blue' },
    { icon: '👥', title: 'Người thuê', value: '45', change: '+5', color: 'green' },
    { icon: '💰', title: 'Doanh thu tháng', value: '180M', change: '+12%', color: 'yellow' },
    { icon: '🔧', title: 'Yêu cầu bảo trì', value: '3', change: '-2', color: 'red' }
  ];

  const menuItems = [
    { icon: '🏠', title: 'Dashboard', path: '/home', active: true },
    { icon: '🏘️', title: 'Quản lý phòng', path: '/rooms' },
    { icon: '👥', title: 'Quản lý người thuê', path: '/tenants' },
    { icon: '💰', title: 'Quản lý hóa đơn', path: '/bills' },
    { icon: '🔧', title: 'Bảo trì sửa chữa', path: '/maintenance' },
    { icon: '⚙️', title: 'Cài đặt', path: '/settings' }
  ];

  const recentActivities = [
    { id: 1, type: 'new_tenant', message: 'Nguyễn Văn A đã thuê phòng 101', time: '2 giờ trước' },
    { id: 2, type: 'payment', message: 'Thanh toán phòng 205 đã được xác nhận', time: '4 giờ trước' },
    { id: 3, type: 'maintenance', message: 'Yêu cầu sửa chữa phòng 301 đã hoàn thành', time: '1 ngày trước' },
    { id: 4, type: 'new_room', message: 'Phòng 107 đã được thêm vào hệ thống', time: '2 ngày trước' }
  ];

  const handleLogout = () => {
    // Xóa dữ liệu người dùng
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Thanh bên */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} md:w-64`}>
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <span className="text-2xl">🏠</span>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
              <h1 className="text-lg font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>

          {/* Mục menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition ${item.active
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${isSidebarOpen ? 'block' : 'hidden'} md:block font-medium`}>
                  {item.title}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Phần người dùng */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
                <p className="font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Chủ trọ</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
            >
              <span>🚪</span>
              <span className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        {/* Đầu trang */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/boarding-house')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Xem trang giới thiệu
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung dashboard */}
        <main className="flex-1 p-6">
          {/* Lưới thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.change} so với tháng trước
                    </p>
                  </div>
                  <div className={`text-3xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hoạt động gần đây */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hành động nhanh */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/rooms')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <p className="text-sm font-medium">Thêm phòng mới</p>
                </button>
                <button
                  onClick={() => navigate('/tenants')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-center"
                >
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-sm font-medium">Thêm người thuê</p>
                </button>
                <button
                  onClick={() => navigate('/bills')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition text-center"
                >
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-sm font-medium">Tạo hóa đơn</p>
                </button>
                <button
                  onClick={() => navigate('/maintenance')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition text-center"
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <p className="text-sm font-medium">Báo cáo sự cố</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home; 