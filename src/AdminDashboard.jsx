import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const userName = localStorage.getItem("userName");

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <nav
                style={{
                    background: "#1f2937",
                    color: "white",
                    padding: "18px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h2 style={{ margin: 0 }}>
                    👨‍💼 ResourceConnect Admin
                </h2>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </nav>

            <main style={{ padding: "40px" }}>

                <h1>
                    Welcome, {userName} 👋
                </h1>

                <p
                    style={{
                        color: "#6b7280",
                        fontSize: "17px"
                    }}
                >
                    Admin Dashboard
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "25px",
                        marginTop: "35px"
                    }}
                >

                    <div style={cardStyle}>
                        <h2>👥</h2>
                        <h2>Manage Users</h2>
                        <p>
                            View and manage registered users.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/users")
                            }
                            style={buttonStyle}
                        >
                            View Users
                        </button>
                    </div>

                    <div style={cardStyle}>
                        <h2>📚</h2>
                        <h2>Manage Resources</h2>
                        <p>
                            View and manage academic resources.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/resources")
                            }
                            style={buttonStyle}
                        >
                            View Resources
                        </button>
                    </div>

                    <div style={cardStyle}>
                        <h2>📊</h2>
                        <h2>Statistics</h2>
                        <p>
                            View platform statistics.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/statistics")
                            }
                            style={buttonStyle}
                        >
                            View Statistics
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
}

const cardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
};

const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px"
};

export default AdminDashboard;