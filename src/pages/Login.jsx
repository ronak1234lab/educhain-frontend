import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {

    const navigate = useNavigate();


    // ==========================================
    // State
    // ==========================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // Login Handler
    // ==========================================

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");


        // ==========================================
        // Validate Email
        // ==========================================

        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }


        // ==========================================
        // Validate Password
        // ==========================================

        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            // ==========================================
            // Login API
            // ==========================================

            const response =
                await axios.post(
                    "http://localhost:8080/api/auth/login",
                    {
                        email: email.trim(),
                        password: password,
                    }
                );


            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // ==========================================
            // Backend Response
            // ==========================================

            const data =
                response.data;


            // ==========================================
            // Check Success
            // ==========================================

            if (
                data?.success === false
            ) {

                setError(
                    data?.message ||
                    "Invalid email or password."
                );

                return;
            }


            // ==========================================
            // Get JWT Token
            // ==========================================

            const token =
                data?.token ||
                data?.accessToken ||
                data?.jwt;


            if (!token) {

                setError(
                    "Login successful, but JWT token was not received."
                );

                return;
            }


            // ==========================================
            // Get User Object
            // ==========================================

            const user =
                data?.user ||
                data?.data ||
                null;


            // ==========================================
            // Get Role
            // ==========================================

            let role =
                data?.role ||
                user?.role ||
                user?.userRole ||
                user?.authority ||
                data?.userRole ||
                data?.authority;


            // ==========================================
            // Handle Role Array
            // ==========================================

            if (Array.isArray(role)) {

                role = role[0];
            }


            // ==========================================
            // Normalize Role
            // ==========================================

            if (role) {

                role =
                    String(role)
                        .replace("ROLE_", "")
                        .toUpperCase();
            }


            // ==========================================
            // If Role Not In Response,
            // Extract Role From JWT
            // ==========================================

            if (!role) {

                try {

                    const payload =
                        JSON.parse(
                            atob(
                                token
                                    .split(".")[1]
                                    .replace(/-/g, "+")
                                    .replace(/_/g, "/")
                            )
                        );


                    let jwtRole =
                        payload?.role ||
                        payload?.roles ||
                        payload?.authority ||
                        payload?.authorities;


                    if (Array.isArray(jwtRole)) {

                        jwtRole =
                            jwtRole[0];
                    }


                    if (jwtRole) {

                        role =
                            String(jwtRole)
                                .replace(
                                    "ROLE_",
                                    ""
                                )
                                .toUpperCase();
                    }

                } catch (jwtError) {

                    console.warn(
                        "Could not extract role from JWT:",
                        jwtError
                    );
                }
            }


            // ==========================================
            // Final Role Fallback
            // ==========================================

            if (!role) {

                role = "STUDENT";
            }


            console.log(
                "LOGIN ROLE:",
                role
            );


            // ==========================================
            // Build User Object
            // ==========================================

            const completeUser = {

                ...(user || {}),

                email:
                    user?.email ||
                    data?.email ||
                    email.trim(),

                name:
                    user?.name ||
                    data?.name ||
                    "EduChain User",

                role: role,
            };


            // ==========================================
            // Clear Old Login Data
            // ==========================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "role"
            );

            localStorage.removeItem(
                "educhainUser"
            );


            // ==========================================
            // Save Fresh JWT
            // ==========================================

            localStorage.setItem(
                "token",
                token
            );


            // ==========================================
            // Save User
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(
                    completeUser
                )
            );


            // ==========================================
            // Save Role
            // ==========================================

            localStorage.setItem(
                "role",
                role
            );


            // ==========================================
            // Save Complete Backend Response
            // ==========================================

            localStorage.setItem(
                "educhainUser",
                JSON.stringify({
                    ...data,
                    user: completeUser,
                    role: role,
                    token: token,
                })
            );


            // ==========================================
            // Verify Storage
            // ==========================================

            console.log(
                "Saved Token:",
                localStorage.getItem("token")
            );

            console.log(
                "Saved User:",
                localStorage.getItem("user")
            );

            console.log(
                "Saved Role:",
                localStorage.getItem("role")
            );


            // ==========================================
            // Navigate To Dashboard
            // ==========================================

            navigate("/");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            // ==========================================
            // Backend Error
            // ==========================================

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    "Invalid email or password."
                );

            } else {

                setError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Login Page
    // ==========================================

    return (

        <Box
            sx={{
                minHeight: "100vh",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: "#f8fafc",

                px: 2,

                py: 4,
            }}
        >

            <Card
                elevation={0}

                sx={{
                    width: "100%",

                    maxWidth: 430,

                    borderRadius: 4,

                    border:
                        "1px solid #e5e7eb",

                    backgroundColor:
                        "#ffffff",

                    boxShadow:
                        "0 20px 50px rgba(15, 23, 42, 0.08)",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 3,
                            sm: 4,
                        },
                    }}
                >

                    {/* ==========================================
                        Logo
                    ========================================== */}

                    <Box
                        sx={{
                            textAlign: "center",

                            mb: 4,
                        }}
                    >

                        <Box
                            sx={{
                                width: 64,

                                height: 64,

                                borderRadius: 3,

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",

                                margin:
                                    "0 auto 16px",

                                backgroundColor:
                                    "#eff6ff",

                                color:
                                    "#2563eb",

                                fontSize: 28,

                                fontWeight: 700,
                            }}
                        >
                            E
                        </Box>


                        <Typography
                            variant="h5"

                            sx={{
                                fontWeight: 700,

                                color:
                                    "#111827",
                            }}
                        >
                            EduChain
                        </Typography>


                        <Typography
                            variant="body2"

                            sx={{
                                color:
                                    "#6b7280",

                                mt: 0.5,
                            }}
                        >
                            Certificate Platform
                        </Typography>

                    </Box>


                    {/* ==========================================
                        Welcome
                    ========================================== */}

                    <Box
                        sx={{
                            mb: 3,
                        }}
                    >

                        <Typography
                            variant="h6"

                            sx={{
                                fontWeight: 700,

                                color:
                                    "#111827",
                            }}
                        >
                            Welcome back
                        </Typography>


                        <Typography
                            variant="body2"

                            sx={{
                                color:
                                    "#6b7280",

                                mt: 0.5,
                            }}
                        >
                            Sign in to your EduChain account
                        </Typography>

                    </Box>


                    {/* ==========================================
                        Error Message
                    ========================================== */}

                    {error && (

                        <Alert
                            severity="error"

                            sx={{
                                mb: 2,

                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>

                    )}


                    {/* ==========================================
                        Login Form
                    ========================================== */}

                    <Box
                        component="form"

                        onSubmit={
                            handleLogin
                        }
                    >

                        {/* ==========================================
                            Email
                        ========================================== */}

                        <TextField
                            fullWidth

                            label="Email"

                            type="email"

                            value={email}

                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }

                            placeholder="Enter your email"

                            autoComplete="email"

                            margin="normal"

                            sx={{
                                mb: 1,

                                "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                    },
                            }}

                            slotProps={{
                                input: {

                                    startAdornment: (

                                        <InputAdornment
                                            position="start"
                                        >

                                            <EmailIcon
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
                            Password
                        ========================================== */}

                        <TextField
                            fullWidth

                            label="Password"

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            value={password}

                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }

                            placeholder="Enter your password"

                            autoComplete="current-password"

                            margin="normal"

                            sx={{
                                mb: 3,

                                "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                    },
                            }}

                            slotProps={{
                                input: {

                                    startAdornment: (

                                        <InputAdornment
                                            position="start"
                                        >

                                            <LockIcon
                                                sx={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            />

                                        </InputAdornment>
                                    ),

                                    endAdornment: (

                                        <InputAdornment
                                            position="end"
                                        >

                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }

                                                edge="end"

                                                aria-label={
                                                    showPassword
                                                        ? "hide password"
                                                        : "show password"
                                                }
                                            >

                                                {showPassword ? (

                                                    <VisibilityOffIcon />

                                                ) : (

                                                    <VisibilityIcon />

                                                )}

                                            </IconButton>

                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />


                        {/* ==========================================
                            Sign In Button
                        ========================================== */}

                        <Button
                            fullWidth

                            type="submit"

                            variant="contained"

                            disabled={
                                loading
                            }

                            sx={{
                                height: 48,

                                borderRadius: 2,

                                textTransform:
                                    "none",

                                fontSize: 16,

                                fontWeight: 600,

                                backgroundColor:
                                    "#2563eb",

                                "&:hover": {
                                    backgroundColor:
                                        "#1d4ed8",
                                },
                            }}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </Button>

                    </Box>


                    {/* ==========================================
                        Footer
                    ========================================== */}

                    <Typography
                        variant="caption"

                        sx={{
                            display:
                                "block",

                            textAlign:
                                "center",

                            color:
                                "#9ca3af",

                            mt: 3,

                            lineHeight:
                                1.5,
                        }}
                    >
                        Secure academic credential management
                        powered by EduChain.
                    </Typography>

                </CardContent>

            </Card>

        </Box>
    );
}


export default Login;