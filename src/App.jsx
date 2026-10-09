import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Resources from "./Resources";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminStatistics from "./AdminStatistics";
import AdminRoute from "./AdminRoute";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/resources"
                    element={<Resources />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/statistics"
                    element={
                        <AdminRoute>
                            <AdminStatistics />
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;