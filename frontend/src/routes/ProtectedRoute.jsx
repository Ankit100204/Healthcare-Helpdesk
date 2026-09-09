import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../constants/routes";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
