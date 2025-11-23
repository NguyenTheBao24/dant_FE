import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';
import logoHome from '../../assets/logoHome.png';

const Footer = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  // Liên kết mạng xã hội
  const socialLinks = {
    facebook: 'https://www.facebook.com/bao250603',
    telegram: 'https://t.me/bao250603', // Thay đổi username cho phù hợp
    twitter: 'https://twitter.com/bao250603' // Thay đổi username cho phù hợp
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logoHome}
                alt="Nhà Trọ Logo"
                className="w-8 h-8"
              />
              <div>
                <h3 className="text-lg font-bold">Nhà Trọ Cao Cấp</h3>
                <p className="text-sm text-slate-400">Premium Boarding House</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Mang đến không gian sống hiện đại, tiện nghi và an toàn cho mọi cư dân.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><button onClick={() => handleScrollToSection('hero')} className="hover:text-white transition-colors duration-200">Trang chủ</button></li>
              <li><button onClick={() => handleScrollToSection('rooms')} className="hover:text-white transition-colors duration-200">Các loại phòng</button></li>
              <li><button onClick={() => handleScrollToSection('amenities')} className="hover:text-white transition-colors duration-200">Tiện ích</button></li>
              <li><button onClick={() => handleScrollToSection('contact')} className="hover:text-white transition-colors duration-200">Liên hệ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-500 mt-1" />
                <span>P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội (gần bến xe Yên Nghĩa)</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPhone} className="text-slate-500" />
                <span>0869346831</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-slate-500" />
                <span>anhbaonb24@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faClock} className="text-slate-500" />
                <span>Hỗ trợ 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-3 mb-4">
              <button
                onClick={() => handleSocialClick(socialLinks.facebook)}
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors duration-200"
                title="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-white text-sm" />
              </button>
              <button
                onClick={() => handleSocialClick(socialLinks.telegram)}
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors duration-200"
                title="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-white text-sm" />
              </button>
              <button
                onClick={() => handleSocialClick(socialLinks.twitter)}
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors duration-200"
                title="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-white text-sm" />
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
              >
                Đăng nhập hệ thống
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 Nhà Trọ Cao Cấp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 