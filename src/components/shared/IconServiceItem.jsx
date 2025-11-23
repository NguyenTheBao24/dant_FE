const IconServiceItem = ({
    icon,
    iconSrc,
    label,
    gradientColors = "from-blue-400 to-cyan-400",
    className = "flex items-center justify-center space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group/item"
}) => {
    return (
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                {iconSrc ? (
                    <img src={iconSrc} alt={label} className="w-6 h-6 filter brightness-0 invert" />
                ) : (
                    <span className="text-white text-lg">{icon}</span>
                )}
            </div>
            <span className="text-slate-700 font-medium text-sm">{label}</span>
        </div>
    );
};

export default IconServiceItem; 