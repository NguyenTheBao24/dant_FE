import IconServiceItem from './IconServiceItem';

const HeroMainCard = ({
    logo,
    logoAlt = "Logo",
    title = "Phòng Trọ Hiện Đại",
    services = [],
    gradientAccent = "from-emerald-400 to-cyan-400"
}) => {
    return (
        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

            <div className="relative z-10">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30 group-hover:rotate-6 transition-all duration-500">
                        <img
                            src={logo}
                            alt={logoAlt}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                    <div className={`w-24 h-1 bg-gradient-to-r ${gradientAccent} rounded-full mx-auto`}></div>
                </div>

                <div className="space-y-4">
                    {services.map((service, index) => (
                        <IconServiceItem
                            key={index}
                            iconSrc={service.iconSrc}
                            icon={service.icon}
                            label={service.label}
                            gradientColors={service.gradientColors}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroMainCard; 