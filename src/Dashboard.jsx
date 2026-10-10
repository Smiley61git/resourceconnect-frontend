
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    const isAdmin = userRole?.toUpperCase() === "ADMIN";

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/dashboard")}>
                    📚 ResourceConnect
                </div>

                <div className="nav-links">
                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/resources")}>
                        Resources
                    </button>

                    <button onClick={() => navigate("/profile")}>
                        Profile
                    </button>

                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <section className="hero-section">
                    <div className="hero-text">
                        <p className="small-title">
                            RESOURCE SHARING PLATFORM
                        </p>

                        <h1>
                            Welcome{userName ? `, ${userName}` : ""} 👋
                        </h1>

                        <p className="hero-description">
                            {isAdmin
                                ? "Manage and monitor the ResourceConnect platform."
                                : "Connect, share and access useful academic resources in one place."}
                        </p>

                        {userRole && (
                            <div className="role-badge">{userRole}</div>
                        )}
                    </div>

                    <div className="hero-icon">📚</div>
                </section>

                <section className="cards">
                    <div className="card">
                        <div className="card-icon">📚</div>
                        <h2>Resources</h2>
                        <p>
                            Browse and access learning resources shared by
                            students and faculty.
                        </p>
                        <button onClick={() => navigate("/resources")}>
                            View Resources →
                        </button>
                    </div>

                    {!isAdmin && (
                        <div className="card">
                            <div className="card-icon">📤</div>
                            <h2>Upload Resource</h2>
                            <p>
                                Share notes, PDFs, assignments and other
                                useful academic materials.
                            </p>
                            <button onClick={() => navigate("/resources")}>
                                Upload Resource →
                            </button>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-icon">👤</div>
                        <h2>My Profile</h2>
                        <p>
                            View and manage your ResourceConnect account
                            information.
                        </p>
                        <button onClick={() => navigate("/profile")}>
                            View Profile →
                        </button>
                    </div>
                </section>

                <section className="about-section">
                    <div className="about-header">
                        <p className="small-title">OUR PLATFORM</p>
                        <h2>About ResourceConnect</h2>
                        <p>
                            ResourceConnect helps students and faculty share
                            and access educational resources easily.
                        </p>
                    </div>

                    <div className="features">
                        <div className="feature">
                            <div className="feature-icon">📖</div>
                            <div>
                                <h3>Share</h3>
                                <p>
                                    Share useful academic materials with your
                                    community.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <div className="feature-icon">🔍</div>
                            <div>
                                <h3>Discover</h3>
                                <p>
                                    Find learning resources quickly and easily.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <div className="feature-icon">🤝</div>
                            <div>
                                <h3>Connect</h3>
                                <p>
                                    Connect students and faculty through
                                    resource sharing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;