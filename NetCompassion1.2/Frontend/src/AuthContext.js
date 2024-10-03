import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : { isLoggedIn: false, role: null };
    });

    const login = (userData) => {
        setUser({ isLoggedIn: true, ...userData });
        localStorage.setItem("user", JSON.stringify({ isLoggedIn: true, ...userData }));
    };

    const logout = () => {
        setUser({ isLoggedIn: false, role: null });
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
