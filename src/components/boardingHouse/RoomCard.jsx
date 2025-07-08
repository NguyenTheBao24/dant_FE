const RoomCard = ({ room, index, onBookRoom, onScrollToSection }) => {
    const handleBookRoom = () => {
        onBookRoom(room.name);
        if (onScrollToSection) {
            onScrollToSection('contact');
        }
    };

    return (
        <div className={`grid lg:grid-cols-2 gap-12 items-center mb-24 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
            {/* Hình ảnh phòng */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} relative`}>
                <div className="relative group">
                    {/* Phát sáng nền */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>

                    {/* Card chính */}
                    <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group-hover:bg-white/95">
                        {/* Phần tử trang trí */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-br-full rounded-tl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-tl-full rounded-br-3xl"></div>

                        {/* Lưới hình ảnh */}
                        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                            {room.images.map((IconComponent, imgIndex) => (
                                <div key={imgIndex} className="group/img">
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 group-hover/img:bg-gradient-to-br group-hover/img:from-blue-50 group-hover/img:to-purple-50">
                                        <div className="transform group-hover/img:scale-110 transition-transform duration-300">
                                            {IconComponent}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phần giá */}
                        <div className="text-center relative z-10">
                            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-all duration-300">
                                <span className="text-3xl font-bold">{room.price}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-600 font-medium">Diện tích: {room.area}</span>
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin phòng */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} relative`}>
                <div className="relative group">
                    {/* Phát sáng nền */}
                    <div className="absolute inset-0 bg-gradient-to-l from-purple-400/20 via-pink-400/20 to-rose-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>

                    {/* Card thông tin chính */}
                    <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group-hover:bg-white/95">
                        {/* Tiêu đề phòng với gradient */}
                        <div className="mb-8">
                            <h4 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                {room.name}
                            </h4>
                            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                        </div>

                        {/* Phần tính năng */}
                        <div className="mb-8">
                            <h5 className="font-bold text-gray-700 mb-6 text-xl flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mr-3 flex items-center justify-center">
                                    <span className="text-white text-sm">✨</span>
                                </div>
                                Tiện nghi trong phòng:
                            </h5>
                            <ul className="grid grid-cols-1 gap-3">
                                {room.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-600 group/feature hover:text-gray-800 transition-colors duration-300">
                                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-4 flex items-center justify-center transform group-hover/feature:scale-110 group-hover/feature:rotate-12 transition-all duration-300 shadow-md">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <span className="font-medium group-hover/feature:translate-x-2 transition-transform duration-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Lưới chi tiết */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                <h5 className="font-bold text-gray-700 mb-4 flex items-center">
                                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg mr-2"></div>
                                    Chi phí bao gồm:
                                </h5>
                                <ul className="space-y-2">
                                    {room.utilities.map((utility, idx) => (
                                        <li key={idx} className="text-gray-600 text-sm flex items-center">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                            {utility}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                                <h5 className="font-bold text-gray-700 mb-4 flex items-center">
                                    <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mr-2"></div>
                                    Điều khoản:
                                </h5>
                                <p className="text-gray-600 text-sm mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                                    Đặt cọc: {room.deposit}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center">
                                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                                    Hợp đồng: {room.contract}
                                </p>
                            </div>
                        </div>

                        {/* Nút đặt phòng */}
                        <button
                            onClick={handleBookRoom}
                            className="group/btn relative w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                <span className="mr-2">🏠</span>
                                Đặt phòng ngay
                                <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                            {/* Các hạt bay lơ lửng */}
                            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                                <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></div>
                                <div className="absolute bottom-3 left-12 w-1 h-1 bg-white rounded-full animate-ping animation-delay-600"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCard; 