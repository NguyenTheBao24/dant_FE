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
      {/* Nền tối giản */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src={logoHome}
                alt="Nhà Trọ Logo"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Nhà Trọ Cao Cấp
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Premium Boarding House
                </p>
              </div>
            </button>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Trang chủ', section: 'hero' },
                { label: 'Các loại phòng', section: 'rooms' },
                { label: 'Tiện ích', section: 'amenities' },
                { label: 'Liên hệ', section: 'contact' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleScrollToSection(item.section)}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 rounded-lg hover:bg-slate-50"
                >
                  {item.label}
                </button>
              ))}

              {/* Nút đăng nhập */}
              <button
                onClick={() => navigate('/auth/login')}
                className="ml-4 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200"
              >
                Đăng nhập
              </button>
            </nav>

            {/* Nút menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col space-y-1">
                {[
                  { label: 'Trang chủ', section: 'hero' },
                  { label: 'Các loại phòng', section: 'rooms' },
                  { label: 'Tiện ích', section: 'amenities' },
                  { label: 'Liên hệ', section: 'contact' }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleScrollToSection(item.section)}
                    className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors duration-200 rounded-lg text-left"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="px-4 pt-3 border-t border-slate-200 mt-2">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200"
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