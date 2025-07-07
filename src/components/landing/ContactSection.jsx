import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const ContactInfo = ({ iconComponent, title, info }) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        {iconComponent}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: info }}></p>
      </div>
    </div>
  );
};

const ContactForm = () => {
  return (
    <div className="bg-blue-50 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Đăng ký tham quan</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          placeholder="Ghi chú thêm"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Gửi yêu cầu
        </button>
      </div>
    </div>
  );
};

const ContactSection = () => {
  const contactData = [
    {
      iconComponent: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 text-xl" />,
      title: 'Địa chỉ',
      info: 'P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội'
    },
    {
      iconComponent: <FontAwesomeIcon icon={faPhone} className="text-green-600 text-xl" />,
      title: 'Điện thoại',
      info: 'Hotline: 0869346831<br />Zalo: 0869346831'
    },
    {
      iconComponent: <FontAwesomeIcon icon={faEnvelope} className="text-purple-600 text-xl" />,
      title: 'Email',
      info: 'anhbaonb24@gmail.com<br />Liên hệ hỗ trợ 24/7'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ</h2>
          <p className="text-xl text-gray-600">Sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {contactData.map((contact, index) => (
              <ContactInfo
                key={index}
                iconComponent={contact.iconComponent}
                title={contact.title}
                info={contact.info}
              />
            ))}
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 