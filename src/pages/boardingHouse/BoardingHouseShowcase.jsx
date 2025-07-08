import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import layout components
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// Import boarding house components
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
    roomType: ''
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
        roomType: ''
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
      {/* Header */}
      <Header onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Room Details Section */}
      <RoomDetailsSection
        onSetRoomType={handleSetRoomType}
        onScrollToSection={scrollToSection}
      />

      {/* Amenities Section */}
      <AmenitiesSection />

      {/* Contact Form Section */}
      <ContactFormSection
        contactForm={contactForm}
        setContactForm={setContactForm}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
      />

      {/* Footer */}
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
};

export default BoardingHouseShowcase; 