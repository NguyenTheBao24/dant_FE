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
    <footer className="bg-gray-800 text-white py-12">
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
              <li><button onClick={() => handleScrollToSection('hero')} className="hover:text-white transition">Trang chủ</button></li>
              <li><button onClick={() => handleScrollToSection('rooms')} className="hover:text-white transition">Các loại phòng</button></li>
              <li><button onClick={() => handleScrollToSection('amenities')} className="hover:text-white transition">Tiện ích</button></li>
              <li><button onClick={() => handleScrollToSection('contact')} className="hover:text-white transition">Liên hệ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                <span>P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội (gần bến xe Yên Nghĩa)</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPhone} className="text-green-400" />
                <span>0869346831</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-purple-400" />
                <span>anhbaonb24@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
                <span>Hỗ trợ 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleSocialClick(socialLinks.facebook)}
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition"
                title="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-white" />
              </button>
              <button
                onClick={() => handleSocialClick(socialLinks.telegram)}
                className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition"
                title="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-white" />
              </button>
              <button
                onClick={() => handleSocialClick(socialLinks.twitter)}
                className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500 transition"
                title="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-white" />
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập hệ thống
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Nhà Trọ Cao Cấp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 