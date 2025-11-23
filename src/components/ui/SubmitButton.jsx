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
            className={`w-full bg-slate-900 text-white py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900 ${className}`}
        >
            {children}
        </button>
    );
};

export default SubmitButton; 