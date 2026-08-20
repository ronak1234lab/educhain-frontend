import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Alert,
    MenuItem,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Register() {

    const navigate = useNavigate();


    // ==========================================
    // State
    // ==========================================

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState("STUDENT");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================================
    // Register Handler
    // ==========================================

    const handleRegister = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // ==========================================
        // Validation
        // ==========================================

        if (!name.trim()) {

            setError("Please enter your name.");

            return;
        }


        if (!email.trim()) {

            setError("Please enter your email.");

            return;
        }


        if (!password) {

            setError("Please enter your password.");

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (!role) {

            setError("Please select a role.");

            return;
        }


        try {

            setLoading(true);


            // ==========================================
            // Registration API
            // ==========================================

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name.trim(),

                    email: email.trim(),

                    password: password,

                    role: role,
                }
            );


            // ==========================================
            // Registration Successful
            // ==========================================

            if (response.data.success) {

                setSuccess(
                    "Registration successful. Redirecting to login..."
                );


                // Clear form

                setName("");

                setEmail("");

                setPassword("");

                setRole("STUDENT");


                // Redirect after short delay

                setTimeout(() => {

                    navigate("/login");

                }, 1500);

            } else {

                setError(
                    response.data.message ||
                    "Registration failed."
                );
            }


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Register Page
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

                    backgroundColor: "#ffffff",

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
                        Header
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

                                margin: "0 auto 16px",

                                backgroundColor: "#eff6ff",

                                color: "#2563eb",

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

                                color: "#111827",
                            }}
                        >
                            Create Account
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",

                                mt: 0.5,
                            }}
                        >
                            Register for EduChain
                        </Typography>

                    </Box>


                    {/* ==========================================
                        Error
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
                        Success
                    ========================================== */}

                    {success && (

                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,

                                borderRadius: 2,
                            }}
                        >
                            {success}
                        </Alert>

                    )}


                    {/* ==========================================
                        Registration Form
                    ========================================== */}

                    <Box
                        component="form"
                        onSubmit={handleRegister}
                    >

                        {/* Name */}

                        <TextField
                            fullWidth

                            label="Full Name"

                            value={name}

                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }

                            placeholder="Enter your full name"

                            margin="normal"

                            sx={{
                                mb: 1,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />


                        {/* Email */}

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

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />


                        {/* Password */}

                        <TextField
                            fullWidth

                            label="Password"

                            type="password"

                            value={password}

                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }

                            placeholder="Enter your password"

                            autoComplete="new-password"

                            margin="normal"

                            sx={{
                                mb: 1,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />


                        {/* Role */}

                        <TextField
                            fullWidth

                            select

                            label="Role"

                            value={role}

                            onChange={(event) =>
                                setRole(
                                    event.target.value
                                )
                            }

                            margin="normal"

                            sx={{
                                mb: 3,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        >

                            <MenuItem value="STUDENT">
                                Student
                            </MenuItem>

                            <MenuItem value="UNIVERSITY">
                                University
                            </MenuItem>

                            <MenuItem value="EMPLOYER">
                                Employer
                            </MenuItem>

                        </TextField>


                        {/* Register Button */}

                        <Button
                            fullWidth

                            type="submit"

                            variant="contained"

                            disabled={loading}

                            sx={{
                                height: 48,

                                borderRadius: 2,

                                textTransform: "none",

                                fontSize: 16,

                                fontWeight: 600,

                                backgroundColor: "#2563eb",

                                "&:hover": {
                                    backgroundColor: "#1d4ed8",
                                },
                            }}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"}

                        </Button>


                        {/* Login Button */}

                        <Button
                            fullWidth

                            type="button"

                            onClick={() =>
                                navigate("/login")
                            }

                            sx={{
                                mt: 1,

                                height: 45,

                                borderRadius: 2,

                                textTransform: "none",

                                fontWeight: 600,

                                color: "#2563eb",
                            }}
                        >
                            Already have an account? Sign In
                        </Button>

                    </Box>


                    {/* ==========================================
                        Footer
                    ========================================== */}

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",

                            textAlign: "center",

                            color: "#9ca3af",

                            mt: 3,

                            lineHeight: 1.5,
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


export default Register;