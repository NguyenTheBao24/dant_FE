import { useNavigate } from 'react-router-dom';

const Bills = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Hóa Đơn</h1>
          </div>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            + Tạo hóa đơn mới
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản Lý Hóa Đơn</h2>
          <p className="text-gray-600 mb-8">Trang quản lý hóa đơn đang được phát triển...</p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/rooms')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Quản lý phòng
            </button>
            <button
              onClick={() => navigate('/tenants')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Người thuê
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bills; 