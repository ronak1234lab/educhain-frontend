import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";

import { useState } from "react";

import {
    getCertificateByNumber,
} from "../services/certificateService";


function VerifyCertificate() {

    const [certificateNumber, setCertificateNumber] =
        useState("");

    const [certificate, setCertificate] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // Verify Certificate
    // ==========================================

    const handleVerify = async () => {

        const number = certificateNumber.trim();

        if (!number) {

            setError(
                "Please enter a certificate number."
            );

            setCertificate(null);

            return;
        }

        try {

            setLoading(true);

            setError("");

            setCertificate(null);

            const data =
                await getCertificateByNumber(number);

            setCertificate(data);

        } catch (error) {

            console.error(
                "Certificate verification failed:",
                error
            );

            setError(
                "Certificate not found or verification failed."
            );

            setCertificate(null);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // Enter Key
    // ==========================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {
            handleVerify();
        }
    };


    // ==========================================
    // Clear Search
    // ==========================================

    const handleClear = () => {

        setCertificateNumber("");

        setCertificate(null);

        setError("");
    };


    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",
            }}
        >

            {/* ==========================================
                Page Header
            ========================================== */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#111827",
                        fontSize: {
                            xs: "2rem",
                            sm: "2.125rem",
                        },
                    }}
                >
                    Verify Certificate
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: "#6b7280",
                        mt: 0.5,
                    }}
                >
                    Verify the authenticity of an EduChain
                    certificate.
                </Typography>

            </Box>


            {/* ==========================================
                Verification Search Card
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    maxWidth: 850,
                    width: "100%",
                    mb: 3,
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Certificate Verification
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#6b7280",
                            mb: 3,
                        }}
                    >
                        Enter the certificate number to verify
                        whether the certificate is authentic.
                    </Typography>


                    {/* ==========================================
                        Search Section
                    ========================================== */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            gap: 2,
                            alignItems: {
                                xs: "stretch",
                                sm: "flex-start",
                            },
                            width: "100%",
                        }}
                    >

                        {/* Certificate Number */}

                        <TextField
                            fullWidth
                            label="Certificate Number"
                            placeholder="Enter certificate number"
                            value={certificateNumber}
                            onChange={(event) =>
                                setCertificateNumber(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            size="small"
                            sx={{
                                minWidth: 0,
                                width: "100%",

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />


                        {/* Buttons */}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1.5,
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                },
                            }}
                        >

                            {/* Verify */}

                            <Button
                                variant="contained"
                                startIcon={
                                    loading
                                        ? null
                                        : <SearchIcon />
                                }
                                onClick={handleVerify}
                                disabled={loading}
                                sx={{
                                    minWidth: {
                                        xs: 0,
                                        sm: 130,
                                    },
                                    flex: {
                                        xs: 1,
                                        sm: "none",
                                    },
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            >

                                {loading ? (
                                    <CircularProgress
                                        size={22}
                                        color="inherit"
                                    />
                                ) : (
                                    "Verify"
                                )}

                            </Button>


                            {/* Clear */}

                            <Button
                                variant="outlined"
                                onClick={handleClear}
                                disabled={
                                    loading &&
                                    !certificateNumber
                                }
                                sx={{
                                    minWidth: {
                                        xs: 90,
                                        sm: "auto",
                                    },
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Clear
                            </Button>

                        </Box>

                    </Box>


                    {/* ==========================================
                        Error Message
                    ========================================== */}

                    {error && (

                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#fef2f2",
                                border:
                                    "1px solid #fecaca",
                            }}
                        >

                            <Typography
                                sx={{
                                    color: "#dc2626",
                                    fontWeight: 500,
                                }}
                            >
                                {error}
                            </Typography>

                        </Box>

                    )}

                </CardContent>

            </Card>


            {/* ==========================================
                Certificate Result
            ========================================== */}

            {certificate && (

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        maxWidth: 850,
                        width: "100%",
                    }}
                >

                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                            },
                        }}
                    >

                        {/* ==========================================
                            Verification Status
                        ========================================== */}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                mb: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >

                                <VerifiedIcon
                                    sx={{
                                        fontSize: {
                                            xs: 40,
                                            sm: 46,
                                        },
                                        color:
                                            certificate.status ===
                                            "ACTIVE"
                                                ? "#16a34a"
                                                : "#dc2626",
                                    }}
                                />

                                <Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >
                                        Certificate Verification
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#6b7280",
                                        }}
                                    >
                                        Certificate details
                                        retrieved successfully.
                                    </Typography>

                                </Box>

                            </Box>


                            {/* Status */}

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    backgroundColor:
                                        certificate.status ===
                                        "ACTIVE"
                                            ? "#dcfce7"
                                            : "#fee2e2",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            certificate.status ===
                                            "ACTIVE"
                                                ? "#15803d"
                                                : "#b91c1c",
                                    }}
                                >
                                    {
                                        certificate.status ||
                                        "UNKNOWN"
                                    }
                                </Typography>

                            </Box>

                        </Box>


                        <Divider sx={{ mb: 3 }} />


                        {/* ==========================================
                            Certificate Information
                        ========================================== */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, 1fr)",
                                gap: 3,

                                "@media (max-width: 700px)": {
                                    gridTemplateColumns:
                                        "1fr",
                                },
                            }}
                        >

                            {/* Certificate Number */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Certificate Number
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {
                                        certificate.certificateNumber ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            {/* Student */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Student
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {
                                        certificate.studentName ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            {/* Course */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Course
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {
                                        certificate.courseName ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            {/* University */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    University
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {
                                        certificate.universityName ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            {/* Issue Date */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Issue Date
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                    }}
                                >
                                    {
                                        certificate.issueDate ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            {/* Certificate ID */}

                            <Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Certificate ID
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                    }}
                                >
                                    {
                                        certificate.id ||
                                        "-"
                                    }
                                </Typography>

                            </Box>

                        </Box>


                        {/* ==========================================
                            Certificate Hash
                        ========================================== */}

                        {certificate.hash && (

                            <Box sx={{ mt: 3 }}>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Certificate Hash
                                </Typography>

                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#f9fafb",
                                        border:
                                            "1px solid #e5e7eb",
                                        wordBreak:
                                            "break-all",
                                        overflowWrap:
                                            "anywhere",
                                        maxWidth: "100%",
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily:
                                                "monospace",
                                            color: "#374151",
                                            wordBreak:
                                                "break-all",
                                        }}
                                    >
                                        {
                                            certificate.hash
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        )}

                    </CardContent>

                </Card>

            )}

        </Box>
    );
}

export default VerifyCertificate;