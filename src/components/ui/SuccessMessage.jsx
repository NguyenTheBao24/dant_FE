import React from 'react';

const SuccessMessage = ({
    title = "🎉 Cảm ơn bạn đã liên hệ!",
    message = "Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
}) => {
    return (
        <div className="text-center py-12 relative z-10">
            <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">✓</span>
                </div>
            </div>

            <h4 className="text-2xl font-bold text-slate-900 mb-4">
                {title}
            </h4>
            <p className="text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                {message}
            </p>
        </div>
    );
};

export default SuccessMessage; 