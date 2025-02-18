import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import DashboardLayoutBranding from "./components/DashboardSidebarAccountFooter.jsx";
import Home from "./pages/Home";
import Map from "./pages/map";
import Chat from "./pages/chat";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function DashboardLayout() {
    return (
        <DashboardLayoutBranding>
            <Outlet /> {/* מאפשר הצגת הקומפוננטות הפנימיות */}
        </DashboardLayoutBranding>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* נתיב ל-Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* נתיבים תחת הלייאאוט */}
                <Route path="/" element={<DashboardLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="map" element={<Map />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
