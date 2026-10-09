import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);

    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    useEffect(() => {

        if (!userEmail) {
            navigate("/");
            return;
        }

        fetchUser();
        fetchReceivedRequests();
        fetchMyRequests();

    }, [navigate, userEmail, userName]);

    const fetchUser = async () => {

        try {
            const response = await axios.get(
                "http://localhost:8081/api/users"
            );

            const currentUser = response.data.find(
                (item) => item.email === userEmail
            );

            setUser(currentUser);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchReceivedRequests = async () => {

        try {
            const response = await axios.get(
                `http://localhost:8081/api/requests/owner?ownerName=${userName}`
            );

            setReceivedRequests(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyRequests = async () => {

        try {
            const response = await axios.get(
                `http://localhost:8081/api/requests/my?email=${userEmail}`
            );

            setMyRequests(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const updateRequestStatus = async (id, status) => {

        try {

            await axios.put(
                `http://localhost:8081/api/requests/${id}/status?status=${status}`
            );

            alert(
                status === "ACCEPTED"
                    ? "Request accepted!"
                    : "Request rejected!"
            );

            fetchReceivedRequests();
            fetchMyRequests();

        } catch (error) {

            console.error(error);
            alert("Unable to update request.");

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");

        navigate("/");
    };

    const getStatusStyle = (status) => {

        if (status === "ACCEPTED") {
            return {
                color: "#15803d",
                background: "#dcfce7"
            };
        }

        if (status === "REJECTED") {
            return {
                color: "#dc2626",
                background: "#fee2e2"
            };
        }

        return {
            color: "#b45309",
            background: "#fef3c7"
        };
    };

    return (
        <div style={pageStyle}>

            <nav style={navbarStyle}>

                <div
                    style={logoStyle}
                    onClick={() => navigate("/dashboard")}
                >
                    📚 ResourceConnect
                </div>

                <div style={navLinksStyle}>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={navButton}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/resources")}
                        style={navButton}
                    >
                        Resources
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        style={activeNavButton}
                    >
                        Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        style={logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main style={mainStyle}>

                <div style={headingContainer}>
                    <p style={smallTitleStyle}>
                        MY ACCOUNT
                    </p>

                    <h1 style={headingStyle}>
                        👤 My Profile
                    </h1>

                    <p style={subtitleStyle}>
                        Manage your account and track your resource requests.
                    </p>
                </div>

                {user && (
                    <section style={profileCardStyle}>

                        <div style={profileAvatar}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>

                            <h2 style={profileName}>
                                {user.name}
                            </h2>

                            <p style={profileEmail}>
                                ✉️ {user.email}
                            </p>

                            <span style={roleBadge}>
                                🎓 {user.role}
                            </span>

                        </div>

                    </section>
                )}

                <section style={sectionStyle}>

                    <div style={sectionHeaderStyle}>

                        <div style={sectionTitleArea}>
                            <span style={sectionIcon}>
                                📤
                            </span>

                            <div>
                                <h2 style={sectionTitle}>
                                    My Requests
                                </h2>

                                <p style={sectionSubtitle}>
                                    Resources you have requested
                                </p>
                            </div>
                        </div>

                        <span style={countBadge}>
                            {myRequests.length}
                        </span>

                    </div>

                    {myRequests.length === 0 ? (

                        <div style={emptyStyle}>

                            <div style={emptyIcon}>
                                📭
                            </div>

                            <h3>
                                No requests yet
                            </h3>

                            <p>
                                You have not requested any resources yet.
                            </p>

                            <button
                                onClick={() => navigate("/resources")}
                                style={primaryButton}
                            >
                                Browse Resources →
                            </button>

                        </div>

                    ) : (

                        <div style={requestGrid}>

                            {myRequests.map((request) => (

                                <div
                                    key={request.id}
                                    style={requestCardStyle}
                                >

                                    <div style={requestTop}>

                                        <span style={requestNumber}>
                                            Request #{request.id}
                                        </span>

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

                                        <p>
                                            <strong>
                                                📦 Resource ID:
                                            </strong>{" "}
                                            {request.resourceId}
                                        </p>

                                        <p>
                                            <strong>
                                                👤 Owner:
                                            </strong>{" "}
                                            {request.ownerName}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                <section style={sectionStyle}>

                    <div style={sectionHeaderStyle}>

                        <div style={sectionTitleArea}>

                            <span style={sectionIcon}>
                                📩
                            </span>

                            <div>

                                <h2 style={sectionTitle}>
                                    Requests I Received
                                </h2>

                                <p style={sectionSubtitle}>
                                    Manage requests from other students
                                </p>

                            </div>

                        </div>

                        <span style={countBadge}>
                            {receivedRequests.length}
                        </span>

                    </div>

                    {receivedRequests.length === 0 ? (

                        <div style={emptyStyle}>

                            <div style={emptyIcon}>
                                📬
                            </div>

                            <h3>
                                No requests received
                            </h3>

                            <p>
                                You don't have any resource requests yet.
                            </p>

                        </div>

                    ) : (

                        <div style={requestGrid}>

                            {receivedRequests.map((request) => (

                                <div
                                    key={request.id}
                                    style={requestCardStyle}
                                >

                                    <div style={requestTop}>

                                        <span style={requestNumber}>
                                            Request #{request.id}
                                        </span>

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

                                        <p>
                                            <strong>
                                                👤 Requested by:
                                            </strong>{" "}
                                            {request.requesterName}
                                        </p>

                                        <p>
                                            <strong>
                                                ✉️ Email:
                                            </strong>{" "}
                                            {request.requesterEmail}
                                        </p>

                                        <p>
                                            <strong>
                                                📦 Resource ID:
                                            </strong>{" "}
                                            {request.resourceId}
                                        </p>

                                    </div>

                                    {request.status === "PENDING" && (

                                        <div style={actionButtons}>

                                            <button
                                                onClick={() =>
                                                    updateRequestStatus(
                                                        request.id,
                                                        "ACCEPTED"
                                                    )
                                                }
                                                style={acceptButton}
                                            >
                                                ✅ Accept
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateRequestStatus(
                                                        request.id,
                                                        "REJECTED"
                                                    )
                                                }
                                                style={rejectButton}
                                            >
                                                ❌ Reject
                                            </button>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>

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
    background: "rgba(255, 255, 255, 0.97)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 45px",
    boxShadow: "0 3px 18px rgba(79, 70, 229, 0.12)",
    position: "sticky",
    top: 0,
    zIndex: 10
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
    color: "#374151",
    fontSize: "14px"
};

const activeNavButton = {
    ...navButton,
    background: "#ede9fe",
    color: "#6d28d9",
    fontWeight: "bold"
};

const logoutButton = {
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px"
};

const mainStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "45px 30px"
};

const headingContainer = {
    marginBottom: "30px"
};

const smallTitleStyle = {
    color: "#7c3aed",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    marginBottom: "8px"
};

const headingStyle = {
    fontSize: "36px",
    margin: "0 0 8px",
    color: "#312e81"
};

const subtitleStyle = {
    color: "#6b7280",
    fontSize: "16px"
};

const profileCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
    color: "white",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(79, 70, 229, 0.25)",
    marginBottom: "30px"
};

const profileAvatar = {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    border: "3px solid rgba(255,255,255,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold"
};

const profileName = {
    margin: "0 0 8px",
    fontSize: "28px"
};

const profileEmail = {
    margin: "0 0 12px",
    opacity: 0.9
};

const roleBadge = {
    display: "inline-block",
    padding: "6px 13px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.18)",
    fontSize: "13px",
    fontWeight: "bold"
};

const sectionStyle = {
    background: "rgba(255,255,255,0.96)",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 7px 22px rgba(79,70,229,0.09)",
    border: "1px solid #e0e7ff",
    marginBottom: "30px"
};

const sectionHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
};

const sectionTitleArea = {
    display: "flex",
    alignItems: "center"
};

const sectionIcon = {
    fontSize: "28px",
    marginRight: "12px"
};

const sectionTitle = {
    margin: 0,
    color: "#312e81",
    fontSize: "22px"
};

const sectionSubtitle = {
    margin: "5px 0 0",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
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
    marginBottom: "18px"
};

const requestNumber = {
    fontWeight: "bold",
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
    fontSize: "14px"
};

const actionButtons = {
    display: "flex",
    gap: "10px",
    marginTop: "18px"
};

const acceptButton = {
    flex: 1,
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
};

const rejectButton = {
    flex: 1,
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
};

const emptyStyle = {
    textAlign: "center",
    padding: "35px 20px",
    background: "#f8faff",
    borderRadius: "12px"
};

const emptyIcon = {
    fontSize: "42px",
    marginBottom: "10px"
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