import PropTypes from "prop-types";
import { Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useMemo, lazy, Suspense, useState, useEffect } from "react";
import { CircularProgress, Box, Skeleton } from "@mui/material";

// Lazy load page components
const HomePage = lazy(() => import("../pages/Home"));
const MapPage = lazy(() => import("../pages/map"));
const ChatPage = lazy(() => import("../pages/chat"));
const Login = lazy(() => import("../pages/Login"));

// Move theme creation outside the component
const createAppTheme = (prefersDarkMode = true) =>
    createTheme({
        cssVariables: {
            colorSchemeSelector: "data-toolpad-color-scheme",
        },
        colorSchemes: { light: true, dark: true },
        palette: {
            mode: prefersDarkMode ? "dark" : "light",
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 600,
                lg: 1200,
                xl: 1536,
            },
        },
    });

const NAVIGATION = [
    {
        kind: "header",
        title: "Main items",
    },
    {
        segment: "home",
        title: "Home",
    },
    {
        segment: "map",
        title: "CV Preview",
    },
    {
        segment: "chat",
        title: "Chat",
    },
    {
        segment: "login",
        title: "Logout",
    },
];

// Loading component for routes
const PageLoader = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
        }}
    >
        <CircularProgress size={40} />
        <Box sx={{ mt: 2 }}>Loading content...</Box>
    </Box>
);

// Logo component with loading state
const LogoWithFallback = () => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <>
            {!loaded && !error && (
                <Skeleton
                    variant="rectangular"
                    width={40}
                    height={40}
                    animation="wave"
                />
            )}
            <img
                src="../src/assets/11.jpeg"
                alt="israel"
                width={40}
                height={40}
                style={{
                    objectFit: "contain",
                    display: loaded && !error ? "block" : "none",
                }}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setError(true);
                    setLoaded(true);
                }}
            />
            {error && (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    IS
                </Box>
            )}
        </>
    );
};

function DashboardLayoutBranding(props) {
    const { window, prefersDarkMode = true } = props;
    const demoWindow = window !== undefined ? window() : undefined;
    const [appReady, setAppReady] = useState(false);

    // Simulate initial app loading
    useEffect(() => {
        // Give time for critical resources to load
        const timer = setTimeout(() => {
            setAppReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Memoize the theme to prevent recreation on every render
    const demoTheme = useMemo(() => {
        return createAppTheme(prefersDarkMode);
    }, [prefersDarkMode]);

    // Memoize the branding object to maintain referential equality
    const branding = useMemo(
        () => ({
            logo: <LogoWithFallback />,
            title: "israel",
            homeUrl: "/toolpad/core/introduction",
        }),
        []
    );

    if (!appReady) {
        return (
            <Box
                sx={{
                    display: "flex",
                    height: "100vh",
                    width: "100vw",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: prefersDarkMode ? "#121212" : "#ffffff",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={branding}
            theme={demoTheme}
        >
            <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Suspense>
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutBranding.propTypes = {
    window: PropTypes.func,
    prefersDarkMode: PropTypes.bool,
};

export default DashboardLayoutBranding;
