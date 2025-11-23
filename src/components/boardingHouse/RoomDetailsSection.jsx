import RoomCard from './RoomCard';

// Import ảnh cho phòng đơn
import phongDon1 from '../../assets/anh_phong_don/anh1.jpg';
import phongDon2 from '../../assets/anh_phong_don/anh2.jpg';
import phongDon3 from '../../assets/anh_phong_don/anh3.jpg';
import phongDon4 from '../../assets/anh_phong_don/anh4.jpg';

// Import ảnh cho phòng đôi
import phongDoi1 from '../../assets/anh_phong_doi/anh1.jpg';
import phongDoi2 from '../../assets/anh_phong_doi/anh2.jpg';
import phongDoi3 from '../../assets/anh_phong_doi/anh3.jpg';
import phongDoi4 from '../../assets/anh_phong_doi/anh4.jpg';

// Import ảnh cho phòng VIP
import phongVip1 from '../../assets/phong_vip/anh1.jpg';
import phongVip2 from '../../assets/phong_vip/anh2.jpg';
import phongVip3 from '../../assets/phong_vip/anh3.jpg';
import phongVip4 from '../../assets/phong_vip/anh4.jpg';

const RoomDetailsSection = ({ onSetRoomType, onScrollToSection }) => {
    const roomDetails = [
        {
            id: 1,
            name: 'Phòng Đơn Tiêu Chuẩn',
            price: '3.500.000đ/tháng',
            area: '25m²',
            images: [
                <img src={phongDon1} alt="Phòng đơn 1" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDon2} alt="Phòng đơn 2" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDon3} alt="Phòng đơn 3" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDon4} alt="Phòng đơn 4" className="w-full h-full object-cover rounded-lg" />
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
                <img src={phongDoi1} alt="Phòng đôi 1" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDoi2} alt="Phòng đôi 2" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDoi3} alt="Phòng đôi 3" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongDoi4} alt="Phòng đôi 4" className="w-full h-full object-cover rounded-lg" />
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
                <img src={phongVip1} alt="Phòng VIP 1" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongVip2} alt="Phòng VIP 2" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongVip3} alt="Phòng VIP 3" className="w-full h-full object-cover rounded-lg" />,
                <img src={phongVip4} alt="Phòng VIP 4" className="w-full h-full object-cover rounded-lg" />
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
        <section id="rooms" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold text-slate-900 mb-4">
                        Các Loại Phòng Chi Tiết
                    </h3>
                    <div className="w-16 h-0.5 bg-slate-300 rounded-full mx-auto"></div>
                </div>

                <div className="space-y-0">
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