import React from 'react';

const Popup = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Popup content */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
                        >
                            <span className="text-lg">✕</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="space-y-4">
                        {content.map((section, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                <h4 className="text-base font-semibold text-slate-900 mb-3 flex items-center">
                                    <span className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs mr-3">
                                        {index + 1}
                                    </span>
                                    {section.section}
                                </h4>
                                <ul className="space-y-2">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start text-slate-700 text-sm">
                                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <div className="flex items-center mb-3">
                                <span className="w-5 h-5 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                                    📞
                                </span>
                                <span className="font-semibold text-slate-900 text-sm">Liên hệ hỗ trợ:</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
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