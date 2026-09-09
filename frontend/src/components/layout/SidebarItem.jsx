import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-200"
                }`
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

export default SidebarItem;