import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant' // tenant, landlord
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
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    // Simulate registration
    console.log('Register:', formData);
    // Redirect to login after successful registration
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Đăng Ký Tài Khoản</h2>
          <p className="text-gray-500 mt-2">Tạo tài khoản để bắt đầu!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ và tên"
            />
          </div>

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
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Loại tài khoản
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tenant">Người thuê trọ</option>
              <option value="landlord">Chủ trọ</option>
            </select>
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" required className="text-blue-600 rounded" />
            <span className="ml-2 text-sm text-gray-600">
              Tôi đồng ý với{' '}
              <span className="text-blue-600 cursor-pointer">điều khoản sử dụng</span> và{' '}
              <span className="text-blue-600 cursor-pointer">chính sách bảo mật</span>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
          >
            Đăng Ký
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng nhập ngay
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

export default Register; 