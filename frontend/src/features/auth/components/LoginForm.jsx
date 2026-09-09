import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import { loginSchema } from "../validation/loginSchema";
import { login } from "../services/authService";

import { useAuth } from "../hooks/useAuth";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const LoginForm = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await login(formData);

            // ⚠️ Update these lines if your login response differs
            const user = response.data.user;

            setUser(user);

            toast.success("Login Successful");

            switch (user.role) {

                case "patient":
                    navigate("/patient");
                    break;

                case "doctor":
                    navigate("/doctor");
                    break;

                case "admin":
                    navigate("/admin");
                    break;

                default:
                    navigate("/");
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                error={errors.password?.message}
            />

            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </Button>
        </form>
    );
};

export default LoginForm;
