const PriceFloatingBadge = ({
    price = "3.5M/tháng",
    fromText = "Từ",
    gradientColors = "from-green-400 to-emerald-500",
    position = "absolute -top-4 -right-4"
}) => {
    return (
        <div className={`${position} bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-md`}>
            <div className="text-xs font-medium text-slate-300">{fromText}</div>
            <div className="text-lg font-bold">{price}</div>
        </div>
    );
};

export default PriceFloatingBadge; 