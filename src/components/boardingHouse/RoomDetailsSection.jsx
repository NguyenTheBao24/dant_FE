import RoomCard from './RoomCard';
import logoHome from '../../assets/logoHome.png';
import bed from '../../assets/bed.png';
import bed2 from '../../assets/bed2.png';
import premium from '../../assets/premium.png';
import internet from '../../assets/internet.png';
import basket from '../../assets/basket.png';
import broom from '../../assets/broom.png';
import support from '../../assets/support.png';

const RoomDetailsSection = ({ onSetRoomType, onScrollToSection }) => {
    const roomDetails = [
        {
            id: 1,
            name: 'Phòng Đơn Tiêu Chuẩn',
            price: '3.500.000đ/tháng',
            area: '25m²',
            images: [
                <img src={logoHome} alt="Home" className="w-12 h-12" />,
                <img src={bed} alt="Bed" className="w-12 h-12" />,
                <img src={support} alt="Air Conditioning" className="w-12 h-12" />,
                <img src={internet} alt="Wifi" className="w-12 h-12" />
            ],
            features: [
                'Điều hòa 2 chiều',
                'Tủ lạnh mini',
                'Máy nước nóng',
                'Wifi miễn phí',
                'Giường đơn + tủ quần áo',
                'Bàn học riêng',
                'Cửa sổ thoáng mát'
            ],
            utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh'],
            deposit: '2 tháng tiền phòng',
            contract: 'Tối thiểu 6 tháng'
        },
        {
            id: 2,
            name: 'Phòng Đôi Cao Cấp',
            price: '5.000.000đ/tháng',
            area: '35m²',
            images: [
                <img src={premium} alt="Premium Building" className="w-12 h-12" />,
                <div className="flex space-x-1">
                    <img src={bed2} alt="Double Bed" className="w-8 h-8" />
                    <img src={bed2} alt="Double Bed" className="w-8 h-8" />
                </div>,
                <img src={support} alt="Air Conditioning" className="w-12 h-12" />,
                <img src={premium} alt="Premium" className="w-12 h-12" />
            ],
            features: [
                'Điều hòa inverter',
                'Tủ lạnh 200L',
                'Máy nước nóng',
                'Wifi tốc độ cao',
                '2 giường đơn + tủ riêng',
                'Ban công riêng',
                'Bàn học đôi',
                'Tủ bếp nhỏ'
            ],
            utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh', 'Cáp truyền hình'],
            deposit: '2 tháng tiền phòng',
            contract: 'Tối thiểu 6 tháng'
        },
        {
            id: 3,
            name: 'Phòng VIP Studio',
            price: '7.500.000đ/tháng',
            area: '45m²',
            images: [
                <img src={premium} alt="VIP Building" className="w-12 h-12" />,
                <img src={basket} alt="Kitchen" className="w-12 h-12" />,
                <img src={broom} alt="Bathroom" className="w-12 h-12" />,
                <img src={premium} alt="VIP Premium" className="w-12 h-12" />
            ],
            features: [
                'Điều hòa multi inverter',
                'Tủ lạnh 300L',
                'Máy nước nóng cao cấp',
                'Wifi fiber quang',
                'Giường đôi + sofa',
                'Bếp riêng đầy đủ',
                'Phòng tắm riêng',
                'Ban công lớn',
                'Máy giặt riêng'
            ],
            utilities: ['Điện', 'Nước', 'Internet', 'Vệ sinh', 'Cáp truyền hình', 'Bảo vệ 24/7'],
            deposit: '3 tháng tiền phòng',
            contract: 'Tối thiểu 12 tháng'
        }
    ];

    const handleBookRoom = (roomName) => {
        onSetRoomType(roomName);
    };

    return (
        <section id="rooms" className="py-16">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Các Loại Phòng Chi Tiết
                </h3>

                <div className="space-y-12">
                    {roomDetails.map((room, index) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            index={index}
                            onBookRoom={handleBookRoom}
                            onScrollToSection={onScrollToSection}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomDetailsSection; 