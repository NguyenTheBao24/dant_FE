import React from 'react';

const SectionHeader = ({
    statusText = "Sẵn sàng hỗ trợ 24/7",
    mainTitle,
    subtitle,
    description
}) => {
    return (
        <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                <span className="text-white text-sm font-medium">{statusText}</span>
            </div>

            <h3 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    {mainTitle}
                </span>
                {subtitle && (
                    <>
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                            {subtitle}
                        </span>
                    </>
                )}
            </h3>

            {description && (
                <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader; 