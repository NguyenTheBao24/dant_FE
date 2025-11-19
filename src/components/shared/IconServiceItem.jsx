const IconServiceItem = ({
    icon,
    iconSrc,
    label,
    gradientColors = "from-blue-400 to-cyan-400",
    className = "flex items-center justify-center space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group/item"
}) => {
    return (
        <div className={className}>
            <div className={`w-10 h-10 bg-gradient-to-br ${gradientColors} rounded-lg flex items-center justify-center transform group-hover/item:scale-110 transition-transform duration-300`}>
                {iconSrc ? (
                    <img src={iconSrc} alt={label} className="w-6 h-6 filter brightness-0 invert" />
                ) : (
                    <span className="text-white text-lg">{icon}</span>
                )}
            </div>
            <span className="text-white font-medium">{label}</span>
        </div>
    );
};

export default IconServiceItem; 