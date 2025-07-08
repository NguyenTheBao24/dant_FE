import { useState } from 'react';
import Popup from '../ui/Popup';
import FormInput from '../forms/FormInput';
import FormSelect from '../forms/FormSelect';
import FormTextarea from '../forms/FormTextarea';
import SubmitButton from '../ui/SubmitButton';
import SuccessMessage from '../ui/SuccessMessage';
import SectionHeader from '../ui/SectionHeader';
import BackgroundEffects from '../ui/BackgroundEffects';

const ContactFormSection = ({ contactForm, setContactForm, onSubmit, isSubmitted }) => {
    const [activePopup, setActivePopup] = useState(null); // 'terms' hoặc 'privacy'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openPopup = (type) => {
        setActivePopup(type);
    };

    const closePopup = () => {
        setActivePopup(null);
    };

    // Dữ liệu options cho dropdown loại phòng
    const roomTypeOptions = [
        {
            value: "Phòng Đơn Tiêu Chuẩn",
            label: "Phòng Đơn Tiêu Chuẩn - 3.5M/tháng"
        },
        {
            value: "Phòng Đôi Cao Cấp",
            label: "Phòng Đôi Cao Cấp - 5M/tháng"
        },
        {
            value: "Phòng VIP Studio",
            label: "Phòng VIP Studio - 7.5M/tháng"
        }
    ];

    // Nội dung điều khoản sử dụng
    const termsContent = {
        title: "Điều Khoản Sử Dụng",
        content: [
            {
                section: "1. Điều Khoản Chung",
                items: [
                    "Khách thuê phải ký hợp đồng trước khi nhận phòng",
                    "Thanh toán tiền phòng đúng hạn vào đầu mỗi tháng",
                    "Giữ gìn vệ sinh chung và trật tự trong khu nhà trọ",
                    "Không được phép chuyển nhượng phòng cho người khác"
                ]
            },
            {
                section: "2. Thanh Toán",
                items: [
                    "Tiền phòng thanh toán vào ngày 5 hàng tháng",
                    "Đặt cọc 2-3 tháng tiền phòng tùy loại phòng",
                    "Phí điện, nước tính theo đồng hồ riêng biệt",
                    "Phạt 50.000đ/ngày nếu trễ hạn thanh toán quá 3 ngày"
                ]
            },
            {
                section: "3. Quy Định Chung",
                items: [
                    "Không gây tiếng ồn sau 22h00 đến 6h00 sáng",
                    "Không được nuôi thú cưng trên 10kg",
                    "Khách đến ở qua đêm phải báo trước và đóng phí",
                    "Tuân thủ các quy định về phòng cháy chữa cháy"
                ]
            },
            {
                section: "4. Chấm Dứt Hợp Đồng",
                items: [
                    "Báo trước 30 ngày khi muốn chấm dứt hợp đồng",
                    "Bàn giao phòng trong tình trạng ban đầu",
                    "Hoàn trả tiền cọc sau khi trừ các khoản phí phát sinh",
                    "Vi phạm nghiêm trọng sẽ bị chấm dứt hợp đồng ngay lập tức"
                ]
            }
        ]
    };

    // Nội dung chính sách bảo mật
    const privacyContent = {
        title: "Chính Sách Bảo Mật",
        content: [
            {
                section: "1. Thu Thập Thông Tin",
                items: [
                    "Họ tên, số điện thoại, địa chỉ email",
                    "Số CMND/CCCD và địa chỉ thường trú",
                    "Thông tin nghề nghiệp và thu nhập",
                    "Hình ảnh và video camera an ninh (nếu có)"
                ]
            },
            {
                section: "2. Sử Dụng Thông Tin",
                items: [
                    "Xác minh danh tính và liên lạc với khách thuê",
                    "Quản lý hợp đồng và thanh toán",
                    "Đảm bảo an ninh và trật tự khu nhà trọ",
                    "Gửi thông báo và thông tin khuyến mại (nếu đồng ý)"
                ]
            },
            {
                section: "3. Bảo Vệ Thông Tin",
                items: [
                    "Sử dụng mã hóa SSL để bảo vệ dữ liệu truyền tải",
                    "Lưu trữ thông tin trong hệ thống an toàn",
                    "Chỉ nhân viên được ủy quyền mới có quyền truy cập",
                    "Thường xuyên sao lưu và cập nhật bảo mật"
                ]
            },
            {
                section: "4. Chia Sẻ Thông Tin",
                items: [
                    "Không chia sẻ thông tin cá nhân cho bên thứ ba",
                    "Trừ trường hợp pháp luật yêu cầu",
                    "Có thể chia sẻ với đối tác dịch vụ (ngân hàng, bảo hiểm)",
                    "Luôn thông báo và xin phép trước khi chia sẻ"
                ]
            },
            {
                section: "5. Quyền Của Khách Hàng",
                items: [
                    "Yêu cầu xem, sửa đổi thông tin cá nhân",
                    "Yêu cầu xóa thông tin khi chấm dứt hợp đồng",
                    "Từ chối nhận thông tin quảng cáo",
                    "Khiếu nại về việc sử dụng thông tin cá nhân"
                ]
            }
        ]
    };

    return (
        <section id="contact" className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <BackgroundEffects />

            <div className="container mx-auto px-4 relative z-10">
                <SectionHeader
                    statusText="Sẵn sàng hỗ trợ 24/7"
                    mainTitle="Liên Hệ"
                    subtitle="Ngay Hôm Nay"
                    description={
                        <>
                            Chúng tôi sẽ liên hệ với bạn trong vòng 24h để tư vấn và hỗ trợ xem phòng.
                            <br />
                            <span className="text-purple-200">Đặt lịch hẹn miễn phí ngay bây giờ!</span>
                        </>
                    }
                />

                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Hiệu ứng phát sáng */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>

                        {/* Container form chính */}
                        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-12 shadow-2xl">
                            {/* Góc trang trí */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-br-full rounded-tl-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-tl-full rounded-br-3xl"></div>

                            {isSubmitted ? (
                                <SuccessMessage />
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <FormInput
                                            type="text"
                                            name="name"
                                            value={contactForm.name}
                                            onChange={handleInputChange}
                                            required
                                            label="Họ và tên"
                                            placeholder="Nhập họ và tên của bạn"
                                            focusColor="blue-400"
                                        />

                                        <FormInput
                                            type="tel"
                                            name="phone"
                                            value={contactForm.phone}
                                            onChange={handleInputChange}
                                            required
                                            label="Số điện thoại"
                                            placeholder="Nhập số điện thoại"
                                            focusColor="green-400"
                                        />
                                    </div>

                                    <FormInput
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleInputChange}
                                        label="Email"
                                        placeholder="Nhập email (không bắt buộc)"
                                        focusColor="purple-400"
                                    />

                                    <FormSelect
                                        name="roomType"
                                        value={contactForm.roomType}
                                        onChange={handleInputChange}
                                        options={roomTypeOptions}
                                        placeholder="Chọn loại phòng bạn quan tâm"
                                        label="Loại phòng quan tâm"
                                        focusColor="orange-400"
                                    />

                                    <FormTextarea
                                        name="message"
                                        value={contactForm.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        label="Tin nhắn"
                                        placeholder="Chia sẻ yêu cầu đặc biệt hoặc câu hỏi của bạn..."
                                        focusColor="indigo-400"
                                    />

                                    <SubmitButton type="submit">
                                        Gửi Thông Tin Liên Hệ
                                    </SubmitButton>

                                    <p className="text-sm text-blue-200/80 text-center leading-relaxed">
                                        Bằng việc gửi thông tin, bạn đồng ý với{' '}
                                        <button
                                            type="button"
                                            onClick={() => openPopup('terms')}
                                            className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300 underline decoration-dotted hover:no-underline font-medium"
                                        >
                                            điều khoản sử dụng
                                        </button> và{' '}
                                        <button
                                            type="button"
                                            onClick={() => openPopup('privacy')}
                                            className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300 underline decoration-dotted hover:no-underline font-medium"
                                        >
                                            chính sách bảo mật
                                        </button> của chúng tôi.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popups */}
            <Popup
                isOpen={activePopup === 'terms'}
                onClose={closePopup}
                title={termsContent.title}
                content={termsContent.content}
            />
            <Popup
                isOpen={activePopup === 'privacy'}
                onClose={closePopup}
                title={privacyContent.title}
                content={privacyContent.content}
            />
        </section>
    );
};

export default ContactFormSection; 