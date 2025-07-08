import React from 'react';

const FormSelect = ({
    name,
    value,
    onChange,
    options = [],
    placeholder,
    label,
    icon,
    iconBgColor = 'from-orange-400 to-red-400',
    focusColor = 'orange-400'
}) => {
    return (
        <div className="group/input relative">
            <label className="block text-white font-semibold mb-3 flex items-center">
                {icon && (
                    <span className={`w-6 h-6 bg-gradient-to-r ${iconBgColor} rounded-lg mr-3 flex items-center justify-center text-white text-sm`}>
                        {icon}
                    </span>
                )}
                {label}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-${focusColor} focus:border-transparent text-white transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15 appearance-none cursor-pointer hover:border-white/40 focus:shadow-lg focus:shadow-${focusColor}/20`}
                >
                    <option value="" className="bg-gray-900 text-gray-300">{placeholder}</option>
                    {options.map((option, index) => (
                        <option
                            key={index}
                            value={option.value}
                            className="bg-gray-900 text-white hover:bg-gray-800"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Mũi tên dropdown tùy chỉnh */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <div className={`w-8 h-8 bg-gradient-to-r ${icon ? iconBgColor : 'from-gray-400 to-gray-600'} rounded-lg flex items-center justify-center transform group-hover/input:scale-110 transition-transform duration-300`}>
                        <svg
                            className="w-4 h-4 text-white transform group-hover/input:rotate-180 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Hiệu ứng sáng khi focus */}
                <div className={`absolute inset-0 bg-gradient-to-r ${icon ? iconBgColor : 'from-gray-400 to-gray-600'}/20 rounded-2xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
        </div>
    );
};

export default FormSelect; 