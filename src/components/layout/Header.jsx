import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoHome from '../../assets/logoHome.png';

const Header = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollToSection = (sectionId) => {
    // Nếu không ở trang chủ, điều hướng về trang chủ trước
    if (location.pathname !== '/') {
      navigate('/');
      // Đợi điều hướng hoàn thành rồi scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else if (onScrollToSection) {
      // Nếu ở trang chủ, sử dụng hàm scroll
      onScrollToSection(sectionId);
    } else {
      // Dự phòng: scroll trực tiếp nếu không có hàm onScrollToSection
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      handleScrollToSection('hero');
    }
  };

  return (
    <header className="fixed w-full top-0 z-50">
      {/* Nền glass morphism với viền gradient */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-indigo-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo với styling nâng cao */}
            <button
              onClick={handleLogoClick}
              className="group flex items-center space-x-4 hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img
                  src={logoHome}
                  alt="Nhà Trọ Logo"
                  className="relative w-16 h-16 rounded-full shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Nhà Trọ Cao Cấp
                </h1>
                <p className="text-sm bg-gradient-to-r from-gray-600 to-indigo-600 bg-clip-text text-transparent font-medium">
                  Premium Boarding House
                </p>
              </div>
            </button>

            {/* Navigation desktop với styling hiện đại */}
            <nav className="hidden md:flex items-center space-x-2">
              {[
                { label: 'Trang chủ', section: 'hero' },
                { label: 'Các loại phòng', section: 'rooms' },
                { label: 'Tiện ích', section: 'amenities' },
                { label: 'Liên hệ', section: 'contact' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleScrollToSection(item.section)}
                  className="group relative px-4 py-2 text-gray-700 hover:text-white font-medium transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                  <span className="relative z-10">
                    {item.label}
                  </span>
                </button>
              ))}

              {/* Nút đăng nhập với styling đặc biệt */}
              <button
                onClick={() => navigate('/auth/login')}
                className="group relative ml-4 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">
                  Đăng nhập
                </span>
              </button>
            </nav>

            {/* Nút menu mobile với styling */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 transition-all duration-300 shadow-lg"
            >
              <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu mobile nâng cao */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 py-6 bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl">
              <div className="flex flex-col space-y-3">
                {[
                  { label: 'Trang chủ', section: 'hero' },
                  { label: 'Các loại phòng', section: 'rooms' },
                  { label: 'Tiện ích', section: 'amenities' },
                  { label: 'Liên hệ', section: 'contact' }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleScrollToSection(item.section)}
                    className="group flex items-center justify-center px-4 py-3 mx-2 text-gray-700 hover:text-white font-medium transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="px-2 pt-4">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 