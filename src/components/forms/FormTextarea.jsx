import React from 'react';

const FormTextarea = ({
    name,
    value,
    onChange,
    rows = 5,
    placeholder,
    label,
    icon,
    iconBgColor = 'from-indigo-400 to-blue-400',
    focusColor = 'indigo-400'
}) => {
    return (
        <div className="group/input">
            <label className="block text-white font-semibold mb-3 flex items-center">
                {icon && (
                    <span className={`w-6 h-6 bg-gradient-to-r ${iconBgColor} rounded-lg mr-3 flex items-center justify-center text-white text-sm`}>
                        {icon}
                    </span>
                )}
                {label}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-${focusColor} focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15 resize-none`}
                placeholder={placeholder}
            />
        </div>
    );
};

export default FormTextarea; 