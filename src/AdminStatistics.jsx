import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminStatistics() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {

        try {

            const usersResponse = await axios.get(
                "http://localhost:8081/api/users"
            );

            const resourcesResponse = await axios.get(
                "http://localhost:8081/api/resources"
            );

            setUsers(usersResponse.data);
            setResources(resourcesResponse.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load statistics.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const students = users.filter(
        (user) => user.role === "STUDENT"
    ).length;

    const faculty = users.filter(
        (user) => user.role === "FACULTY"
    ).length;

    const admins = users.filter(
        (user) => user.role === "ADMIN"
    ).length;

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

                <div>

                    <button
                        onClick={() => navigate("/admin")}
                        style={navButton}
                    >
                        Admin Dashboard
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            ...navButton,
                            background: "#dc2626",
                            color: "white"
                        }}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main style={{ padding: "40px" }}>

                <h1>📊 Platform Statistics</h1>

                <p
                    style={{
                        color: "#6b7280",
                        fontSize: "17px"
                    }}
                >
                    Overview of ResourceConnect users and resources.
                </p>

                {loading ? (

                    <p>Loading statistics...</p>

                ) : (

                    <>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "25px",
                                marginTop: "35px"
                            }}
                        >

                            <div style={cardStyle}>
                                <h2>👥</h2>
                                <h3>Total Users</h3>
                                <p style={numberStyle}>
                                    {users.length}
                                </p>
                            </div>

                            <div style={cardStyle}>
                                <h2>📚</h2>
                                <h3>Total Resources</h3>
                                <p style={numberStyle}>
                                    {resources.length}
                                </p>
                            </div>

                            <div style={cardStyle}>
                                <h2>🎓</h2>
                                <h3>Students</h3>
                                <p style={numberStyle}>
                                    {students}
                                </p>
                            </div>

                            <div style={cardStyle}>
                                <h2>👨‍🏫</h2>
                                <h3>Faculty</h3>
                                <p style={numberStyle}>
                                    {faculty}
                                </p>
                            </div>

                            <div style={cardStyle}>
                                <h2>👨‍💼</h2>
                                <h3>Admins</h3>
                                <p style={numberStyle}>
                                    {admins}
                                </p>
                            </div>

                        </div>

                        <div
                            style={{
                                background: "white",
                                padding: "30px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.08)",
                                marginTop: "35px"
                            }}
                        >

                            <h2>📈 Resource Summary</h2>

                            <p>
                                Total academic resources available:
                                <strong> {resources.length}</strong>
                            </p>

                            <p>
                                Total registered users:
                                <strong> {users.length}</strong>
                            </p>

                        </div>

                    </>

                )}

            </main>

        </div>
    );
}

const navButton = {
    marginLeft: "10px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    textAlign: "center"
};

const numberStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0"
};

export default AdminStatistics;