import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";


export default function useAuth() {
    console.log("useAuth hook running")
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}