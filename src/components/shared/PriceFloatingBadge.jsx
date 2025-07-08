const PriceFloatingBadge = ({
    price = "3.5M/tháng",
    fromText = "Từ",
    gradientColors = "from-green-400 to-emerald-500",
    position = "absolute -top-4 -right-4"
}) => {
    return (
        <div className={`${position} bg-gradient-to-r ${gradientColors} text-white px-6 py-3 rounded-2xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300`}>
            <div className="text-sm font-medium">{fromText}</div>
            <div className="text-xl font-bold">{price}</div>
        </div>
    );
};

export default PriceFloatingBadge; 