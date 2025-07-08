import logoHome from '../../assets/logoHome.png';
import internet from '../../assets/internet.png';
import padlock from '../../assets/padlock.png';
import muscle from '../../assets/muscle.png';
import basket from '../../assets/basket.png';
import { StatsGrid, HeroMainCard, PriceFloatingBadge } from '../shared';

const HeroSection = ({ onScrollToSection }) => {
    const heroServices = [
        {
            iconSrc: internet,
            label: "Wifi tốc độ cao",
            gradientColors: "from-blue-400 to-cyan-400"
        },
        {
            iconSrc: padlock,
            label: "An ninh 24/7",
            gradientColors: "from-green-400 to-emerald-400"
        },
        {
            iconSrc: muscle,
            label: "Hồ bơi & Gym",
            gradientColors: "from-purple-400 to-pink-400"
        },
        {
            iconSrc: basket,
            label: "Dịch vụ giặt ủi",
            gradientColors: "from-orange-400 to-red-400"
        }
    ];

    const handleScrollToSection = (sectionId) => {
        if (onScrollToSection) {
            onScrollToSection(sectionId);
        }
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Floating decorative shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white/20 rounded-full animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-12 h-12 border-2 border-purple-300/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce animation-delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                            <span className="text-sm font-medium">Đang có phòng trống</span>
                        </div>

                        <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                                Nhà Trọ
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                                Cao Cấp
                            </span>
                            <br />
                            <span className="text-5xl md:text-6xl bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                                Đẳng Cấp & Tiện Nghi
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                            Trải nghiệm không gian sống hiện đại với đầy đủ tiện ích.
                            <br />
                            <span className="text-purple-200">An ninh 24/7, wifi tốc độ cao, và dịch vụ chăm sóc tận tình.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={() => handleScrollToSection('rooms')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                            >
                                <span className="relative z-10">🏠 Xem phòng ngay</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button
                                onClick={() => handleScrollToSection('contact')}
                                className="group px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/50"
                            >
                                📞 Liên hệ tư vấn
                            </button>
                        </div>

                        {/* Stats - Using Shared Component */}
                        <StatsGrid />
                    </div>

                    <div className="relative">
                        {/* Main Card - Using Shared Component */}
                        <HeroMainCard
                            logo={logoHome}
                            logoAlt="Nhà Trọ Logo"
                            title="Phòng Trọ Hiện Đại"
                            services={heroServices}
                        />

                        {/* Floating price badge - Using Shared Component */}
                        <PriceFloatingBadge />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-2 opacity-80">Cuộn xuống</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 