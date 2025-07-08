import { useState } from 'react';

const ContactFormSection = ({ contactForm, setContactForm, onSubmit, isSubmitted }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section id="contact" className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-300/40 rounded-full animate-float animation-delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-bounce animation-delay-2000"></div>
                <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-purple-300/40 rounded-full animate-float animation-delay-3000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-white text-sm font-medium">Sẵn sàng hỗ trợ 24/7</span>
                    </div>

                    <h3 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                            Liên Hệ
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                            Ngay Hôm Nay
                        </span>
                    </h3>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Chúng tôi sẽ liên hệ với bạn trong vòng 24h để tư vấn và hỗ trợ xem phòng.
                        <br />
                        <span className="text-purple-200">Đặt lịch hẹn miễn phí ngay bây giờ!</span>
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>

                        {/* Main form container */}
                        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-12 shadow-2xl">
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-br-full rounded-tl-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-tl-full rounded-br-3xl"></div>

                            {isSubmitted ? (
                                <div className="text-center py-16 relative z-10">
                                    <div className="relative inline-block mb-8">
                                        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-2xl transform animate-bounce">
                                            <span className="text-white text-4xl font-bold">✓</span>
                                        </div>
                                        {/* Success animation rings */}
                                        <div className="absolute inset-0 border-4 border-green-400/50 rounded-full animate-ping"></div>
                                        <div className="absolute inset-2 border-2 border-emerald-400/30 rounded-full animate-ping animation-delay-500"></div>
                                    </div>

                                    <h4 className="text-4xl font-bold text-white mb-6">
                                        🎉 Cảm ơn bạn đã liên hệ!
                                    </h4>
                                    <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
                                        Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                                    </p>

                                    {/* Success decorations */}
                                    <div className="flex justify-center items-center space-x-4 mt-8">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce animation-delay-300"></div>
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-600"></div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="group/input">
                                            <label className="block text-white font-semibold mb-3 flex items-center">
                                                <span className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg mr-3 flex items-center justify-center text-white text-sm">👤</span>
                                                Họ và tên *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={contactForm.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15"
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                        </div>

                                        <div className="group/input">
                                            <label className="block text-white font-semibold mb-3 flex items-center">
                                                <span className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg mr-3 flex items-center justify-center text-white text-sm">📱</span>
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={contactForm.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15"
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>

                                    <div className="group/input">
                                        <label className="block text-white font-semibold mb-3 flex items-center">
                                            <span className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mr-3 flex items-center justify-center text-white text-sm">✉️</span>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={contactForm.email}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15"
                                            placeholder="Nhập email (không bắt buộc)"
                                        />
                                    </div>

                                    <div className="group/input relative">
                                        <label className="block text-white font-semibold mb-3 flex items-center">
                                            <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg mr-3 flex items-center justify-center text-white text-sm">🏠</span>
                                            Loại phòng quan tâm
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="roomType"
                                                value={contactForm.roomType}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15 appearance-none cursor-pointer hover:border-white/40 focus:shadow-lg focus:shadow-orange-400/20"
                                            >
                                                <option value="" className="bg-gray-900 text-gray-300">🏠 Chọn loại phòng bạn quan tâm</option>
                                                <option value="Phòng Đơn Tiêu Chuẩn" className="bg-gray-900 text-white hover:bg-gray-800">
                                                    🛏️ Phòng Đơn Tiêu Chuẩn - 3.5M/tháng
                                                </option>
                                                <option value="Phòng Đôi Cao Cấp" className="bg-gray-900 text-white hover:bg-gray-800">
                                                    🛋️ Phòng Đôi Cao Cấp - 5M/tháng
                                                </option>
                                                <option value="Phòng VIP Studio" className="bg-gray-900 text-white hover:bg-gray-800">
                                                    ✨ Phòng VIP Studio - 7.5M/tháng
                                                </option>
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center transform group-hover/input:scale-110 transition-transform duration-300">
                                                    <svg
                                                        className="w-4 h-4 text-white transform group-hover/input:rotate-180 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Focus glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>

                                    <div className="group/input">
                                        <label className="block text-white font-semibold mb-3 flex items-center">
                                            <span className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-lg mr-3 flex items-center justify-center text-white text-sm">💬</span>
                                            Tin nhắn
                                        </label>
                                        <textarea
                                            name="message"
                                            value={contactForm.message}
                                            onChange={handleInputChange}
                                            rows="5"
                                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15 resize-none"
                                            placeholder="Chia sẻ yêu cầu đặc biệt hoặc câu hỏi của bạn..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="group/btn relative w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-6 rounded-2xl text-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                                    >
                                        <span className="relative z-10 flex items-center justify-center">
                                            <span className="mr-3">🚀</span>
                                            Gửi Thông Tin Liên Hệ
                                            <span className="ml-3 transform group-hover/btn:translate-x-2 transition-transform duration-300">✨</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                                        {/* Button animations */}
                                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                                            <div className="absolute top-2 left-8 w-1 h-1 bg-white rounded-full animate-ping"></div>
                                            <div className="absolute top-4 right-12 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></div>
                                            <div className="absolute bottom-3 left-16 w-1 h-1 bg-white rounded-full animate-ping animation-delay-600"></div>
                                            <div className="absolute bottom-2 right-20 w-1 h-1 bg-white rounded-full animate-ping animation-delay-900"></div>
                                        </div>
                                    </button>

                                    <p className="text-sm text-blue-200/80 text-center leading-relaxed">
                                        Bằng việc gửi thông tin, bạn đồng ý với{' '}
                                        <span className="text-yellow-300 cursor-pointer hover:text-yellow-200 transition-colors duration-300 underline decoration-dotted">điều khoản sử dụng</span> và{' '}
                                        <span className="text-yellow-300 cursor-pointer hover:text-yellow-200 transition-colors duration-300 underline decoration-dotted">chính sách bảo mật</span> của chúng tôi.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFormSection; 