import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏠</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
                <p className="text-xs text-gray-600">Premium Boarding House</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Trang chủ
              </button>
              <button
                onClick={() => scrollToSection('rooms')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Phòng trọ
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Dịch vụ
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Liên hệ
              </button>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-600 hover:text-blue-600 transition text-left"
                >
                  Trang chủ
                </button>
                <button
                  onClick={() => scrollToSection('rooms')}
                  className="text-gray-600 hover:text-blue-600 transition text-left"
                >
                  Phòng trọ
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-600 hover:text-blue-600 transition text-left"
                >
                  Dịch vụ
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-600 hover:text-blue-600 transition text-left"
                >
                  Liên hệ
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-fit"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                Nhà Trọ Cao Cấp
                <span className="block text-blue-600">Đẳng Cấp & Tiện Nghi</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Trải nghiệm không gian sống hiện đại với đầy đủ tiện ích. 
                An ninh 24/7, wifi tốc độ cao, và dịch vụ chăm sóc tận tình.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/boarding-house')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
                >
                  Xem phòng ngay
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Phòng Trọ Hiện Đại</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <span>🌐</span>
                      <span>Wifi tốc độ cao</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>🔒</span>
                      <span>An ninh 24/7</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>🏊‍♀️</span>
                      <span>Hồ bơi & Gym</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>🧺</span>
                      <span>Dịch vụ giặt ủi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section id="rooms" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Các Loại Phòng</h2>
            <p className="text-xl text-gray-600">Lựa chọn phòng phù hợp với nhu cầu của bạn</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Single Room */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Phòng Đơn</h3>
                <p className="text-gray-600 mb-4">Phòng đơn rộng rãi, đầy đủ nội thất cơ bản</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Diện tích: 25m²</li>
                  <li>• Giường đơn, tủ quần áo</li>
                  <li>• Bàn học, ghế</li>
                  <li>• WC riêng</li>
                </ul>
                <div className="text-2xl font-bold text-blue-600 mb-4">3.500.000đ/tháng</div>
                <button
                  onClick={() => navigate('/boarding-house')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>

            {/* Double Room */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Phòng Đôi</h3>
                <p className="text-gray-600 mb-4">Phòng đôi thoải mái cho 2 người</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Diện tích: 35m²</li>
                  <li>• 2 giường đơn, tủ lạnh</li>
                  <li>• Bàn học, tủ quần áo</li>
                  <li>• WC riêng, balcony</li>
                </ul>
                <div className="text-2xl font-bold text-blue-600 mb-4">5.000.000đ/tháng</div>
                <button
                  onClick={() => navigate('/boarding-house')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>

            {/* VIP Room */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border-2 border-yellow-400">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-6xl">👑</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">Phòng VIP</h3>
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">HOT</span>
                </div>
                <p className="text-gray-600 mb-4">Phòng VIP cao cấp với đầy đủ tiện nghi</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Diện tích: 45m²</li>
                  <li>• Giường đôi, TV Smart 55"</li>
                  <li>• Tủ lạnh, máy lạnh</li>
                  <li>• Bếp mini, WC cao cấp</li>
                </ul>
                <div className="text-2xl font-bold text-blue-600 mb-4">7.500.000đ/tháng</div>
                <button
                  onClick={() => navigate('/boarding-house')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Dịch Vụ Tiện Ích</h2>
            <p className="text-xl text-gray-600">Trải nghiệm sống tiện nghi với đầy đủ dịch vụ</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🧹</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Dọn dẹp vệ sinh</h3>
              <p className="text-gray-600">Dịch vụ dọn dẹp phòng hàng tuần, thay ga gối</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bảo trì sửa chữa</h3>
              <p className="text-gray-600">Sửa chữa nhanh chóng các thiết bị trong phòng</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bãi đỗ xe</h3>
              <p className="text-gray-600">Bãi đỗ xe an toàn, có camera giám sát 24/7</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Internet cao cấp</h3>
              <p className="text-gray-600">Wifi tốc độ cao, ổn định cho học tập và làm việc</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">An ninh 24/7</h3>
              <p className="text-gray-600">Bảo vệ và camera giám sát toàn khu vực</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🏊‍♀️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tiện ích giải trí</h3>
              <p className="text-gray-600">Hồ bơi, phòng gym, khu BBQ cho cư dân</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ</h2>
            <p className="text-xl text-gray-600">Sẵn sàng hỗ trợ bạn 24/7</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">📞</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Điện thoại</h3>
                  <p className="text-gray-600">
                    Hotline: 0123.456.789<br />
                    Zalo: 0987.654.321
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">
                    info@nhatrocaocap.com<br />
                    support@nhatrocaocap.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Đăng ký tham quan</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Ghi chú thêm"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🏠</span>
                <div>
                  <h3 className="text-lg font-bold">Nhà Trọ Cao Cấp</h3>
                  <p className="text-sm text-gray-400">Premium Boarding House</p>
                </div>
              </div>
              <p className="text-gray-400">
                Mang đến không gian sống hiện đại, tiện nghi và an toàn cho mọi cư dân.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-white transition">Trang chủ</button></li>
                <li><button onClick={() => navigate('/boarding-house')} className="hover:text-white transition">Phòng trọ</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Dịch vụ</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition">Liên hệ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Thông tin liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 123 Đường ABC, Quận XYZ, TP.HCM</li>
                <li>📞 0123.456.789</li>
                <li>✉️ info@nhatrocaocap.com</li>
                <li>🕒 Hỗ trợ 24/7</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Theo dõi chúng tôi</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <span>📘</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500 transition">
                  <span>🐦</span>
                </div>
                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-700 transition">
                  <span>📷</span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Đăng nhập hệ thống
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nhà Trọ Cao Cấp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 