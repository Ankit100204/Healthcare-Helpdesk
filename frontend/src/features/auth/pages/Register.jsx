import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { ROUTES } from "../../../constants/routes";
import { register } from "../services/authService";
import { registerSchema } from "../validation/registerSchema";

const Register = () => {
    const navigate = useNavigate();
    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values) => {
        const formData = Object.fromEntries(
            Object.entries(values).filter(([key]) => key !== "confirmPassword")
        );

        // This is the public patient registration page, so always register as a patient.
        formData.role = "patient";

        try {
            await register(formData);
            toast.success("Account created. Please sign in.");
            navigate(ROUTES.LOGIN, { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to create your account");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="text-center text-3xl font-bold">Create an account</h1>
                <p className="mt-2 text-center text-gray-500">Join Healthcare Helpdesk</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="First name" placeholder="Jane" {...registerField("firstName")} error={errors.firstName?.message} />
                        <Input label="Last name" placeholder="Doe" {...registerField("lastName")} error={errors.lastName?.message} />
                    </div>
                    <Input label="Email" type="email" placeholder="you@example.com" {...registerField("email")} error={errors.email?.message} />
                    <Input label="Phone" type="tel" inputMode="numeric" placeholder="9876543210" {...registerField("phone")} error={errors.phone?.message} />
                    <Input label="Password" type="password" placeholder="At least 6 characters" {...registerField("password")} error={errors.password?.message} />
                    <Input label="Confirm password" type="password" placeholder="Re-enter your password" {...registerField("confirmPassword")} error={errors.confirmPassword?.message} />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
