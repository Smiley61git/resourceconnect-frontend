import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://resourceconnect-backend.onrender.com/api/users/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login successful:", response.data);

            localStorage.setItem("userEmail", response.data.email);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("userRole", response.data.role);

            alert("Login successful!");

            if (response.data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                const message = error.response.data;
                alert(
                    typeof message === "string"
                        ? message
                        : "Invalid email or password"
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
                background: "linear-gradient(135deg, #eef4ff, #f5f3ff, #faf5ff)",
                fontFamily: "Arial, sans-serif",
                padding: "30px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "430px",
                    background: "rgba(255,255,255,0.97)",
                    padding: "40px",
                    borderRadius: "22px",
                    boxShadow: "0 15px 40px rgba(79,70,229,0.18)",
                    border: "1px solid #e0e7ff",
                    boxSizing: "border-box"
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >
                    <div
                        style={{
                            width: "75px",
                            height: "75px",
                            margin: "0 auto 18px",
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "38px",
                            boxShadow: "0 8px 20px rgba(79,70,229,0.25)"
                        }}
                    >
                        📚
                    </div>

                    <h1
                        style={{
                            margin: "0",
                            color: "#312e81",
                            fontSize: "28px"
                        }}
                    >
                        ResourceConnect
                    </h1>

                    <p
                        style={{
                            margin: "8px 0 0",
                            color: "#6b7280",
                            fontSize: "14px"
                        }}
                    >
                        Share • Discover • Connect
                    </p>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #eef4ff, #f5f0ff)",
                        padding: "18px",
                        borderRadius: "12px",
                        marginBottom: "25px",
                        textAlign: "center"
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 5px",
                            color: "#4338ca",
                            fontSize: "22px"
                        }}
                    >
                        Welcome Back! 👋
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "14px"
                        }}
                    >
                        Login to continue to your account
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <label
                        style={{
                            display: "block",
                            color: "#374151",
                            fontWeight: "bold",
                            fontSize: "14px",
                            marginBottom: "8px"
                        }}
                    >
                        📧 Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "13px",
                            marginBottom: "20px",
                            border: "1px solid #c7d2fe",
                            borderRadius: "9px",
                            boxSizing: "border-box",
                            background: "#f8faff",
                            fontSize: "15px",
                            outline: "none"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            color: "#374151",
                            fontWeight: "bold",
                            fontSize: "14px",
                            marginBottom: "8px"
                        }}
                    >
                        🔐 Password
                    </label>

                    <div
                        style={{
                            position: "relative",
                            marginBottom: "25px"
                        }}
                    >
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "13px 50px 13px 13px",
                                border: "1px solid #c7d2fe",
                                borderRadius: "9px",
                                boxSizing: "border-box",
                                background: "#f8faff",
                                fontSize: "15px"
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "18px"
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                            color: "white",
                            border: "none",
                            borderRadius: "9px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "0 7px 18px rgba(79,70,229,0.25)"
                        }}
                    >
                        🔓 Login
                    </button>
                </form>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        margin: "28px 0 20px"
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#e5e7eb"
                        }}
                    />

                    <span
                        style={{
                            color: "#9ca3af",
                            fontSize: "12px"
                        }}
                    >
                        OR
                    </span>

                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#e5e7eb"
                        }}
                    />
                </div>

                <div
                    style={{
                        textAlign: "center",
                        background: "#f8faff",
                        padding: "18px",
                        borderRadius: "12px",
                        border: "1px solid #e0e7ff"
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#6b7280",
                            fontSize: "14px"
                        }}
                    >
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        style={{
                            background: "transparent",
                            color: "#6d28d9",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "bold"
                        }}
                    >
                        Create New Account →
                    </button>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        margin: "25px 0 0",
                        color: "#9ca3af",
                        fontSize: "12px"
                    }}
                >
                    🎓 Academic Resource Sharing Platform
                </p>
            </div>
        </div>
    );
}

export default Login;
