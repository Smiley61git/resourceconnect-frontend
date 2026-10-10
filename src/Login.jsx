import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://resourceconnect-backend.onrender.com/api/users/login",
        { email: email.trim(), password }
      );

      const user = response.data;

      if (!user || typeof user !== "object") {
        throw new Error("Invalid response from server. Please try again.");
      }

      const role = String(user.role || "STUDENT").toUpperCase();

      localStorage.setItem("userEmail", user.email || email.trim());
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("userRole", role);

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      const data = err.response?.data;
      let message = "Login failed. Please check your email and password.";

      if (typeof data === "string" && data.trim()) {
        message = data;
      } else if (data && typeof data === "object") {
        message =
          data.message ||
          data.error ||
          data.detail ||
          message;
      } else if (err.message && !err.response) {
        message = "Unable to connect to the server. Please try again.";
      }

      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📚</div>
        <h1 style={styles.title}>ResourceConnect</h1>
        <p style={styles.tagline}>Share • Discover • Connect</p>

        <h2 style={styles.heading}>Welcome Back! 👋</h2>
        <p style={styles.subtitle}>Login to continue to your account</p>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>📧 Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>🔐 Password</label>
          <div style={styles.passwordBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔓 Login"}
          </button>
        </form>

        <div style={styles.divider}>
          <span>OR</span>
        </div>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Create New Account →
          </Link>
        </p>

        <p style={styles.footer}>
          🎓 Academic Resource Sharing Platform
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.10)",
    boxSizing: "border-box",
    textAlign: "center"
  },
  logo: { fontSize: "42px" },
  title: { color: "#ea580c", margin: "8px 0" },
  tagline: { color: "#777", marginTop: 0 },
  heading: { marginTop: "28px", marginBottom: "8px", color: "#292524" },
  subtitle: { color: "#777", marginBottom: "24px" },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    margin: "14px 0 8px",
    color: "#44403c"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d6d3d1",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  passwordBox: {
    display: "flex",
    border: "1px solid #d6d3d1",
    borderRadius: "8px",
    overflow: "hidden"
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },
  eye: {
    border: "none",
    background: "#fff",
    cursor: "pointer",
    padding: "0 12px",
    fontSize: "17px"
  },
  loginButton: {
    width: "100%",
    marginTop: "24px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#f97316",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  divider: {
    margin: "22px 0",
    color: "#999"
  },
  registerText: { color: "#57534e", fontSize: "14px" },
  registerLink: {
    color: "#ea580c",
    fontWeight: "bold",
    textDecoration: "none",
    cursor: "pointer"
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    overflowWrap: "anywhere"
  },
  footer: { marginTop: "28px", color: "#78716c", fontSize: "13px" }
};

export default Login;
