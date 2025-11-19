import React from 'react';

const SuccessMessage = ({
    title = "🎉 Cảm ơn bạn đã liên hệ!",
    message = "Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
}) => {
    return (
        <div className="text-center py-16 relative z-10">
            <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-2xl transform animate-bounce">
                    <span className="text-white text-4xl font-bold">✓</span>
                </div>
                {/* Vòng animation thành công */}
                <div className="absolute inset-0 border-4 border-green-400/50 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-2 border-emerald-400/30 rounded-full animate-ping animation-delay-500"></div>
            </div>

            <h4 className="text-4xl font-bold text-white mb-6">
                {title}
            </h4>
            <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
                {message}
            </p>

            {/* Trang trí thành công */}
            <div className="flex justify-center items-center space-x-4 mt-8">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce animation-delay-300"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-600"></div>
            </div>
        </div>
    );
};

export default SuccessMessage; 