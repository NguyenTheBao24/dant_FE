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
            gradientColors: 'from-slate-600 to-slate-700'
        },
        {
            iconSrc: muscle,
            title: 'Phòng gym',
            description: 'Thiết bị hiện đại, mở cửa 24/7',
            gradientColors: 'from-slate-600 to-slate-700'
        },
        {
            iconSrc: basket,
            title: 'Giặt ủi',
            description: 'Dịch vụ giặt ủi tận nơi',
            gradientColors: 'from-slate-600 to-slate-700'
        },
        {
            iconSrc: basket,
            title: 'Cửa hàng tiện lợi',
            description: 'Mở cửa 24/7 ngay tại tầng trệt',
            gradientColors: 'from-slate-600 to-slate-700'
        },
        {
            iconSrc: parking,
            title: 'Bãi đỗ xe',
            description: 'An toàn, có mái che, camera giám sát',
            gradientColors: 'from-slate-600 to-slate-700'
        },
        {
            iconSrc: padlock,
            title: 'An ninh',
            description: 'Bảo vệ 24/7, camera, thẻ từ',
            gradientColors: 'from-slate-600 to-slate-700'
        }
    ];

    return (
        <section id="amenities" className="relative py-24 overflow-hidden bg-white">
            <div className="container mx-auto px-4 relative z-10">
                {/* Tiêu đề phần */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-full px-6 py-2 mb-6">
                        <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                        <span className="text-slate-700 text-sm font-medium">Tiện ích đẳng cấp</span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                        Tiện Ích
                        <br />
                        <span className="text-slate-700">Chung</span>
                    </h3>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Trải nghiệm sống tiện nghi với đầy đủ dịch vụ cao cấp.
                        <br />
                        <span className="text-slate-500">Mọi thứ bạn cần đều có sẵn tại đây!</span>
                    </p>

                    {/* Đường trang trí */}
                    <div className="w-16 h-0.5 bg-slate-300 rounded-full mx-auto mt-8"></div>
                </div>

                {/* Lưới tiện ích */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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