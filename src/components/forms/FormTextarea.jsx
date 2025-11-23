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
            <label className="block text-slate-700 font-medium mb-2 text-sm">
                {label}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-400 resize-none"
                placeholder={placeholder}
            />
        </div>
    );
};

export default FormTextarea; 