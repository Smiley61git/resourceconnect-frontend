import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const uploadedBy = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    const fetchResources = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8081/api/resources"
            );

            setResources(response.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load resources.");

        }
    };

    useEffect(() => {

        const email = localStorage.getItem("userEmail");

        if (!email) {
            navigate("/");
            return;
        }

        fetchResources();

    }, [navigate]);

    const handleAddResource = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8081/api/resources",
                {
                    title,
                    description,
                    subject,
                    resourceType,
                    resourceUrl,
                    uploadedBy
                }
            );

            alert("Resource added successfully!");

            clearForm();
            fetchResources();

        } catch (error) {

            console.error(error);
            alert("Unable to add resource.");

        }
    };

    const handleEdit = (resource) => {

        setEditingId(resource.id);
        setTitle(resource.title);
        setDescription(resource.description);
        setSubject(resource.subject);
        setResourceType(resource.resourceType);
        setResourceUrl(resource.resourceUrl);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            await axios.put(
                `http://localhost:8081/api/resources/${editingId}`,
                {
                    title,
                    description,
                    subject,
                    resourceType,
                    resourceUrl,
                    uploadedBy
                }
            );

            alert("Resource updated successfully!");

            clearForm();
            fetchResources();

        } catch (error) {

            console.error(error);
            alert("Unable to update resource.");

        }
    };

    const cancelEdit = () => {
        clearForm();
    };

    const clearForm = () => {

        setEditingId(null);
        setTitle("");
        setDescription("");
        setSubject("Python");
        setResourceType("PDF");
        setResourceUrl("");

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:8081/api/resources/${id}`
            );

            alert("Resource deleted successfully!");

            fetchResources();

        } catch (error) {

            console.error(error);
            alert("Unable to delete resource.");

        }
    };

    const handleRequest = async (resource) => {

        const confirmRequest = window.confirm(
            `Do you want to request "${resource.title}" from ${resource.uploadedBy}?`
        );

        if (!confirmRequest) {
            return;
        }

        try {

            await axios.post(
                "http://localhost:8081/api/requests",
                {
                    resourceId: resource.id,
                    requesterName: uploadedBy,
                    requesterEmail: userEmail,
                    ownerName: resource.uploadedBy,
                    status: "PENDING"
                }
            );

            alert("Resource request sent successfully!");

        } catch (error) {

            console.error(error);
            alert("Unable to send resource request.");

        }
    };

    const filteredResources = resources.filter((resource) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            resource.title.toLowerCase().includes(searchText) ||
            resource.subject.toLowerCase().includes(searchText) ||
            (
                resource.description &&
                resource.description
                    .toLowerCase()
                    .includes(searchText)
            );

        const matchesSubject =
            subjectFilter === "ALL" ||
            resource.subject === subjectFilter;

        return matchesSearch && matchesSubject;

    });

    const subjects = [
        "ALL",
        ...new Set(
            resources.map(
                (resource) => resource.subject
            )
        )
    ];

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
                background: "linear-gradient(135deg, #f3f6ff, #f5f3ff, #faf5ff)",
                fontFamily: "Arial, sans-serif"
            }}
        >

            <nav
                style={{
                    background: "rgba(255,255,255,0.97)",
                    padding: "18px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 3px 18px rgba(79,70,229,0.12)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        color: "#4f46e5"
                    }}
                >
                    📚 ResourceConnect
                </h2>

                <div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={navButton}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/resources")}
                        style={{
                            ...navButton,
                            color: "#2563eb",
                            background: "#eff6ff"
                        }}
                    >
                        Resources
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        style={navButton}
                    >
                        Profile
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

            <main
                style={{
                    maxWidth: "1200px",
                    margin: "auto",
                    padding: "40px 30px"
                }}
            >

                <div
                    style={{
                        marginBottom: "30px"
                    }}
                >

                    <p
                        style={{
                            color: "#7c3aed",
                            fontSize: "13px",
                            fontWeight: "bold",
                            letterSpacing: "1.5px",
                            marginBottom: "8px"
                        }}
                    >
                        RESOURCE SHARING PLATFORM
                    </p>

                    <h1
                        style={{
                            fontSize: "34px",
                            color: "#312e81",
                            margin: "0 0 10px"
                        }}
                    >
                        📚 Academic Resources
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "17px"
                        }}
                    >
                        Find, share and request useful resources in one place.
                    </p>

                </div>

                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "14px",
                        boxShadow: "0 5px 18px rgba(79,70,229,0.08)",
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginBottom: "30px",
                        border: "1px solid #e0e7ff"
                    }}
                >

                    <input
                        type="text"
                        placeholder="🔍 Search by title, subject or description..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            flex: 1,
                            minWidth: "280px",
                            padding: "13px",
                            border: "1px solid #c7d2fe",
                            borderRadius: "8px",
                            fontSize: "15px",
                            boxSizing: "border-box",
                            background: "#f8faff"
                        }}
                    />

                    <select
                        value={subjectFilter}
                        onChange={(e) =>
                            setSubjectFilter(e.target.value)
                        }
                        style={{
                            padding: "13px",
                            border: "1px solid #c7d2fe",
                            borderRadius: "8px",
                            background: "#f8faff",
                            minWidth: "180px",
                            fontSize: "15px"
                        }}
                    >

                        {subjects.map((item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item === "ALL"
                                    ? "All Subjects"
                                    : item}
                            </option>

                        ))}

                    </select>

                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #eef4ff, #f5f0ff)",
                        padding: "32px",
                        borderRadius: "18px",
                        boxShadow: "0 8px 25px rgba(79,70,229,0.12)",
                        marginBottom: "40px",
                        border: "1px solid #ddd6fe"
                    }}
                >

                    <div
                        style={{
                            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                            color: "white",
                            padding: "20px 24px",
                            borderRadius: "14px",
                            marginBottom: "25px"
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "24px"
                            }}
                        >
                            {editingId
                                ? "✏️ Edit Resource"
                                : "📤 Add New Resource"}
                        </h2>

                        <p
                            style={{
                                margin: "8px 0 0",
                                opacity: 0.9,
                                fontSize: "14px"
                            }}
                        >
                            Share useful academic resources with your community.
                        </p>

                    </div>

                    <div
                        style={{
                            background: "rgba(255,255,255,0.9)",
                            padding: "22px",
                            borderRadius: "14px",
                            border: "1px solid #e0e7ff"
                        }}
                    >

                        <p
                            style={{
                                color: "#4f46e5",
                                marginTop: 0,
                                marginBottom: "18px",
                                fontSize: "14px"
                            }}
                        >
                            Uploaded by:{" "}
                            <strong>
                                {uploadedBy}
                            </strong>
                        </p>

                        <form
                            onSubmit={
                                editingId
                                    ? handleUpdate
                                    : handleAddResource
                            }
                        >

                            <input
                                type="text"
                                placeholder="📚 Resource Title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                                style={{
                                    ...inputStyle,
                                    background: "#f8faff",
                                    border: "1px solid #c7d2fe"
                                }}
                            />

                            <textarea
                                placeholder="📝 Resource Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="4"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                    background: "#f8faff",
                                    border: "1px solid #c7d2fe"
                                }}
                            />

                            <select
                                value={subject}
                                onChange={(e) =>
                                    setSubject(e.target.value)
                                }
                                style={{
                                    ...inputStyle,
                                    background: "#f8faff",
                                    border: "1px solid #c7d2fe"
                                }}
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
                                onChange={(e) =>
                                    setResourceType(e.target.value)
                                }
                                style={{
                                    ...inputStyle,
                                    background: "#f8faff",
                                    border: "1px solid #c7d2fe"
                                }}
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
                                placeholder="🔗 Resource URL"
                                value={resourceUrl}
                                onChange={(e) =>
                                    setResourceUrl(e.target.value)
                                }
                                required
                                style={{
                                    ...inputStyle,
                                    background: "#f8faff",
                                    border: "1px solid #c7d2fe"
                                }}
                            />

                            <button
                                type="submit"
                                style={{
                                    ...primaryButton,
                                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                                    padding: "12px 22px",
                                    fontWeight: "bold",
                                    boxShadow: "0 5px 12px rgba(79,70,229,0.25)"
                                }}
                            >
                                {editingId
                                    ? "💾 Save Changes"
                                    : "➕ Add Resource"}
                            </button>

                            {editingId && (

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    style={cancelButton}
                                >
                                    ❌ Cancel
                                </button>

                            )}

                        </form>

                    </div>

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            color: "#312e81"
                        }}
                    >
                        Available Resources
                    </h2>

                    <span
                        style={{
                            background: "#ede9fe",
                            color: "#6d28d9",
                            padding: "7px 13px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "bold"
                        }}
                    >
                        {filteredResources.length} Resources
                    </span>

                </div>

                {filteredResources.length === 0 ? (

                    <div
                        style={{
                            background: "white",
                            padding: "50px 30px",
                            borderRadius: "14px",
                            textAlign: "center",
                            boxShadow: "0 5px 18px rgba(79,70,229,0.06)",
                            border: "1px solid #e0e7ff"
                        }}
                    >

                        <div style={{ fontSize: "50px" }}>
                            📭
                        </div>

                        <h3>
                            No resources found
                        </h3>

                        <p
                            style={{
                                color: "#6b7280"
                            }}
                        >
                            Try another search or add a new resource.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "25px"
                        }}
                    >

                        {filteredResources.map((resource) => (

                            <div
                                key={resource.id}
                                style={{
                                    background: "white",
                                    padding: "25px",
                                    borderRadius: "14px",
                                    boxShadow: "0 5px 18px rgba(79,70,229,0.08)",
                                    border: "1px solid #e0e7ff"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "10px"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize: "36px"
                                        }}
                                    >
                                        📄
                                    </div>

                                    <span
                                        style={{
                                            background: "#ede9fe",
                                            color: "#6d28d9",
                                            padding: "6px 10px",
                                            borderRadius: "15px",
                                            fontSize: "12px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {resource.resourceType}
                                    </span>

                                </div>

                                <h2
                                    style={{
                                        color: "#312e81"
                                    }}
                                >
                                    {resource.title}
                                </h2>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        lineHeight: "1.6",
                                        minHeight: "50px"
                                    }}
                                >
                                    {resource.description}
                                </p>

                                <p>
                                    <strong>
                                        Subject:
                                    </strong>{" "}
                                    {resource.subject}
                                </p>

                                <p>
                                    <strong>
                                        Shared by:
                                    </strong>{" "}
                                    {resource.uploadedBy}
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                        marginTop: "20px"
                                    }}
                                >

                                    <button
                                        onClick={() =>
                                            window.open(
                                                resource.resourceUrl,
                                                "_blank"
                                            )
                                        }
                                        style={primaryButton}
                                    >
                                        🔗 Open
                                    </button>

                                    {resource.uploadedBy === uploadedBy ? (

                                        <>
                                            <button
                                                onClick={() =>
                                                    handleEdit(resource)
                                                }
                                                style={editButton}
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(resource.id)
                                                }
                                                style={deleteButton}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                handleRequest(resource)
                                            }
                                            style={requestButton}
                                        >
                                            📝 Request Resource
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

const navButton = {
    marginLeft: "8px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    background: "transparent",
    color: "#374151",
    fontSize: "14px"
};

const inputStyle = {
    width: "100%",
    padding: "13px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px"
};

const primaryButton = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px"
};

const requestButton = {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px"
};

const editButton = {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px"
};

const deleteButton = {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px"
};

const cancelButton = {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    marginLeft: "10px"
};

export default Resources;