import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";


// ==========================================
// Get Current User Role
// ==========================================

const getCurrentUserRole = () => {

    // ==========================================
    // 1. Read role directly from JWT
    // ==========================================

    const token =
        localStorage.getItem("token");

    if (token) {

        try {

            const tokenParts =
                token.split(".");

            if (tokenParts.length === 3) {

                // JWT payload is the second part
                const base64Payload =
                    tokenParts[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");

                const paddedPayload =
                    base64Payload.padEnd(
                        base64Payload.length +
                        (
                            4 -
                            base64Payload.length % 4
                        ) % 4,
                        "="
                    );

                const payload =
                    JSON.parse(
                        atob(paddedPayload)
                    );

                // --------------------------------------
                // Possible JWT role fields
                // --------------------------------------

                let role =
                    payload?.role ||
                    payload?.roles ||
                    payload?.authority ||
                    payload?.authorities;

                // --------------------------------------
                // If role is an array
                // --------------------------------------

                if (Array.isArray(role)) {

                    role = role[0];
                }

                // --------------------------------------
                // If role exists
                // --------------------------------------

                if (role) {

                    return String(role)
                        .replace("ROLE_", "")
                        .toUpperCase();
                }
            }

        } catch (error) {

            console.error(
                "Unable to read role from JWT:",
                error
            );
        }
    }

    // ==========================================
    // 2. Read from user object
    // ==========================================

    const storedUser =
        localStorage.getItem("user");

    if (storedUser) {

        try {

            const user =
                JSON.parse(storedUser);

            let role =
                user?.role ||
                user?.userRole ||
                user?.authority ||
                user?.authorities;

            // --------------------------------------
            // If role is an array
            // --------------------------------------

            if (Array.isArray(role)) {

                role = role[0];
            }

            if (role) {

                return String(role)
                    .replace("ROLE_", "")
                    .toUpperCase();
            }

        } catch (error) {

            console.error(
                "Unable to parse user:",
                error
            );
        }
    }

    // ==========================================
    // 3. Fallback to separate role
    // ==========================================

    const storedRole =
        localStorage.getItem("role");

    if (storedRole) {

        return String(storedRole)
            .replace("ROLE_", "")
            .toUpperCase();
    }

    // ==========================================
    // 4. Final fallback
    // ==========================================

    return "STUDENT";
};


// ==========================================
// Sidebar Component
// ==========================================

function Sidebar({
                     mobileOpen,
                     handleDrawerToggle,
                 }) {

    const navigate =
        useNavigate();

    // ==========================================
    // Get Current Role
    // ==========================================

    const userRole =
        getCurrentUserRole();

    // ==========================================
    // All Menu Items
    // ==========================================

    const allMenuItems = [

        // ==========================================
        // Dashboard
        // ==========================================

        {
            label: "Dashboard",

            path: "/",

            icon:
                <DashboardIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
                "STUDENT",
                "EMPLOYER",
            ],
        },

        // ==========================================
        // Universities
        // ADMIN ONLY
        // ==========================================

        {
            label: "Universities",

            path: "/universities",

            icon:
                <SchoolIcon />,

            roles: [
                "ADMIN",
            ],
        },

        // ==========================================
        // Students
        // ADMIN + UNIVERSITY
        // ==========================================

        {
            label: "Students",

            path: "/students",

            icon:
                <PeopleIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
            ],
        },

        // ==========================================
        // Courses
        // ADMIN + UNIVERSITY
        // ==========================================

        {
            label: "Courses",

            path: "/courses",

            icon:
                <MenuBookIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
            ],
        },

        // ==========================================
        // Certificates
        // ALL ROLES
        // ==========================================

        {
            label: "Certificates",

            path: "/certificates",

            icon:
                <WorkspacePremiumIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
                "STUDENT",
                "EMPLOYER",
            ],
        },

        // ==========================================
        // Verify Certificate
        // ALL ROLES
        // ==========================================

        {
            label: "Verify Certificate",

            path: "/verify-certificate",

            icon:
                <VerifiedIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
                "STUDENT",
                "EMPLOYER",
            ],
        },

        // ==========================================
        // Blockchain Dashboard
        // ALL ROLES
        // ==========================================

        {
            label: "Blockchain",

            path: "/blockchain",

            icon:
                <AccountBalanceWalletIcon />,

            roles: [
                "ADMIN",
                "UNIVERSITY",
                "STUDENT",
                "EMPLOYER",
            ],
        },

    ];


    // ==========================================
    // Filter Menu Based On Role
    // ==========================================

    const menuItems =
        allMenuItems.filter(
            (item) =>
                item.roles.includes(
                    userRole
                )
        );


    // ==========================================
    // Navigation Handler
    // ==========================================

    const handleNavigation = (
        event,
        path
    ) => {

        // Remove focus
        event.currentTarget.blur();

        // Navigate
        navigate(path);

        // Close mobile drawer
        if (handleDrawerToggle) {

            handleDrawerToggle();
        }
    };


    // ==========================================
    // Sidebar Content
    // ==========================================

    const drawerContent = (

        <Box
            sx={{
                width: 250,

                height: "100%",

                backgroundColor:
                    "#111827",

                color: "white",

                display: "flex",

                flexDirection: "column",
            }}
        >

            {/* ==========================================
                Logo
            ========================================== */}

            <Box
                sx={{
                    padding:
                        "24px 20px",

                    borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
                }}
            >

                <Typography
                    variant="h5"

                    sx={{
                        fontWeight: 700,

                        color:
                            "#60a5fa",
                    }}
                >
                    EduChain
                </Typography>


                <Typography
                    variant="body2"

                    sx={{
                        color:
                            "#9ca3af",

                        marginTop:
                            "4px",
                    }}
                >
                    Certificate Platform
                </Typography>


                {/* ==========================================
                    Current Role
                ========================================== */}

                <Typography
                    variant="caption"

                    sx={{
                        display:
                            "block",

                        color:
                            "#6b7280",

                        marginTop:
                            "8px",

                        fontWeight: 600,

                        letterSpacing:
                            "0.5px",
                    }}
                >
                    {userRole}
                </Typography>

            </Box>


            {/* ==========================================
                Navigation
            ========================================== */}

            <List
                sx={{
                    padding:
                        "16px 12px",
                }}
            >

                {menuItems.map(
                    (item) => (

                        <ListItemButton
                            key={
                                item.label
                            }

                            onClick={(
                                event
                            ) =>
                                handleNavigation(
                                    event,
                                    item.path
                                )
                            }

                            sx={{
                                borderRadius: 2,

                                marginBottom: 1,

                                "&:hover": {
                                    backgroundColor:
                                        "#1f2937",
                                },
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    color:
                                        "#60a5fa",

                                    minWidth: 42,
                                }}
                            >

                                {
                                    item.icon
                                }

                            </ListItemIcon>


                            <ListItemText
                                primary={
                                    item.label
                                }

                                sx={{
                                    "& .MuiListItemText-primary": {
                                        fontWeight: 500,
                                    },
                                }}
                            />

                        </ListItemButton>

                    )
                )}

            </List>

        </Box>
    );


    // ==========================================
    // Render Sidebar
    // ==========================================

    return (

        <>

            {/* ==========================================
                Desktop Sidebar
            ========================================== */}

            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },

                    position:
                        "fixed",

                    left: 0,

                    top: 0,

                    bottom: 0,

                    width: 250,

                    zIndex: 1200,
                }}
            >

                {drawerContent}

            </Box>


            {/* ==========================================
                Mobile Sidebar
            ========================================== */}

            <Drawer
                variant="temporary"

                open={
                    mobileOpen
                }

                onClose={
                    handleDrawerToggle
                }

                ModalProps={{
                    keepMounted: true,
                }}

                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },

                    "& .MuiDrawer-paper": {

                        width: 250,

                        boxSizing:
                            "border-box",

                        backgroundColor:
                            "#111827",
                    },
                }}
            >

                {drawerContent}

            </Drawer>

        </>

    );
}

export default Sidebar;