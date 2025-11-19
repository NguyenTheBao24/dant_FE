const StatItem = ({ value, label, color }) => {
    return (
        <div className="text-center group">
            <div className={`text-4xl md:text-5xl font-bold ${color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {value}
            </div>
            <div className="text-sm text-blue-200 opacity-80">{label}</div>
        </div>
    );
};

const StatsGrid = ({ stats }) => {
    const defaultStats = [
        { value: "50+", label: "Phòng có sẵn", color: "text-yellow-300" },
        { value: "24/7", label: "Hỗ trợ", color: "text-emerald-300" },
        { value: "100%", label: "Hài lòng", color: "text-pink-300" }
    ];

    const statsToRender = stats || defaultStats;

    return (
        <div className="grid grid-cols-3 gap-8">
            {statsToRender.map((stat, index) => (
                <StatItem
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    color={stat.color}
                />
            ))}
        </div>
    );
};

export default StatsGrid; 