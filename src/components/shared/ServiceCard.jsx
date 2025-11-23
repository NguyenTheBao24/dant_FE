const ServiceCard = ({
    icon,
    iconSrc,
    title,
    description,
    index = 0,
    gradientColors = "from-blue-400 to-cyan-500"
}) => {
    return (
        <div
            className="group relative h-full"
            style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            {/* Card chính */}
            <div className="relative bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full min-h-[280px] flex flex-col">
                <div className="relative z-10 flex flex-col h-full">
                    {/* Container icon */}
                    <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mb-6">
                        {iconSrc ? (
                            <img
                                src={iconSrc}
                                alt={title}
                                className="w-8 h-8 filter brightness-0 invert"
                            />
                        ) : (
                            <span className="text-white text-xl">{icon}</span>
                        )}
                    </div>

                    {/* Nội dung */}
                    <h3 className="text-xl font-bold mb-3 text-slate-900">
                        {title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm flex-1">
                        {description}
                    </p>

                    {/* Đường accent dưới */}
                    <div className="w-8 h-0.5 bg-slate-300 rounded-full mt-6"></div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard; 