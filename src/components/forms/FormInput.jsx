import React from 'react';

const FormInput = ({
    type = 'text',
    name,
    value,
    onChange,
    required = false,
    placeholder,
    label,
    icon,
    iconBgColor = 'from-blue-400 to-cyan-400',
    focusColor = 'blue-400'
}) => {
    return (
        <div className="group/input">
            <label className="block text-white font-semibold mb-3 flex items-center">
                {icon && (
                    <span className={`w-6 h-6 bg-gradient-to-r ${iconBgColor} rounded-lg mr-3 flex items-center justify-center text-white text-sm`}>
                        {icon}
                    </span>
                )}
                {label} {required && '*'}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-${focusColor} focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15`}
                placeholder={placeholder}
            />
        </div>
    );
};

export default FormInput; 