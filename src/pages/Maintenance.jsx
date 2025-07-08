import { useNavigate } from 'react-router-dom';

const Maintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Đầu trang */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ← Quay lại Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Bảo Trì & Sửa Chữa</h1>
          </div>

          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            + Báo cáo sự cố
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bảo Trì & Sửa Chữa</h2>
          <p className="text-gray-600 mb-8">Trang quản lý bảo trì đang được phát triển...</p>

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
              onClick={() => navigate('/bills')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance; 