import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://resourceconnect-backend.onrender.com/api/users/register",
                {
                    name,
                    email,
                    password,
                    role
                }
            );

            console.log("Registration successful:", response.data);
            alert("Registration successful!");
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                const message = error.response.data;
                alert(
                    typeof message === "string"
                        ? message
                        : "Registration failed"
                );
            } else {
                alert(
                    "Unable to connect to the server. Please try again."
                );
            }
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f9",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "white",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    boxSizing: "border-box"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        color: "#1f2937",
                        marginBottom: "8px"
                    }}
                >
                    📚 ResourceConnect
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#6b7280",
                        marginBottom: "30px"
                    }}
                >
                    Create your account
                </p>

                <form onSubmit={handleRegister}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold"
                        }}
                    >
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold"
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            fontSize: "15px"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold"
                        }}
                    >
                        Role
                    </label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "25px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            fontSize: "15px",
                            background: "white"
                        }}
                    >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                    </select>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        Create Account
                    </button>
                </form>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "25px"
                    }}
                >
                    <p style={{ color: "#6b7280" }}>
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            background: "transparent",
                            color: "#2563eb",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;

