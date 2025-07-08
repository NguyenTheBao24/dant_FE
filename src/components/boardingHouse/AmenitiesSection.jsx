import muscle from '../../assets/muscle.png';
import basket from '../../assets/basket.png';
import parking from '../../assets/parking.png';
import padlock from '../../assets/padlock.png';
import { ServiceCard } from '../shared';

const AmenitiesSection = () => {
    const amenities = [
        {
            iconSrc: muscle,
            title: 'Hồ bơi chung',
            description: 'Hồ bơi sạch sẽ, mở cửa từ 6:00-22:00',
            gradientColors: 'from-blue-400 to-cyan-500'
        },
        {
            iconSrc: muscle,
            title: 'Phòng gym',
            description: 'Thiết bị hiện đại, mở cửa 24/7',
            gradientColors: 'from-purple-400 to-pink-500'
        },
        {
            iconSrc: basket,
            title: 'Giặt ủi',
            description: 'Dịch vụ giặt ủi tận nơi',
            gradientColors: 'from-green-400 to-emerald-500'
        },
        {
            iconSrc: basket,
            title: 'Cửa hàng tiện lợi',
            description: 'Mở cửa 24/7 ngay tại tầng trệt',
            gradientColors: 'from-orange-400 to-red-500'
        },
        {
            iconSrc: parking,
            title: 'Bãi đỗ xe',
            description: 'An toàn, có mái che, camera giám sát',
            gradientColors: 'from-indigo-400 to-purple-500'
        },
        {
            iconSrc: padlock,
            title: 'An ninh',
            description: 'Bảo vệ 24/7, camera, thẻ từ',
            gradientColors: 'from-emerald-400 to-teal-500'
        }
    ];

    return (
        <section id="amenities" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Các phần tử nền trang trí */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            {/* Các hình học bay lơ lửng */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/6 w-16 h-16 border border-blue-300/30 rounded-full animate-float"></div>
                <div className="absolute top-3/4 right-1/5 w-12 h-12 border border-purple-300/30 rounded-lg transform rotate-45 animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-indigo-300/20 rounded-full animate-bounce animation-delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-blue-300/30 transform rotate-12 animate-float animation-delay-3000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Tiêu đề phần */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-6 py-2 mb-6 shadow-lg">
                        <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-gray-700 text-sm font-medium">Tiện ích đẳng cấp</span>
                    </div>

                    <h3 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                            Tiện Ích
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                            Chung
                        </span>
                    </h3>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Trải nghiệm sống tiện nghi với đầy đủ dịch vụ cao cấp.
                        <br />
                        <span className="text-indigo-600 font-medium">Mọi thứ bạn cần đều có sẵn tại đây!</span>
                    </p>

                    {/* Đường trang trí */}
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mx-auto mt-8"></div>
                </div>

                {/* Lưới tiện ích */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {amenities.map((amenity, index) => (
                        <ServiceCard
                            key={index}
                            index={index}
                            iconSrc={amenity.iconSrc}
                            title={amenity.title}
                            description={amenity.description}
                            gradientColors={amenity.gradientColors}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AmenitiesSection; 