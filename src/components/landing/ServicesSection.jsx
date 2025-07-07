import internet from '../../assets/internet.png';
import padlock from '../../assets/padlock.png';

import muscle from '../../assets/muscle.png';
import support from '../../assets/support.png';
import parking from '../../assets/parking.png';
import broom from '../../assets/broom.png';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-4">
        <img
          src={icon}
          alt="Nhà Trọ Logo"
          className="w-7 h-7"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ServicesSection = () => {
  const servicesData = [
    {
      icon: broom,
      title: 'Dọn dẹp vệ sinh',
      description: 'Dịch vụ dọn dẹp phòng hàng tuần, thay ga gối'
    },
    {
      icon: support,
      title: 'Bảo trì sửa chữa',
      description: 'Sửa chữa nhanh chóng các thiết bị trong phòng'
    },
    {
      icon: parking,
      title: 'Bãi đỗ xe',
      description: 'Bãi đỗ xe an toàn, có camera giám sát 24/7'
    },
    {
      icon: internet,
      title: 'Internet cao cấp',
      description: 'Wifi tốc độ cao, ổn định cho học tập và làm việc'
    },
    {
      icon: padlock,
      title: 'An ninh 24/7',
      description: 'Bảo vệ và camera giám sát toàn khu vực'
    },
    {
      icon: muscle,
      title: 'Tiện ích giải trí',
      description: 'Hồ bơi, phòng gym, khu BBQ cho cư dân'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Dịch Vụ Tiện Ích</h2>
          <p className="text-xl text-gray-600">Trải nghiệm sống tiện nghi với đầy đủ dịch vụ</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 