import React from 'react';

const Popup = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Popup content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
                        >
                            <span className="text-xl">✕</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="space-y-6">
                        {content.map((section, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                                        {index + 1}
                                    </span>
                                    {section.section}
                                </h4>
                                <ul className="space-y-3">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start text-gray-700">
                                            <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center mb-3">
                                <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                                    📞
                                </span>
                                <span className="font-semibold text-gray-800">Liên hệ hỗ trợ:</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p><strong>Hotline:</strong> 0869346831</p>
                                    <p><strong>Email:</strong> anhbaonb24@gmail.com</p>
                                </div>
                                <div>
                                    <p><strong>Địa chỉ:</strong> P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội</p>
                                    <p><strong>Hỗ trợ:</strong> 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup; 