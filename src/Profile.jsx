import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://resourceconnect-backend.onrender.com/api";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    const fetchRequests = useCallback(async (ownerName, email) => {
        try {
            const [receivedResponse, myResponse] = await Promise.all([
                axios.get(`${API}/requests/owner`, {
                    params: { ownerName }
                }),
                axios.get(`${API}/requests/my`, {
                    params: { email }
                })
            ]);

            setReceivedRequests(receivedResponse.data);
            setMyRequests(myResponse.data);
        } catch (error) {
            console.error("Error loading requests:", error);
        }
    }, []);

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
            return;
        }

        let active = true;

        const loadProfile = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`${API}/users`);

                if (!active) return;

                const currentUser = response.data.find(
                    item =>
                        item.email?.trim().toLowerCase() ===
                        userEmail.trim().toLowerCase()
                );

                if (!currentUser) {
                    setUser(null);
                    return;
                }

                setUser(currentUser);

                const ownerName = currentUser.name || userName;

                if (ownerName) {
                    await fetchRequests(ownerName, userEmail);
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, [navigate, userEmail, userName, fetchRequests]);

    const updateRequestStatus = async (id, status) => {
        try {
            await axios.put(`${API}/requests/${id}/status`, null, {
                params: { status }
            });

            alert(
                status === "ACCEPTED"
                    ? "Request accepted!"
                    : "Request rejected!"
            );

            await fetchRequests(
                user?.name || userName,
                userEmail
            );
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Unable to update request. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const getStatusStyle = status => {
        if (status === "ACCEPTED") {
            return { color: "#15803d", background: "#dcfce7" };
        }

        if (status === "REJECTED") {
            return { color: "#dc2626", background: "#fee2e2" };
        }

        return { color: "#b45309", background: "#fef3c7" };
    };

    const renderRequestCard = (request, received = false) => (
        <div key={request.id} style={requestCardStyle}>
            <div style={requestTop}>
                <strong style={requestNumber}>
                    Request #{request.id}
                </strong>

                <span
                    style={{
                        ...statusBadge,
                        ...getStatusStyle(request.status)
                    }}
                >
                    {request.status}
                </span>
            </div>

            <div style={requestInfo}>
                {received ? (
                    <>
                        <p><strong>Requested by:</strong> {request.requesterName}</p>
                        <p><strong>Email:</strong> {request.requesterEmail}</p>
                    </>
                ) : (
                    <p><strong>Requested by you</strong></p>
                )}

                <p><strong>Resource ID:</strong> {request.resourceId}</p>
                <p><strong>Owner:</strong> {request.ownerName}</p>
            </div>

            {received && request.status === "PENDING" && (
                <div style={actionButtons}>
                    <button
                        onClick={() => updateRequestStatus(request.id, "ACCEPTED")}
                        style={acceptButton}
                    >
                        Accept
                    </button>

                    <button
                        onClick={() => updateRequestStatus(request.id, "REJECTED")}
                        style={rejectButton}
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );

    const renderRequestSection = (title, subtitle, requests, received) => (
        <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
                <div>
                    <h2 style={sectionTitle}>{title}</h2>
                    <p style={sectionSubtitle}>{subtitle}</p>
                </div>

                <span style={countBadge}>{requests.length}</span>
            </div>

            {requests.length === 0 ? (
                <div style={emptyStyle}>
                    <h3>
                        {received ? "No requests received" : "No requests yet"}
                    </h3>
                    <p>
                        {received
                            ? "Requests for your resources will appear here."
                            : "Resources you request will appear here."}
                    </p>

                    {!received && (
                        <button
                            onClick={() => navigate("/resources")}
                            style={primaryButton}
                        >
                            Browse Resources
                        </button>
                    )}
                </div>
            ) : (
                <div style={requestGrid}>
                    {requests.map(request =>
                        renderRequestCard(request, received)
                    )}
                </div>
            )}
        </section>
    );

    return (
        <div style={pageStyle}>
            <nav style={navbarStyle}>
                <div style={logoStyle} onClick={() => navigate("/dashboard")}>
                    📚 ResourceConnect
                </div>

                <div style={navLinksStyle}>
                    <button style={navButton} onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button style={navButton} onClick={() => navigate("/resources")}>
                        Resources
                    </button>

                    <button style={activeNavButton} onClick={() => navigate("/profile")}>
                        Profile
                    </button>

                    <button style={logoutButton} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main style={mainStyle}>
                <p style={smallTitleStyle}>MY ACCOUNT</p>
                <h1 style={headingStyle}>👤 My Profile</h1>
                <p style={subtitleStyle}>
                    Manage your account and track your resource requests.
                </p>

                {loading ? (
                    <p>Loading your profile and requests...</p>
                ) : (
                    <>
                        {user && (
                            <section style={profileCardStyle}>
                                <div style={profileAvatar}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 style={profileName}>{user.name}</h2>
                                    <p style={profileEmail}>{user.email}</p>
                                    <span style={roleBadge}>{user.role}</span>
                                </div>
                            </section>
                        )}

                        {renderRequestSection(
                            "📤 My Requests",
                            "Resources you have requested",
                            myRequests,
                            false
                        )}

                        {renderRequestSection(
                            "📩 Requests I Received",
                            "Manage requests from other users",
                            receivedRequests,
                            true
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3f6ff, #f5f3ff, #faf5ff)",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937"
};

const navbarStyle = {
    minHeight: "70px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 5%",
    gap: "15px",
    flexWrap: "wrap",
    boxShadow: "0 3px 18px rgba(79, 70, 229, 0.12)"
};

const logoStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#4f46e5",
    cursor: "pointer"
};

const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap"
};

const navButton = {
    border: "none",
    background: "transparent",
    padding: "10px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    color: "#374151"
};

const activeNavButton = {
    ...navButton,
    background: "#ede9fe",
    color: "#6d28d9",
    fontWeight: "bold"
};

const logoutButton = {
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "10px 16px",
    borderRadius: "9px",
    cursor: "pointer"
};

const mainStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 25px"
};

const smallTitleStyle = {
    color: "#7c3aed",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1.5px"
};

const headingStyle = {
    fontSize: "34px",
    color: "#312e81",
    marginBottom: "8px"
};

const subtitleStyle = {
    color: "#6b7280",
    marginBottom: "30px"
};

const profileCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
    color: "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "30px"
};

const profileAvatar = {
    width: "75px",
    height: "75px",
    minWidth: "75px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "bold"
};

const profileName = {
    margin: "0 0 8px",
    fontSize: "26px"
};

const profileEmail = {
    margin: "0 0 10px"
};

const roleBadge = {
    display: "inline-block",
    padding: "6px 13px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.2)",
    fontSize: "13px",
    fontWeight: "bold"
};

const sectionStyle = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 7px 22px rgba(79,70,229,0.09)",
    border: "1px solid #e0e7ff",
    marginBottom: "25px"
};

const sectionHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "22px"
};

const sectionTitle = {
    margin: 0,
    color: "#312e81",
    fontSize: "22px"
};

const sectionSubtitle = {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px"
};

const countBadge = {
    minWidth: "34px",
    height: "34px",
    padding: "0 10px",
    borderRadius: "18px",
    background: "#ede9fe",
    color: "#6d28d9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold"
};

const requestGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px"
};

const requestCardStyle = {
    background: "#ffffff",
    border: "1px solid #e0e7ff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(79,70,229,0.07)"
};

const requestTop = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px"
};

const requestNumber = {
    color: "#4338ca"
};

const statusBadge = {
    padding: "6px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "bold"
};

const requestInfo = {
    color: "#6b7280",
    lineHeight: "1.8",
    fontSize: "14px",
    overflowWrap: "anywhere"
};

const actionButtons = {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
};

const acceptButton = {
    flex: 1,
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
};

const rejectButton = {
    flex: 1,
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
};

const emptyStyle = {
    textAlign: "center",
    padding: "30px 15px",
    background: "#f8faff",
    borderRadius: "12px"
};

const primaryButton = {
    marginTop: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
};

export default Profile;
