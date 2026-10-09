import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://resourceconnect-backend.onrender.com";

function Resources() {
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("ALL");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("Python");
    const [resourceType, setResourceType] = useState("PDF");
    const [resourceUrl, setResourceUrl] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const uploadedBy = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    const fetchResources = async () => {
        try {
            const response = await axios.get(`${API}/api/resources`);
            setResources(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            alert("Unable to load resources. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
            return;
        }

        fetchResources();
    }, [navigate, userEmail]);

    const clearForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setSubject("Python");
        setResourceType("PDF");
        setResourceUrl("");
    };

    const handleAddResource = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API}/api/resources`, {
                title,
                description,
                subject,
                resourceType,
                resourceUrl,
                uploadedBy
            });

            alert("Resource added successfully!");
            clearForm();
            await fetchResources();
        } catch (error) {
            console.error(error);
            alert("Unable to add resource. Please check the backend.");
        }
    };

    const handleEdit = (resource) => {
        setEditingId(resource.id);
        setTitle(resource.title || "");
        setDescription(resource.description || "");
        setSubject(resource.subject || "Other");
        setResourceType(resource.resourceType || "PDF");
        setResourceUrl(resource.resourceUrl || "");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API}/api/resources/${editingId}`, {
                title,
                description,
                subject,
                resourceType,
                resourceUrl,
                uploadedBy
            });

            alert("Resource updated successfully!");
            clearForm();
            await fetchResources();
        } catch (error) {
            console.error(error);
            alert("Unable to update resource.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) {
            return;
        }

        try {
            await axios.delete(`${API}/api/resources/${id}`);
            alert("Resource deleted successfully!");
            await fetchResources();
        } catch (error) {
            console.error(error);
            alert("Unable to delete resource.");
        }
    };

    const handleRequest = async (resource) => {
        if (!window.confirm(`Do you want to request "${resource.title}" from ${resource.uploadedBy}?`)) {
            return;
        }

        try {
            await axios.post(`${API}/api/requests`, {
                resourceId: resource.id,
                requesterName: uploadedBy,
                requesterEmail: userEmail,
                ownerName: resource.uploadedBy,
                status: "PENDING"
            });

            alert("Resource request sent successfully!");
        } catch (error) {
            console.error(error);
            alert("Unable to send resource request.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const filteredResources = resources.filter((resource) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            (resource.title || "").toLowerCase().includes(searchText) ||
            (resource.subject || "").toLowerCase().includes(searchText) ||
            (resource.description || "").toLowerCase().includes(searchText);

        const matchesSubject =
            subjectFilter === "ALL" || resource.subject === subjectFilter;

        return matchesSearch && matchesSubject;
    });

    const subjects = [
        "ALL",
        ...new Set(resources.map((resource) => resource.subject).filter(Boolean))
    ];

    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <h2 style={styles.brand}>📚 ResourceConnect</h2>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate("/dashboard")} style={styles.navButton}>
                        Dashboard
                    </button>
                    <button onClick={() => navigate("/resources")} style={styles.activeNav}>
                        Resources
                    </button>
                    <button onClick={() => navigate("/profile")} style={styles.navButton}>
                        Profile
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </nav>

            <main style={styles.main}>
                <p style={styles.eyebrow}>RESOURCE SHARING PLATFORM</p>
                <h1 style={styles.heading}>📚 Academic Resources</h1>
                <p style={styles.subtitle}>
                    Find, share and request useful resources in one place.
                </p>

                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="🔍 Search by title, subject or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />

                    <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        style={styles.selectFilter}
                    >
                        {subjects.map((item) => (
                            <option key={item} value={item}>
                                {item === "ALL" ? "All Subjects" : item}
                            </option>
                        ))}
                    </select>
                </div>

                <section style={styles.formSection}>
                    <div style={styles.formHeader}>
                        <h2>{editingId ? "✏️ Edit Resource" : "📤 Add New Resource"}</h2>
                        <p>Share useful academic resources with your community.</p>
                    </div>

                    <div style={styles.formBody}>
                        <p style={styles.uploader}>
                            Uploaded by: <strong>{uploadedBy || "User"}</strong>
                        </p>

                        <form onSubmit={editingId ? handleUpdate : handleAddResource}>
                            <input
                                type="text"
                                placeholder="📚 Resource Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={styles.input}
                            />

                            <textarea
                                placeholder="📝 Resource Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                style={styles.input}
                            />

                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                style={styles.input}
                            >
                                <option>Python</option>
                                <option>Java</option>
                                <option>DBMS</option>
                                <option>Data Structures</option>
                                <option>Machine Learning</option>
                                <option>Artificial Intelligence</option>
                                <option>Web Development</option>
                                <option>Other</option>
                            </select>

                            <select
                                value={resourceType}
                                onChange={(e) => setResourceType(e.target.value)}
                                style={styles.input}
                            >
                                <option>PDF</option>
                                <option>Notes</option>
                                <option>Video</option>
                                <option>Assignment</option>
                                <option>Question Paper</option>
                                <option>Book</option>
                                <option>Link</option>
                                <option>Other</option>
                            </select>

                            <input
                                type="url"
                                placeholder="🔗 Resource URL (https://...)"
                                value={resourceUrl}
                                onChange={(e) => setResourceUrl(e.target.value)}
                                required
                                style={styles.input}
                            />

                            <button type="submit" style={styles.primaryButton}>
                                {editingId ? "💾 Save Changes" : "➕ Add Resource"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={clearForm}
                                    style={styles.cancelButton}
                                >
                                    ❌ Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </section>

                <div style={styles.listHeader}>
                    <h2>Available Resources</h2>
                    <span style={styles.count}>{filteredResources.length} Resources</span>
                </div>

                {loading ? (
                    <p style={styles.empty}>Loading resources...</p>
                ) : filteredResources.length === 0 ? (
                    <div style={styles.empty}>
                        <div style={{ fontSize: "48px" }}>📭</div>
                        <h3>No resources found</h3>
                        <p>Try another search or add a new resource.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredResources.map((resource) => (
                            <article key={resource.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <span style={{ fontSize: "36px" }}>📄</span>
                                    <span style={styles.typeBadge}>
                                        {resource.resourceType || "Resource"}
                                    </span>
                                </div>

                                <h2 style={styles.cardTitle}>{resource.title}</h2>
                                <p style={styles.description}>
                                    {resource.description || "No description provided."}
                                </p>
                                <p><strong>Subject:</strong> {resource.subject}</p>
                                <p><strong>Shared by:</strong> {resource.uploadedBy}</p>

                                <div style={styles.cardActions}>
                                    <button
                                        onClick={() => window.open(resource.resourceUrl, "_blank", "noopener,noreferrer")}
                                        style={styles.primaryButton}
                                    >
                                        🔗 Open
                                    </button>

                                    {resource.uploadedBy === uploadedBy ? (
                                        <>
                                            <button onClick={() => handleEdit(resource)} style={styles.editButton}>
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => handleDelete(resource.id)} style={styles.deleteButton}>
                                                🗑️ Delete
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleRequest(resource)} style={styles.requestButton}>
                                            📝 Request Resource
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f6ff, #f5f3ff, #faf5ff)",
        fontFamily: "Arial, sans-serif",
        color: "#312e81"
    },
    nav: {
        background: "rgba(255,255,255,0.97)",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        boxShadow: "0 3px 18px rgba(79,70,229,0.12)",
        position: "sticky",
        top: 0,
        zIndex: 10
    },
    brand: { margin: 0, color: "#4f46e5" },
    navLinks: { display: "flex", flexWrap: "wrap", gap: "8px" },
    navButton: {
        padding: "10px 14px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "transparent",
        color: "#374151"
    },
    activeNav: {
        padding: "10px 14px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        color: "#2563eb",
        background: "#eff6ff"
    },
    logoutButton: {
        padding: "10px 14px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "#dc2626",
        color: "white"
    },
    main: { maxWidth: "1200px", margin: "auto", padding: "40px 25px" },
    eyebrow: {
        color: "#7c3aed",
        fontSize: "13px",
        fontWeight: "bold",
        letterSpacing: "1.5px"
    },
    heading: { fontSize: "34px", margin: "10px 0", color: "#312e81" },
    subtitle: { color: "#6b7280", fontSize: "17px", marginBottom: "30px" },
    filters: {
        background: "white",
        padding: "20px",
        borderRadius: "14px",
        boxShadow: "0 5px 18px rgba(79,70,229,0.08)",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "30px",
        border: "1px solid #e0e7ff"
    },
    searchInput: {
        flex: 1,
        minWidth: "250px",
        padding: "13px",
        border: "1px solid #c7d2fe",
        borderRadius: "8px",
        fontSize: "15px",
        boxSizing: "border-box"
    },
    selectFilter: {
        padding: "13px",
        border: "1px solid #c7d2fe",
        borderRadius: "8px",
        minWidth: "180px",
        fontSize: "15px"
    },
    formSection: {
        background: "linear-gradient(135deg, #eef4ff, #f5f0ff)",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(79,70,229,0.12)",
        marginBottom: "40px",
        border: "1px solid #ddd6fe"
    },
    formHeader: {
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "white",
        padding: "20px 24px",
        borderRadius: "14px",
        marginBottom: "25px"
    },
    formBody: {
        background: "rgba(255,255,255,0.9)",
        padding: "22px",
        borderRadius: "14px",
        border: "1px solid #e0e7ff"
    },
    uploader: { color: "#4f46e5", marginTop: 0, marginBottom: "18px" },
    input: {
        width: "100%",
        padding: "13px",
        marginBottom: "15px",
        border: "1px solid #c7d2fe",
        borderRadius: "8px",
        boxSizing: "border-box",
        fontSize: "15px",
        background: "#f8faff"
    },
    primaryButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px 16px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px"
    },
    cancelButton: {
        background: "#6b7280",
        color: "white",
        border: "none",
        padding: "12px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        marginLeft: "10px"
    },
    listHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px"
    },
    count: {
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "7px 13px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "bold"
    },
    empty: {
        background: "white",
        padding: "45px 25px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow: "0 5px 18px rgba(79,70,229,0.06)",
        color: "#6b7280"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px"
    },
    card: {
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        boxShadow: "0 5px 18px rgba(79,70,229,0.08)",
        border: "1px solid #e0e7ff",
        overflowWrap: "anywhere"
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px"
    },
    typeBadge: {
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "6px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        fontWeight: "bold"
    },
    cardTitle: { color: "#312e81", overflowWrap: "anywhere" },
    description: { color: "#6b7280", lineHeight: "1.6", minHeight: "50px" },
    cardActions: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "20px"
    },
    requestButton: {
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "11px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px"
    },
    editButton: {
        background: "#f59e0b",
        color: "white",
        border: "none",
        padding: "11px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px"
    },
    deleteButton: {
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "11px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px"
    }
};

export default Resources;
