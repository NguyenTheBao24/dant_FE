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
            gradientColors: "from-slate-600 to-slate-700"
        },
        {
            iconSrc: padlock,
            label: "An ninh 24/7",
            gradientColors: "from-slate-600 to-slate-700"
        },
        {
            iconSrc: muscle,
            label: "Hồ bơi & Gym",
            gradientColors: "from-slate-600 to-slate-700"
        },
        {
            iconSrc: basket,
            label: "Dịch vụ giặt ủi",
            gradientColors: "from-slate-600 to-slate-700"
        }
    ];

    const handleScrollToSection = (sectionId) => {
        if (onScrollToSection) {
            onScrollToSection(sectionId);
        }
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white">
            {/* Nền tối giản với pattern nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>

            <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-slate-900">
                        <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-full px-6 py-2 mb-8">
                            <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                            <span className="text-sm font-medium text-slate-700">Đang có phòng trống</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-slate-900">
                            Nhà Trọ
                            <br />
                            <span className="text-slate-700">Cao Cấp</span>
                            <br />
                            <span className="text-4xl md:text-5xl text-slate-600 font-semibold">
                                Đẳng Cấp & Tiện Nghi
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-xl">
                            Trải nghiệm không gian sống hiện đại với đầy đủ tiện ích.
                            <br />
                            <span className="text-slate-500">An ninh 24/7, wifi tốc độ cao, và dịch vụ chăm sóc tận tình.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <button
                                onClick={() => handleScrollToSection('rooms')}
                                className="px-8 py-4 bg-slate-900 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-lg"
                            >
                                Xem phòng ngay
                            </button>

                            <button
                                onClick={() => handleScrollToSection('contact')}
                                className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold text-lg rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                            >
                                Liên hệ tư vấn
                            </button>
                        </div>

                        {/* Thống kê - Sử dụng Shared Component */}
                        <StatsGrid />
                    </div>

                    <div className="relative">
                        {/* Card chính - Sử dụng Shared Component */}
                        <HeroMainCard
                            logo={logoHome}
                            logoAlt="Nhà Trọ Logo"
                            title="Phòng Trọ Hiện Đại"
                            services={heroServices}
                        />

                        {/* Badge giá bay lơ lửng - Sử dụng Shared Component */}
                        <PriceFloatingBadge />
                    </div>
                </div>
            </div>

            {/* Chỉ báo cuộn */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400">
                <div className="flex flex-col items-center">
                    <span className="text-xs mb-2 text-slate-500">Cuộn xuống</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 