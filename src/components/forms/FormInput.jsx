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
            <label className="block text-slate-700 font-medium mb-2 text-sm">
                {label} {required && <span className="text-slate-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-400"
                placeholder={placeholder}
            />
        </div>
    );
};

export default FormInput; 