import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Snackbar,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import VerifiedIcon from "@mui/icons-material/Verified";
import LinkIcon from "@mui/icons-material/Link";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";

import axios from "axios";

// ==========================================
// Blockchain Configuration
// ==========================================

const API_BASE_URL =
    "http://localhost:8080";

const CONTRACT_ADDRESS =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ==========================================
// Blockchain Dashboard
// ==========================================

function BlockchainDashboard() {

    // ==========================================
    // Loading
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    // ==========================================
    // Blockchain Connection
    // ==========================================

    const [connected, setConnected] =
        useState(false);

    const [network, setNetwork] =
        useState("");

    const [error, setError] =
        useState("");

    // ==========================================
    // Latest Certificate
    // ==========================================

    const [
        selectedCertificate,
        setSelectedCertificate
    ] = useState(null);

    // ==========================================
    // Copy Snackbar
    // ==========================================

    const [copyMessage, setCopyMessage] =
        useState("");

    const [copySnackbarOpen, setCopySnackbarOpen] =
        useState(false);

    // ==========================================
    // Verification
    // ==========================================

    const [
        verificationLoading,
        setVerificationLoading
    ] = useState(false);

    const [
        verificationResult,
        setVerificationResult
    ] = useState(null);

    const [
        verificationError,
        setVerificationError
    ] = useState("");

    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        loadBlockchainData();

    }, []);

    // ==========================================
    // Load Blockchain Information
    // ==========================================

    const loadBlockchainData = async () => {

        try {

            setLoading(true);

            setError("");

            // ----------------------------------
            // Check Blockchain Connection
            // ----------------------------------

            const statusResponse =
                await axios.get(
                    `${API_BASE_URL}/api/blockchain/status`
                );

            const status =
                statusResponse.data;

            setConnected(true);

            setNetwork(
                status ||
                "Hardhat Local Network"
            );

            // ----------------------------------
            // Read JWT
            // ----------------------------------

            const token =
                localStorage.getItem("token");

            if (!token) {

                setSelectedCertificate(null);

                setLoading(false);

                return;
            }

            // ----------------------------------
            // Load Certificates
            // ----------------------------------

            const certificateResponse =
                await axios.get(
                    `${API_BASE_URL}/api/certificates`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const certificates =
                certificateResponse.data;

            // ----------------------------------
            // Select Latest Certificate
            // ----------------------------------

            if (
                Array.isArray(certificates) &&
                certificates.length > 0
            ) {

                const sortedCertificates =
                    [...certificates]
                        .sort(
                            (a, b) =>
                                (b.id || 0) -
                                (a.id || 0)
                        );

                setSelectedCertificate(
                    sortedCertificates[0]
                );

            } else {

                setSelectedCertificate(null);
            }

            // ----------------------------------
            // Clear Old Verification Result
            // ----------------------------------

            setVerificationResult(null);

            setVerificationError("");

        } catch (err) {

            console.error(
                "Failed to load blockchain dashboard:",
                err
            );

            setConnected(false);

            setError(
                "Unable to connect to blockchain services."
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // Copy Text
    // ==========================================

    const handleCopy = async (
        value,
        label
    ) => {

        if (
            !value ||
            value === "Not Available"
        ) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                value
            );

            setCopyMessage(
                `${label} copied successfully.`
            );

            setCopySnackbarOpen(true);

        } catch (error) {

            console.error(
                "Unable to copy text:",
                error
            );

            setCopyMessage(
                `Unable to copy ${label.toLowerCase()}.`
            );

            setCopySnackbarOpen(true);
        }
    };

    // ==========================================
    // Close Copy Snackbar
    // ==========================================

    const handleCloseCopySnackbar = () => {

        setCopySnackbarOpen(false);
    };

    // ==========================================
    // Verify Latest Certificate
    // ==========================================

    const handleVerifyLatestCertificate =
        async () => {

            if (!selectedCertificate) {

                setVerificationError(
                    "No certificate available for verification."
                );

                setVerificationResult(null);

                return;
            }

            try {

                setVerificationLoading(true);

                setVerificationError("");

                setVerificationResult(null);

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    setVerificationError(
                        "Authentication token not found."
                    );

                    return;
                }

                const response =
                    await axios.get(
                        `${API_BASE_URL}/api/certificates/number/${selectedCertificate.certificateNumber}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                setVerificationResult(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Certificate verification failed:",
                    error
                );

                setVerificationResult(null);

                setVerificationError(
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "Certificate verification failed."
                );

            } finally {

                setVerificationLoading(false);
            }
        };

    // ==========================================
    // Loading Screen
    // ==========================================

    if (loading) {

        return (

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 10,
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    // ==========================================
    // Render
    // ==========================================

    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
            }}
        >

            {/* ==========================================
                Header
            ========================================== */}

            <Box
                sx={{
                    mb: 4,
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Blockchain Dashboard
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mt: 0.5,
                        color: "#6b7280",
                    }}
                >
                    Monitor EduChain blockchain
                    connectivity and certificate
                    transactions.
                </Typography>

                {/* ==========================================
                    Refresh Data
                ========================================== */}

                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshIcon />
                    }
                    onClick={
                        loadBlockchainData
                    }
                    disabled={
                        loading
                    }
                    sx={{
                        mt: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                    }}
                >
                    {
                        loading
                            ? "Refreshing..."
                            : "Refresh Data"
                    }
                </Button>

            </Box>

            {/* ==========================================
                Error
            ========================================== */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>

            )}

            {/* ==========================================
                Blockchain Status Cards
            ========================================== */}

            <Grid
                container
                spacing={3}
                sx={{
                    mb: 3,
                }}
            >

                {/* ==========================================
                    Blockchain Status
                ========================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >

                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius: 3,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 2,
                                }}
                            >

                                <VerifiedIcon
                                    color={
                                        connected
                                            ? "success"
                                            : "error"
                                    }
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Blockchain Status
                                </Typography>

                            </Box>

                            <Chip
                                label={
                                    connected
                                        ? "CONNECTED"
                                        : "DISCONNECTED"
                                }
                                color={
                                    connected
                                        ? "success"
                                        : "error"
                                }
                                sx={{
                                    fontWeight: 700,
                                }}
                            />

                        </CardContent>

                    </Card>

                </Grid>

                {/* ==========================================
                    Network
                ========================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >

                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius: 3,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 2,
                                }}
                            >

                                <LinkIcon
                                    color="primary"
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Network
                                </Typography>

                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#374151",
                                    wordBreak:
                                        "break-word",
                                    lineHeight: 1.6,
                                }}
                            >
                                {network}
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                {/* ==========================================
                    Smart Contract
                ========================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >

                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius: 3,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 2,
                                }}
                            >

                                <AccountBalanceWalletIcon
                                    color="primary"
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Smart Contract
                                </Typography>

                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily:
                                        "monospace",
                                    fontSize:
                                        "0.8rem",
                                    wordBreak:
                                        "break-all",
                                    lineHeight: 1.6,
                                }}
                            >
                                {CONTRACT_ADDRESS}
                            </Typography>

                            <Button
                                size="small"
                                startIcon={
                                    <ContentCopyIcon />
                                }
                                onClick={() =>
                                    handleCopy(
                                        CONTRACT_ADDRESS,
                                        "Contract address"
                                    )
                                }
                                sx={{
                                    mt: 1.5,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Copy
                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* ==========================================
                Blockchain Verification Summary
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    border:
                        "1px solid #e5e7eb",
                    borderRadius: 3,
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Blockchain Verification Summary
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* ==========================================
                            Blockchain Status
                        ========================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f9fafb",
                                    height: "100%",
                                    boxSizing:
                                        "border-box",
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Blockchain Status
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            connected
                                                ? "#15803d"
                                                : "#dc2626",
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        connected
                                            ? "CONNECTED"
                                            : "DISCONNECTED"
                                    }
                                </Typography>

                            </Box>

                        </Grid>

                        {/* ==========================================
                            Latest Certificate
                        ========================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f9fafb",
                                    height: "100%",
                                    boxSizing:
                                        "border-box",
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Latest Certificate
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        mt: 0.5,
                                        wordBreak:
                                            "break-word",
                                    }}
                                >
                                    {
                                        selectedCertificate
                                            ?.certificateNumber ||
                                        "Not Available"
                                    }
                                </Typography>

                            </Box>

                        </Grid>

                        {/* ==========================================
                            Certificate Status
                        ========================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f9fafb",
                                    height: "100%",
                                    boxSizing:
                                        "border-box",
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Certificate Status
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            selectedCertificate
                                                ?.status ===
                                            "ACTIVE"
                                                ? "#15803d"
                                                : "#dc2626",
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        selectedCertificate
                                            ?.status ||
                                        "UNKNOWN"
                                    }
                                </Typography>

                            </Box>

                        </Grid>

                        {/* ==========================================
                            Blockchain Verified
                        ========================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f9fafb",
                                    height: "100%",
                                    boxSizing:
                                        "border-box",
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Blockchain Verified
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            verificationResult
                                                ? "#15803d"
                                                : "#6b7280",
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        verificationResult
                                            ? "YES"
                                            : "NOT VERIFIED"
                                    }
                                </Typography>

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* ==========================================
                Latest Certificate
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    border:
                        "1px solid #e5e7eb",
                    borderRadius: 3,
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 3,
                        }}
                    >

                        <ReceiptLongIcon
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Latest Blockchain Certificate
                        </Typography>

                    </Box>

                    {!selectedCertificate ? (

                        <Typography
                            sx={{
                                color: "#6b7280",
                            }}
                        >
                            No certificate data available.
                        </Typography>

                    ) : (

                        <Box>

                            {/* ==========================================
                                Certificate Number
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                <strong>
                                    Certificate Number:
                                </strong>{" "}

                                {
                                    selectedCertificate
                                        .certificateNumber
                                }
                            </Typography>

                            {/* ==========================================
                                Student
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                <strong>
                                    Student:
                                </strong>{" "}

                                {
                                    selectedCertificate
                                        .studentName ||
                                    "-"
                                }
                            </Typography>

                            {/* ==========================================
                                Course
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                <strong>
                                    Course:
                                </strong>{" "}

                                {
                                    selectedCertificate
                                        .courseName ||
                                    "-"
                                }
                            </Typography>

                            {/* ==========================================
                                University
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                <strong>
                                    University:
                                </strong>{" "}

                                {
                                    selectedCertificate
                                        .universityName ||
                                    "-"
                                }
                            </Typography>

                            {/* ==========================================
                                Issue Date
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                <strong>
                                    Issue Date:
                                </strong>{" "}

                                {
                                    selectedCertificate
                                        .issueDate ||
                                    "-"
                                }
                            </Typography>

                            <Divider
                                sx={{
                                    my: 2,
                                }}
                            />

                            {/* ==========================================
                                Certificate Hash
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                <strong>
                                    Certificate Hash:
                                </strong>
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    gap: 1,
                                    alignItems: {
                                        xs: "stretch",
                                        sm: "flex-start",
                                    },
                                    mb: 2,
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        fontFamily:
                                            "monospace",
                                        fontSize:
                                            "0.8rem",
                                        color:
                                            "#374151",
                                        wordBreak:
                                            "break-all",
                                        backgroundColor:
                                            "#f9fafb",
                                        border:
                                            "1px solid #e5e7eb",
                                        borderRadius: 1.5,
                                        padding: 1.25,
                                    }}
                                >
                                    {
                                        selectedCertificate
                                            .hash ||
                                        "Not Available"
                                    }
                                </Typography>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={
                                        <ContentCopyIcon />
                                    }
                                    disabled={
                                        !selectedCertificate
                                            .hash
                                    }
                                    onClick={() =>
                                        handleCopy(
                                            selectedCertificate
                                                .hash,
                                            "Certificate hash"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        minWidth: 90,
                                    }}
                                >
                                    Copy
                                </Button>

                            </Box>

                            {/* ==========================================
                                Blockchain Transaction
                            ========================================== */}

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                <strong>
                                    Blockchain Transaction:
                                </strong>
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    gap: 1,
                                    alignItems: {
                                        xs: "stretch",
                                        sm: "flex-start",
                                    },
                                    mb: 2,
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        fontFamily:
                                            "monospace",
                                        fontSize:
                                            "0.8rem",
                                        color:
                                            "#374151",
                                        wordBreak:
                                            "break-all",
                                        backgroundColor:
                                            "#f9fafb",
                                        border:
                                            "1px solid #e5e7eb",
                                        borderRadius: 1.5,
                                        padding: 1.25,
                                    }}
                                >
                                    {
                                        selectedCertificate
                                            .blockchainTransactionHash ||
                                        "Not Available"
                                    }
                                </Typography>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={
                                        <ContentCopyIcon />
                                    }
                                    disabled={
                                        !selectedCertificate
                                            .blockchainTransactionHash
                                    }
                                    onClick={() =>
                                        handleCopy(
                                            selectedCertificate
                                                .blockchainTransactionHash,
                                            "Blockchain transaction hash"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        minWidth: 90,
                                    }}
                                >
                                    Copy
                                </Button>

                            </Box>

                            {/* ==========================================
                                Status
                            ========================================== */}

                            <Box
                                sx={{
                                    mt: 2,
                                }}
                            >

                                <Chip
                                    label={
                                        selectedCertificate
                                            .status ||
                                        "UNKNOWN"
                                    }
                                    color={
                                        selectedCertificate
                                            .status ===
                                        "ACTIVE"
                                            ? "success"
                                            : "error"
                                    }
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                />

                            </Box>

                            {/* ==========================================
                                Verify Latest Certificate
                            ========================================== */}

                            <Box
                                sx={{
                                    mt: 3,
                                }}
                            >

                                <Button
                                    variant="contained"
                                    startIcon={
                                        <VerifiedIcon />
                                    }
                                    onClick={
                                        handleVerifyLatestCertificate
                                    }
                                    disabled={
                                        verificationLoading ||
                                        !selectedCertificate
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                        borderRadius: 2,
                                    }}
                                >
                                    {
                                        verificationLoading
                                            ? "Verifying..."
                                            : "Verify Latest Certificate"
                                    }
                                </Button>

                            </Box>

                            {/* ==========================================
                                Verification Error
                            ========================================== */}

                            {verificationError && (

                                <Alert
                                    severity="error"
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    {
                                        verificationError
                                    }
                                </Alert>

                            )}

                            {/* ==========================================
                                Verification Result
                            ========================================== */}

                            {verificationResult && (

                                <Card
                                    elevation={0}
                                    sx={{
                                        mt: 2,
                                        border:
                                            "1px solid #bbf7d0",
                                        backgroundColor:
                                            "#f0fdf4",
                                        borderRadius: 2,
                                    }}
                                >

                                    <CardContent>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1.5,
                                            }}
                                        >

                                            <VerifiedIcon
                                                color="success"
                                            />

                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color:
                                                        "#166534",
                                                }}
                                            >
                                                Certificate Verified on Blockchain
                                            </Typography>

                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.75,
                                            }}
                                        >
                                            <strong>
                                                Certificate:
                                            </strong>{" "}

                                            {
                                                verificationResult
                                                    .certificateNumber
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.75,
                                            }}
                                        >
                                            <strong>
                                                Status:
                                            </strong>{" "}

                                            {
                                                verificationResult
                                                    .status
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.75,
                                                wordBreak:
                                                    "break-all",
                                            }}
                                        >
                                            <strong>
                                                Certificate Hash:
                                            </strong>{" "}

                                            {
                                                verificationResult
                                                    .hash ||
                                                "Not Available"
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                wordBreak:
                                                    "break-all",
                                            }}
                                        >
                                            <strong>
                                                Blockchain Transaction:
                                            </strong>{" "}

                                            {
                                                verificationResult
                                                    .blockchainTransactionHash ||
                                                "Not Available"
                                            }
                                        </Typography>

                                    </CardContent>

                                </Card>

                            )}

                        </Box>

                    )}

                </CardContent>

            </Card>

            {/* ==========================================
                Copy Snackbar
            ========================================== */}

            <Snackbar
                open={
                    copySnackbarOpen
                }
                autoHideDuration={
                    2500
                }
                onClose={
                    handleCloseCopySnackbar
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={
                        handleCloseCopySnackbar
                    }
                >
                    {
                        copyMessage
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
}

export default BlockchainDashboard;