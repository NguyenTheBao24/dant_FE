import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardingHouseShowcase = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    roomType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', contactForm);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({
        name: '',
        phone: '',
        email: '',
        message: '',
        roomType: ''
      });
    }, 3000);
  };

  const roomDetails = [
    {
      id: 1,
      name: 'Phòng Đơn Tiêu Chuẩn',
      price: '3.500.000đ/tháng',
      area: '25m²',
      images: ['🏠', '🛏️', '❄️', '📶'],
      features: [
        'Điều hòa 2 chiều',
        'Tủ lạnh mini',
        'Máy nước nóng',
        'Wifi miễn phí',
        'Giường đơn + tủ quần áo',
        'Bàn học riêng',
        'Cửa sổ thoáng mát'
      ],
      utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh'],
      deposit: '2 tháng tiền phòng',
      contract: 'Tối thiểu 6 tháng'
    },
    {
      id: 2,
      name: 'Phòng Đôi Cao Cấp',
      price: '5.000.000đ/tháng',
      area: '35m²',
      images: ['🏡', '🛏️🛏️', '❄️', '🌅'],
      features: [
        'Điều hòa inverter',
        'Tủ lạnh 200L',
        'Máy nước nóng',
        'Wifi tốc độ cao',
        '2 giường đơn + tủ riêng',
        'Ban công riêng',
        'Bàn học đôi',
        'Tủ bếp nhỏ'
      ],
      utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh', 'Cáp truyền hình'],
      deposit: '2 tháng tiền phòng',
      contract: 'Tối thiểu 6 tháng'
    },
    {
      id: 3,
      name: 'Phòng VIP Studio',
      price: '7.500.000đ/tháng',
      area: '45m²',
      images: ['🏘️', '🍳', '🛁', '🌟'],
      features: [
        'Điều hòa multi inverter',
        'Tủ lạnh 300L',
        'Máy nước nóng cao cấp',
        'Wifi fiber quang',
        'Giường đôi + sofa',
        'Bếp riêng đầy đủ',
        'Phòng tắm riêng',
        'Ban công lớn',
        'Máy giặt riêng'
      ],
      utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh', 'Cáp truyền hình', 'Bảo vệ 24/7'],
      deposit: '3 tháng tiền phòng',
      contract: 'Tối thiểu 12 tháng'
    }
  ];

  const amenities = [
    { icon: '🏊‍♂️', title: 'Hồ bơi chung', desc: 'Hồ bơi sạch sẽ, mở cửa từ 6:00-22:00' },
    { icon: '🏋️‍♂️', title: 'Phòng gym', desc: 'Thiết bị hiện đại, mở cửa 24/7' },
    { icon: '🧺', title: 'Giặt ủi', desc: 'Dịch vụ giặt ủi tận nơi' },
    { icon: '🛒', title: 'Cửa hàng tiện lợi', desc: 'Mở cửa 24/7 ngay tại tầng trệt' },
    { icon: '🚗', title: 'Bãi đỗ xe', desc: 'An toàn, có mái che, camera giám sát' },
    { icon: '🔒', title: 'An ninh', desc: 'Bảo vệ 24/7, camera, thẻ từ' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <span className="text-2xl">🏠</span>
              <div>
                <h1 className="text-xl font-bold text-blue-600">Nhà Trọ Cao Cấp</h1>
                <p className="text-sm text-gray-500">Chi tiết phòng trọ</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <span>📞 0123.456.789</span>
                <span>📧 contact@nhatro.com</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chi Tiết Phòng Trọ Cao Cấp
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Khám phá không gian sống hiện đại với đầy đủ tiện nghi và dịch vụ chất lượng cao
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm opacity-80">Phòng có sẵn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Hỗ trợ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm opacity-80">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Details Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Các Loại Phòng Chi Tiết
          </h3>

          <div className="space-y-12">
            {roomDetails.map((room, index) => (
              <div key={room.id} className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Room Images */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {room.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                          {img}
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{room.price}</div>
                      <div className="text-gray-600">Diện tích: {room.area}</div>
                    </div>
                  </div>
                </div>

                {/* Room Info */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{room.name}</h4>
                    
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-700 mb-3">Tiện nghi trong phòng:</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {room.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Dịch vụ bao gồm:</h5>
                        <ul className="space-y-1">
                          {room.utilities.map((utility, utilityIndex) => (
                            <li key={utilityIndex} className="text-gray-600 text-sm">• {utility}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Điều khoản:</h5>
                        <p className="text-gray-600 text-sm mb-1">Đặt cọc: {room.deposit}</p>
                        <p className="text-gray-600 text-sm">Hợp đồng: {room.contract}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setContactForm(prev => ({ ...prev, roomType: room.name }))}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Đặt phòng ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Tiện Ích Chung
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
                <div className="text-4xl mb-4">{amenity.icon}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{amenity.title}</h4>
                <p className="text-gray-600">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Để Lại Thông Tin Liên Hệ
            </h3>
            <p className="text-center text-gray-600 mb-8">
              Chúng tôi sẽ liên hệ với bạn trong vòng 24h để tư vấn và hỗ trợ xem phòng
            </p>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h4 className="text-2xl font-bold text-green-600 mb-2">
                  Cảm ơn bạn đã liên hệ!
                </h4>
                <p className="text-gray-600">
                  Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email (không bắt buộc)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Loại phòng quan tâm
                  </label>
                  <select
                    name="roomType"
                    value={contactForm.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại phòng bạn quan tâm</option>
                    <option value="Phòng Đơn Tiêu Chuẩn">Phòng Đơn Tiêu Chuẩn - 3.5M/tháng</option>
                    <option value="Phòng Đôi Cao Cấp">Phòng Đôi Cao Cấp - 5M/tháng</option>
                    <option value="Phòng VIP Studio">Phòng VIP Studio - 7.5M/tháng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Chia sẻ yêu cầu đặc biệt hoặc câu hỏi của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
                >
                  Gửi Thông Tin Liên Hệ
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Bằng việc gửi thông tin, bạn đồng ý với{' '}
                  <span className="text-blue-600 cursor-pointer">điều khoản sử dụng</span> và{' '}
                  <span className="text-blue-600 cursor-pointer">chính sách bảo mật</span> của chúng tôi.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Nhà Trọ Cao Cấp</h4>
              <p className="text-gray-300 mb-4">
                Cung cấp dịch vụ cho thuê phòng trọ chất lượng cao với đầy đủ tiện nghi.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:text-blue-400 transition">📘</span>
                <span className="text-2xl cursor-pointer hover:text-blue-400 transition">📷</span>
                <span className="text-2xl cursor-pointer hover:text-green-400 transition">💬</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Liên Hệ</h4>
              <div className="space-y-2 text-gray-300">
                <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
                <p>📞 0123.456.789</p>
                <p>📧 contact@nhatro.com</p>
                <p>🕒 Tư vấn 24/7</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Dịch Vụ</h4>
              <div className="space-y-2 text-gray-300">
                <p>• Cho thuê phòng trọ</p>
                <p>• Hỗ trợ chuyển nhà</p>
                <p>• Bảo trì sửa chữa</p>
                <p>• Dịch vụ vệ sinh</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nhà Trọ Cao Cấp. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BoardingHouseShowcase; 