import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8081/api/users"
            );

            setUsers(response.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load users.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
                        onClick={() =>
                            navigate("/admin")
                        }
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

                <h1>👥 Manage Users</h1>

                <p
                    style={{
                        color: "#6b7280",
                        fontSize: "17px"
                    }}
                >
                    View all registered ResourceConnect users.
                </p>

                {loading ? (

                    <p>Loading users...</p>

                ) : users.length === 0 ? (

                    <div
                        style={{
                            background: "white",
                            padding: "30px",
                            borderRadius: "10px",
                            marginTop: "25px"
                        }}
                    >
                        No users found.
                    </div>

                ) : (

                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.08)",
                            marginTop: "25px",
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        background: "#f3f4f6"
                                    }}
                                >

                                    <th style={thStyle}>
                                        ID
                                    </th>

                                    <th style={thStyle}>
                                        Name
                                    </th>

                                    <th style={thStyle}>
                                        Email
                                    </th>

                                    <th style={thStyle}>
                                        Role
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user.id}>

                                        <td style={tdStyle}>
                                            {user.id}
                                        </td>

                                        <td style={tdStyle}>
                                            {user.name}
                                        </td>

                                        <td style={tdStyle}>
                                            {user.email}
                                        </td>

                                        <td style={tdStyle}>

                                            <span
                                                style={{
                                                    background:
                                                        user.role === "ADMIN"
                                                            ? "#fee2e2"
                                                            : "#dbeafe",
                                                    color:
                                                        user.role === "ADMIN"
                                                            ? "#b91c1c"
                                                            : "#1d4ed8",
                                                    padding:
                                                        "6px 12px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                {user.role}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

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

const thStyle = {
    padding: "15px",
    textAlign: "left",
    borderBottom: "2px solid #ddd"
};

const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid #eee"
};

export default AdminUsers;