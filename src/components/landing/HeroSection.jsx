import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/logoHome.png';
import internet from '../../assets/internet.png';
import padlock from '../../assets/padlock.png';
import muscle from '../../assets/muscle.png';
import basket from '../../assets/basket.png';
const HeroSection = ({ onScrollToSection }) => {
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
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

            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-0  transition duration-300">
              <div className="text-center">
                <div className="text-6xl mb-4 flex justify-center items-center">
                  <img
                    src={logoHome}
                    alt="Nhà Trọ Logo"
                    className="w-20 h-20"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Phòng Trọ Hiện Đại</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <img
                      src={internet}
                      alt="Nhà Trọ Logo"
                      className="w-7 h-7"
                    />
                    <span>Wifi tốc độ cao</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={padlock}
                      alt="padlock Logo"
                      className="w-7 h-7"
                    />
                    <span>An ninh 24/7</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <img
                      src={muscle}
                      alt="muscle Logo"
                      className="w-7 h-7"
                    />
                    <span>Hồ bơi & Gym</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <img
                      src={basket}
                      alt="basket Logo"
                      className="w-7 h-7"
                    />
                    <span>Dịch vụ giặt ủi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 