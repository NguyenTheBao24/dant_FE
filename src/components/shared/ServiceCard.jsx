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
            className="group relative transform transition-all duration-500 hover:scale-105 h-full"
            style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-110`}></div>

            {/* Main card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:bg-white/90 overflow-hidden h-full min-h-[320px] flex flex-col">
                {/* Decorative corner gradients */}
                <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${gradientColors} opacity-10 rounded-br-full rounded-tl-3xl`}></div>
                <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${gradientColors} opacity-10 rounded-tl-full rounded-br-3xl`}></div>

                {/* Floating particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${gradientColors} rounded-full animate-bounce`}></div>
                    <div className={`absolute bottom-6 left-6 w-1 h-1 bg-gradient-to-r ${gradientColors} rounded-full animate-bounce animation-delay-300`}></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon container */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${gradientColors} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {iconSrc ? (
                            <img
                                src={iconSrc}
                                alt={title}
                                className="w-10 h-10 filter brightness-0 invert"
                            />
                        ) : (
                            <span className="text-white text-2xl">{icon}</span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-500 transition-all duration-300`}>
                        {title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1">
                        {description}
                    </p>

                    {/* Bottom accent line */}
                    <div className={`w-12 h-1 bg-gradient-to-r ${gradientColors} rounded-full mt-6 transform group-hover:w-24 transition-all duration-500`}></div>
                </div>

                {/* Interactive hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
            </div>
        </div>
    );
};

export default ServiceCard; 