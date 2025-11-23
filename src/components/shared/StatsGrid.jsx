const StatItem = ({ value, label, color }) => {
    return (
        <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold ${color} mb-2`}>
                {value}
            </div>
            <div className="text-sm text-slate-600">{label}</div>
        </div>
    );
};

const StatsGrid = ({ stats }) => {
    const defaultStats = [
        { value: "50+", label: "Phòng có sẵn", color: "text-slate-900" },
        { value: "24/7", label: "Hỗ trợ", color: "text-slate-900" },
        { value: "100%", label: "Hài lòng", color: "text-slate-900" }
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