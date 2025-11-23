import IconServiceItem from './IconServiceItem';

const HeroMainCard = ({
    logo,
    logoAlt = "Logo",
    title = "Phòng Trọ Hiện Đại",
    services = [],
    gradientAccent = "from-emerald-400 to-cyan-400"
}) => {
    return (
        <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                        <img
                            src={logo}
                            alt={logoAlt}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                    <div className="w-16 h-0.5 bg-slate-300 rounded-full mx-auto"></div>
                </div>

                <div className="space-y-3">
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