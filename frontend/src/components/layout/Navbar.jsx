import { useAuth } from "../../features/auth/hooks/useAuth";

const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">

            <h1 className="text-xl font-bold text-blue-600">
                Healthcare Helpdesk
            </h1>

            <div className="flex items-center gap-4">

                <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                </span>

                <button
                    onClick={logout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

        </header>
    );
};

export default Navbar;
