import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoHome from '../../assets/logoHome.png';

const Header = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollToSection = (sectionId) => {
    // If not on landing page, navigate to landing page first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (onScrollToSection) {
      // If on landing page, use the scroll function
      onScrollToSection(sectionId);
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
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition"
          >
            <img
              src={logoHome}
              alt="Nhà Trọ Logo"
              className="w-20 h-20"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Nhà Trọ Cao Cấp</h1>
              <p className="text-xs text-gray-600">Premium Boarding House</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleScrollToSection('hero')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigation('/boarding-house')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Phòng trọ
            </button>
            <button
              onClick={() => handleScrollToSection('services')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Dịch vụ
            </button>
            <button
              onClick={() => handleScrollToSection('contact')}
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
                onClick={() => handleScrollToSection('hero')}
                className="text-gray-600 hover:text-blue-600 transition text-left"
              >
                Trang chủ
              </button>
              <button
                onClick={() => handleNavigation('/boarding-house')}
                className="text-gray-600 hover:text-blue-600 transition text-left"
              >
                Phòng trọ
              </button>
              <button
                onClick={() => handleScrollToSection('services')}
                className="text-gray-600 hover:text-blue-600 transition text-left"
              >
                Dịch vụ
              </button>
              <button
                onClick={() => handleScrollToSection('contact')}
                className="text-gray-600 hover:text-blue-600 transition text-left"
              >
                Liên hệ
              </button>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-fit"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 