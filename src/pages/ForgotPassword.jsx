import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mô phỏng gửi email đặt lại mật khẩu
    console.log('Reset password for:', email);
    setIsSubmitted(true);

    // Tự động chuyển hướng sau 3 giây
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Đầu trang */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Quên Mật Khẩu</h2>
          <p className="text-gray-500 mt-2">Nhập email để khôi phục mật khẩu</p>
        </div>

        {!isSubmitted ? (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email đã đăng ký
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nhập email của bạn"
              />
              <p className="text-sm text-gray-500 mt-2">
                Chúng tôi sẽ gửi link khôi phục mật khẩu đến email này
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105"
            >
              Gửi Link Khôi Phục
            </button>
          </form>
        ) : (
          /* Thông báo thành công */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Email đã được gửi!
            </h3>
            <p className="text-gray-600 mb-4">
              Chúng tôi đã gửi link khôi phục mật khẩu đến email <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
              <br />
              Đang chuyển hướng về trang đăng nhập...
            </p>
          </div>
        )}

        {/* Chân trang */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Nhớ lại mật khẩu?{' '}
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
              onClick={() => navigate('/register')}
              className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50 transition"
            >
              Đăng ký mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 