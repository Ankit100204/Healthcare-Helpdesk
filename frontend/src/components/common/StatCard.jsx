const StatCard = ({ title, value, icon, subtitle }) => {
    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-start justify-between">
                <p className="text-gray-500">{title}</p>
                {icon && <span className="text-blue-500">{icon}</span>}
            </div>

            <h2 className="mt-2 text-3xl font-bold">
                {value}
            </h2>

            {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
        </div>
    );
};

export default StatCard;