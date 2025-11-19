import React from 'react';

const SubmitButton = ({
    type = 'submit',
    onClick,
    children,
    className = '',
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group/btn relative w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-6 rounded-2xl text-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center">
                <span className="mr-3">🚀</span>
                {children}
                <span className="ml-3 transform group-hover/btn:translate-x-2 transition-transform duration-300">✨</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

            {/* Animation nút */}
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                <div className="absolute top-2 left-8 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-4 right-12 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></div>
                <div className="absolute bottom-3 left-16 w-1 h-1 bg-white rounded-full animate-ping animation-delay-600"></div>
                <div className="absolute bottom-2 right-20 w-1 h-1 bg-white rounded-full animate-ping animation-delay-900"></div>
            </div>
        </button>
    );
};

export default SubmitButton; 