const RoomCard = ({ room, index, onBookRoom, onScrollToSection }) => {
    const handleBookRoom = () => {
        onBookRoom(room.name);
        if (onScrollToSection) {
            onScrollToSection('contact');
        }
    };

    return (
        <div className={`grid lg:grid-cols-2 gap-16 items-center mb-32 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
            {/* Hình ảnh phòng */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} relative`}>
                <div className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Lưới hình ảnh */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {room.images.map((IconComponent, imgIndex) => (
                            <div key={imgIndex}>
                                <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden">
                                    {IconComponent}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phần giá */}
                    <div className="text-center">
                        <div className="inline-flex items-center bg-slate-900 text-white px-6 py-3 rounded-lg mb-3">
                            <span className="text-2xl font-bold">{room.price}</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-slate-600 text-sm font-medium">Diện tích: {room.area}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin phòng */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} relative`}>
                <div className="relative bg-white border border-slate-200 rounded-xl p-10 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Tiêu đề phòng */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h4 className="text-3xl font-bold text-slate-900">
                                {room.name}
                            </h4>
                            {/* Tag thông tin phòng */}
                            {(() => {
                                let tagConfig = {};
                                if (room.id === 1 || room.name.includes('Đơn')) {
                                    tagConfig = {
                                        label: 'Phòng Đơn',
                                        className: 'bg-blue-100 text-blue-800 border-blue-300'
                                    };
                                } else if (room.id === 2 || room.name.includes('Đôi')) {
                                    tagConfig = {
                                        label: 'Phòng Đôi',
                                        className: 'bg-purple-100 text-purple-800 border-purple-300'
                                    };
                                } else if (room.id === 3 || room.name.includes('VIP')) {
                                    tagConfig = {
                                        label: 'Phòng VIP',
                                        className: 'bg-amber-100 text-amber-800 border-amber-300'
                                    };
                                }
                                
                                return tagConfig.label ? (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${tagConfig.className}`}>
                                        {tagConfig.label}
                                    </span>
                                ) : null;
                            })()}
                            {/* Tag diện tích */}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
                                {room.area}
                            </span>
                        </div>
                        <div className="w-16 h-0.5 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Phần tính năng */}
                    <div className="mb-8">
                        <h5 className="font-semibold text-slate-700 mb-5 text-lg">
                            Tiện nghi trong phòng:
                        </h5>
                        <ul className="grid grid-cols-1 gap-2.5">
                            {room.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-slate-600">
                                    <div className="w-5 h-5 bg-slate-700 rounded-full mr-3 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Lưới chi tiết */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                            <h5 className="font-semibold text-slate-700 mb-3 text-sm">
                                Chi phí bao gồm:
                            </h5>
                            <ul className="space-y-1.5">
                                {room.utilities.map((utility, idx) => (
                                    <li key={idx} className="text-slate-600 text-xs flex items-center">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                        {utility}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                            <h5 className="font-semibold text-slate-700 mb-3 text-sm">
                                Điều khoản:
                            </h5>
                            <p className="text-slate-600 text-xs mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                Đặt cọc: {room.deposit}
                            </p>
                            <p className="text-slate-600 text-xs flex items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                Hợp đồng: {room.contract}
                            </p>
                        </div>
                    </div>

                    {/* Nút đặt phòng */}
                    <button
                        onClick={handleBookRoom}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:bg-slate-800 hover:shadow-lg"
                    >
                        Đặt phòng ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard; 