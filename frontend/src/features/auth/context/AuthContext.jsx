import { useEffect, useState } from "react";

import {
    getCurrentUser,
    logout as logoutUser,
} from "../services/authService";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        getCurrentUser()
            .then((response) => setUser(response.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
