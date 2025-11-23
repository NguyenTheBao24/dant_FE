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
            <label className="block text-slate-700 font-medium mb-2 text-sm">
                {label}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-slate-900 transition-all duration-200 hover:border-slate-400 appearance-none cursor-pointer"
                >
                    <option value="" className="bg-white text-slate-400">{placeholder}</option>
                    {options.map((option, index) => (
                        <option
                            key={index}
                            value={option.value}
                            className="bg-white text-slate-900"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Mũi tên dropdown */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FormSelect; 