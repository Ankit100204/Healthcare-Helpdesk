import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

const RoleRoute = ({ allowedRoles }) => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
