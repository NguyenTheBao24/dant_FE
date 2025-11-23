import React from 'react';

const SectionHeader = ({
    statusText = "Sẵn sàng hỗ trợ 24/7",
    mainTitle,
    subtitle,
    description
}) => {
    return (
        <div className="text-center mb-16">
            <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-full px-6 py-2 mb-6">
                <span className="w-2 h-2 bg-slate-600 rounded-full mr-3"></span>
                <span className="text-slate-700 text-sm font-medium">{statusText}</span>
            </div>

            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                {mainTitle}
                {subtitle && (
                    <>
                        <br />
                        <span className="text-slate-700">
                            {subtitle}
                        </span>
                    </>
                )}
            </h3>

            {description && (
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader; 