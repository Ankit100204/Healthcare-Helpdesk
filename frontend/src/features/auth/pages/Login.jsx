import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { ROUTES } from "../../../constants/routes";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>

                <p className="mt-2 text-center text-gray-500">
                    Sign in to Healthcare Helpdesk
                </p>

                <div className="mt-8">
                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to={ROUTES.REGISTER}
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;
