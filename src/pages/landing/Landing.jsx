import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/landing/HeroSection';
import RoomTypes from '../../components/landing/RoomTypes';
import ServicesSection from '../../components/landing/ServicesSection';
import ContactSection from '../../components/landing/ContactSection';
import Footer from '../../components/layout/Footer';


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
      <Header onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* Room Types Section */}
      <RoomTypes />

      {/* Services Section */}
      <ServicesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
};

export default Landing; 