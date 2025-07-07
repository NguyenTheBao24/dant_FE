import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    console.log('Login:', formData);
    // Redirect to dashboard after successful login
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Đăng Nhập</h2>
          <p className="text-gray-500 mt-2">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="text-blue-600 rounded" />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng ký ngay
            </button>
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => navigate('/boarding-house')}
              className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Xem phòng trọ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 