import { useNavigate } from 'react-router-dom';
import bed from '../../assets/bed.png';
import bed2 from '../../assets/bed2.png';
import premium from '../../assets/premium.png';



const RoomCard = ({ icon, title, description, features, price, gradient, isVIP = false, onClick }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition ${isVIP ? 'border-2 border-yellow-400' : ''}`}>
      <div className={`h-48 ${gradient} flex items-center justify-center`}>
        <img
          src={icon}
          alt="Nhà Trọ Logo"
          className="w-7 h-7"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          {isVIP && (
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">HOT</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2 text-gray-600 mb-6">
          {features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
        <div className="text-2xl font-bold text-blue-600 mb-4">{price}</div>
        <button
          onClick={onClick}
          className={`w-full py-3 rounded-lg transition ${isVIP
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

const RoomTypes = () => {
  const navigate = useNavigate();

  const roomData = [
    {
      icon: bed,
      title: 'Phòng Đơn',
      description: 'Phòng đơn rộng rãi, đầy đủ nội thất cơ bản',
      features: [
        'Diện tích: 25m²',
        'Giường đơn, tủ quần áo',
        'Bàn học, ghế',
        'WC riêng'
      ],
      price: '3.500.000đ/tháng',
      gradient: 'bg-gradient-to-br from-green-400 to-blue-500',
      isVIP: false
    },
    {
      icon: bed2,
      title: 'Phòng Đôi',
      description: 'Phòng đôi thoải mái cho 2 người',
      features: [
        'Diện tích: 35m²',
        '2 giường đơn, tủ lạnh',
        'Bàn học, tủ quần áo',
        'WC riêng, balcony'
      ],
      price: '5.000.000đ/tháng',
      gradient: 'bg-gradient-to-br from-purple-400 to-pink-500',
      isVIP: false
    },
    {
      icon: premium,
      title: 'Phòng VIP',
      description: 'Phòng VIP cao cấp với đầy đủ tiện nghi',
      features: [
        'Diện tích: 45m²',
        'Giường đôi, TV Smart 55"',
        'Tủ lạnh, máy lạnh',
        'Bếp mini, WC cao cấp'
      ],
      price: '7.500.000đ/tháng',
      gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      isVIP: true
    }
  ];

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Các Loại Phòng</h2>
          <p className="text-xl text-gray-600">Lựa chọn phòng phù hợp với nhu cầu của bạn</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roomData.map((room, index) => (
            <RoomCard
              key={index}
              icon={room.icon}
              title={room.title}
              description={room.description}
              features={room.features}
              price={room.price}
              gradient={room.gradient}
              isVIP={room.isVIP}
              onClick={() => navigate('/boarding-house')}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTypes; 