import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các component layout
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// Import các component boarding house
import {
  HeroSection,
  RoomDetailsSection,
  AmenitiesSection,
  ContactFormSection
} from '../../components/boardingHouse';

const BoardingHouseShowcase = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    roomType: '',
    buildingName: '',
    buildingAddress: '',
    buildingPhone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        roomType: '',
        buildingName: '',
        buildingAddress: '',
        buildingPhone: ''
      });
    }, 3000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetRoomType = (roomName) => {
    setContactForm(prev => ({ ...prev, roomType: roomName }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Đầu trang */}
      <Header onScrollToSection={scrollToSection} />

      {/* Phần Hero */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Phần chi tiết phòng */}
      <RoomDetailsSection
        onSetRoomType={handleSetRoomType}
        onScrollToSection={scrollToSection}
      />

      {/* Phần tiện ích */}
      <AmenitiesSection />

      {/* Phần form liên hệ */}
      <ContactFormSection
        contactForm={contactForm}
        setContactForm={setContactForm}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
      />

      {/* Chân trang */}
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
};

export default BoardingHouseShowcase; 