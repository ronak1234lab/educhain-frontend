import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {

    const navigate = useNavigate();


    // ==========================================
    // Get Logged-In User
    // ==========================================

    const storedUser =
        localStorage.getItem("educhainUser");

    let currentUser = null;

    try {

        currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

        currentUser = null;
    }


    // ==========================================
    // User Information
    // ==========================================

    const userName =
        currentUser?.name || "Admin";

    const userRole =
        currentUser?.role || "ADMIN";


    // ==========================================
    // Avatar Letter
    // ==========================================

    const avatarLetter =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "R";


    // ==========================================
    // Desktop Search
    // ==========================================

    const [searchValue, setSearchValue] =
        useState("");


    // ==========================================
    // Mobile Search
    // ==========================================

    const [mobileSearchOpen, setMobileSearchOpen] =
        useState(false);

    const [mobileSearchValue, setMobileSearchValue] =
        useState("");


    // ==========================================
    // Mobile Menu
    // ==========================================

    const handleMenuClick = (event) => {

        event.currentTarget.blur();

        if (onMenuClick) {
            onMenuClick();
        }
    };


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        // Remove JWT token
        localStorage.removeItem("token");

        // Remove user information
        localStorage.removeItem("user");

        // Remove role
        localStorage.removeItem("role");

        // Remove EduChain user
        localStorage.removeItem("educhainUser");

        // Navigate to login
        navigate("/login", {
            replace: true,
        });
    };


    // ==========================================
    // Desktop Search
    // ==========================================

    const handleDesktopSearch = (event) => {

        if (
            event.key === "Enter" &&
            searchValue.trim()
        ) {

            navigate(
                `/search?query=${encodeURIComponent(
                    searchValue.trim()
                )}`
            );
        }
    };


    // ==========================================
    // Mobile Search
    // ==========================================

    const handleMobileSearch = (event) => {

        if (
            event.key === "Enter" &&
            mobileSearchValue.trim()
        ) {

            navigate(
                `/search?query=${encodeURIComponent(
                    mobileSearchValue.trim()
                )}`
            );

            setMobileSearchOpen(false);
        }
    };


    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "#ffffff",
                color: "#111827",
                borderBottom:
                    "1px solid #e5e7eb",
            }}
        >

            <Toolbar
                sx={{
                    minHeight:
                        "72px !important",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    gap: 1,

                    px: {
                        xs: 1.5,
                        sm: 2,
                        md: 3,
                    },
                }}
            >

                {/* ==========================================
                    LEFT SECTION
                ========================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",

                        gap: {
                            xs: 0.5,
                            sm: 1.5,
                        },

                        minWidth: 0,

                        flex: 1,
                    }}
                >

                    {/* Mobile Menu */}

                    <IconButton
                        onClick={handleMenuClick}
                        aria-label="open navigation menu"
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },

                            color: "#111827",

                            flexShrink: 0,
                        }}
                    >

                        <MenuIcon />

                    </IconButton>


                    {/* Page Title */}

                    <Box
                        sx={{
                            minWidth: 0,
                            overflow: "hidden",
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,

                                color: "#111827",

                                whiteSpace:
                                    "nowrap",

                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",

                                fontSize: {
                                    xs: "1.1rem",
                                    sm: "1.25rem",
                                },
                            }}
                        >

                            Dashboard

                        </Typography>


                        {/* Subtitle */}

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",

                                display: {
                                    xs: "none",
                                    sm: "block",
                                },

                                whiteSpace:
                                    "nowrap",
                            }}
                        >

                            Welcome back to EduChain

                        </Typography>

                    </Box>

                </Box>


                {/* ==========================================
                    RIGHT SECTION
                ========================================== */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: {
                            xs: 0.5,
                            sm: 2,
                        },

                        flexShrink: 0,
                    }}
                >

                    {/* ==========================================
                        DESKTOP / TABLET SEARCH
                    ========================================== */}

                    <TextField
                        size="small"

                        placeholder="Search..."

                        value={searchValue}

                        onChange={(event) =>
                            setSearchValue(
                                event.target.value
                            )
                        }

                        onKeyDown={
                            handleDesktopSearch
                        }

                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },

                            width: {
                                sm: 180,
                                md: 220,
                            },

                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,

                                backgroundColor:
                                    "#f9fafb",
                            },
                        }}

                        slotProps={{
                            input: {

                                startAdornment: (

                                    <InputAdornment
                                        position="start"
                                    >

                                        <SearchIcon
                                            sx={{
                                                color:
                                                    "#6b7280",
                                            }}
                                        />

                                    </InputAdornment>

                                ),
                            },
                        }}
                    />


                    {/* ==========================================
                        MOBILE SEARCH
                    ========================================== */}

                    {mobileSearchOpen ? (

                        <TextField
                            autoFocus

                            size="small"

                            placeholder="Search..."

                            value={
                                mobileSearchValue
                            }

                            onChange={(event) =>
                                setMobileSearchValue(
                                    event.target.value
                                )
                            }

                            onKeyDown={
                                handleMobileSearch
                            }

                            sx={{
                                display: {
                                    xs: "block",
                                    sm: "none",
                                },

                                width: 155,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,

                                    backgroundColor:
                                        "#f9fafb",
                                },
                            }}

                            slotProps={{
                                input: {

                                    startAdornment: (

                                        <InputAdornment
                                            position="start"
                                        >

                                            <SearchIcon
                                                sx={{
                                                    color:
                                                        "#6b7280",

                                                    fontSize:
                                                        20,
                                                }}
                                            />

                                        </InputAdornment>

                                    ),
                                },
                            }}
                        />

                    ) : (

                        <IconButton
                            aria-label="open search"

                            onClick={() =>
                                setMobileSearchOpen(
                                    true
                                )
                            }

                            sx={{
                                display: {
                                    xs: "flex",
                                    sm: "none",
                                },

                                color:
                                    "#6b7280",
                            }}
                        >

                            <SearchIcon />

                        </IconButton>

                    )}


                    {/* ==========================================
                        NOTIFICATION
                    ========================================== */}

                    <IconButton
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex",
                            },
                        }}
                    >

                        <NotificationsNoneIcon />

                    </IconButton>


                    {/* ==========================================
                        USER AVATAR / LOGOUT
                    ========================================== */}

                    <Avatar
                        onClick={handleLogout}

                        aria-label="Logout"

                        title="Logout"

                        sx={{
                            width: {
                                xs: 36,
                                sm: 40,
                            },

                            height: {
                                xs: 36,
                                sm: 40,
                            },

                            backgroundColor:
                                "#2563eb",

                            flexShrink: 0,

                            cursor: "pointer",

                            transition:
                                "transform 0.2s ease",

                            "&:hover": {
                                transform:
                                    "scale(1.05)",
                            },
                        }}
                    >

                        {avatarLetter}

                    </Avatar>


                    {/* ==========================================
                        REAL USER INFORMATION
                    ========================================== */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },

                            minWidth: 0,
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,

                                maxWidth: 150,

                                overflow: "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap",
                            }}
                        >

                            {userName}

                        </Typography>


                        <Typography
                            variant="caption"
                            sx={{
                                color:
                                    "#6b7280",

                                textTransform:
                                    "capitalize",
                            }}
                        >

                            {userRole}

                        </Typography>

                    </Box>

                </Box>

            </Toolbar>

        </AppBar>
    );
}

export default Navbar;