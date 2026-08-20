import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    TextField,
    Snackbar,
    Chip,
    Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import BlockIcon from "@mui/icons-material/Block";

import { useEffect, useState } from "react";

import {
    getAllCertificates,
    issueCertificate,
    revokeCertificate,
    downloadCertificate,
    generateQrCode,
    getCertificateByNumber,
    verifyCertificateByHash,
} from "../services/certificateService";

import {
    getAllStudents,
} from "../services/studentService";

import {
    getAllCourses,
} from "../services/courseService";

// ==========================================
// Get Current User Role
// ==========================================

const getCurrentUserRole = () => {

    const storedRole =
        localStorage.getItem("role");

    if (storedRole) {
        return storedRole
            .replace("ROLE_", "")
            .toUpperCase();
    }

    const storedUser =
        localStorage.getItem("user");

    if (storedUser) {
        try {

            const user =
                JSON.parse(storedUser);

            const role =
                user?.role ||
                user?.userRole ||
                user?.authority;

            if (role) {
                return String(role)
                    .replace("ROLE_", "")
                    .toUpperCase();
            }

        } catch (error) {

            console.warn(
                "Unable to parse stored user:",
                error
            );
        }
    }

    return "STUDENT";
};

// ==========================================
// Certificates Page
// ==========================================

function Certificates() {

    // ==========================================
    // Current Role
    // ==========================================

    const [userRole] =
        useState(getCurrentUserRole);

    // ==========================================
    // Permissions
    // ==========================================

    const canManageCertificates =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";

    // ==========================================
    // Main Data
    // ==========================================

    const [certificates, setCertificates] =
        useState([]);

    const [students, setStudents] =
        useState([]);

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    // ==========================================
    // Issue Certificate Dialog
    // ==========================================

    const [openDialog, setOpenDialog] =
        useState(false);

    // ==========================================
    // Revoke Certificate Dialog
    // ==========================================

    const [revokeDialog, setRevokeDialog] =
        useState(false);

    const [
        selectedCertificate,
        setSelectedCertificate
    ] = useState(null);

    // ==========================================
    // Issue Form
    // ==========================================

    const [formData, setFormData] =
        useState({
            studentId: "",
            courseId: "",
        });

    // ==========================================
    // Search
    // ==========================================

    const [searchText, setSearchText] =
        useState("");

    // ==========================================
    // Pagination
    // ==========================================

    const [page, setPage] =
        useState(0);

    const rowsPerPage = 5;

    // ==========================================
    // Snackbar
    // ==========================================

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });

    // ==========================================
    // Verification Dialog
    // ==========================================

    const [verifyDialog, setVerifyDialog] =
        useState(false);

    const [verifyType, setVerifyType] =
        useState("number");

    const [verifyValue, setVerifyValue] =
        useState("");

    const [
        verificationResult,
        setVerificationResult
    ] = useState(null);

    const [verifyLoading, setVerifyLoading] =
        useState(false);

    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        loadCertificates();

        if (canManageCertificates) {
            loadStudents();
            loadCourses();
        }

    }, []);

    // ==========================================
    // Snackbar Helper
    // ==========================================

    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // ==========================================
    // Close Snackbar
    // ==========================================

    const handleCloseSnackbar = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    // ==========================================
    // Load Certificates
    // ==========================================

    const loadCertificates = async () => {

        try {

            setLoading(true);

            const data =
                await getAllCertificates();

            setCertificates(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load certificates:",
                error
            );

            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to view certificates.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to load certificates.",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // Load Students
    // ==========================================

    const loadStudents = async () => {

        if (!canManageCertificates) {
            return;
        }

        try {

            const data =
                await getAllStudents();

            setStudents(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load students:",
                error
            );

            showSnackbar(
                "Failed to load students.",
                "error"
            );
        }
    };

    // ==========================================
    // Load Courses
    // ==========================================

    const loadCourses = async () => {

        if (!canManageCertificates) {
            return;
        }

        try {

            const data =
                await getAllCourses();

            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            showSnackbar(
                "Failed to load courses.",
                "error"
            );
        }
    };

    // ==========================================
    // Handle Form Input
    // ==========================================

    const handleInputChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // Open Issue Dialog
    // ==========================================

    const handleOpenDialog = () => {

        if (!canManageCertificates) {
            return;
        }

        setFormData({
            studentId: "",
            courseId: "",
        });

        setOpenDialog(true);
    };

    // ==========================================
    // Close Issue Dialog
    // ==========================================

    const handleCloseDialog = () => {

        setOpenDialog(false);

        setFormData({
            studentId: "",
            courseId: "",
        });
    };

    // ==========================================
    // Issue Certificate
    // ==========================================

    const handleSubmit = async () => {

        if (!canManageCertificates) {
            return;
        }

        if (
            !formData.studentId ||
            !formData.courseId
        ) {

            showSnackbar(
                "Please select student and course.",
                "warning"
            );

            return;
        }

        try {

            setLoading(true);

            const certificateData = {

                studentId:
                    Number(
                        formData.studentId
                    ),

                courseId:
                    Number(
                        formData.courseId
                    ),
            };

            await issueCertificate(
                certificateData
            );

            handleCloseDialog();

            await loadCertificates();

            setPage(0);

            showSnackbar(
                "Certificate issued successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to issue certificate:",
                error
            );

            showSnackbar(
                error?.response?.data?.message ||
                "Failed to issue certificate.",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // Download PDF
    // ==========================================

    const handleDownloadPdf = async (
        id
    ) => {

        try {

            const blob =
                await downloadCertificate(id);

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "certificate.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            showSnackbar(
                "Certificate PDF downloaded."
            );

        } catch (error) {

            console.error(
                "Failed to download certificate:",
                error
            );

            showSnackbar(
                "Failed to download certificate PDF.",
                "error"
            );
        }
    };

    // ==========================================
    // Generate QR Code
    // ==========================================

    const handleGenerateQr = async (
        id
    ) => {

        try {

            const blob =
                await generateQrCode(id);

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "certificate-qrcode.png";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            showSnackbar(
                "QR code generated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to generate QR code:",
                error
            );

            showSnackbar(
                "Failed to generate QR code.",
                "error"
            );
        }
    };

    // ==========================================
    // Open Revoke Dialog
    // ==========================================

    const handleOpenRevokeDialog = (
        certificate
    ) => {

        if (!canManageCertificates) {
            return;
        }

        setSelectedCertificate(
            certificate
        );

        setRevokeDialog(true);
    };

    // ==========================================
    // Close Revoke Dialog
    // ==========================================

    const handleCloseRevokeDialog = () => {

        setRevokeDialog(false);

        setSelectedCertificate(null);
    };

    // ==========================================
    // Revoke Certificate
    // ==========================================

    const handleRevokeCertificate = async () => {

        if (!canManageCertificates) {
            return;
        }

        if (!selectedCertificate) {
            return;
        }

        try {

            setLoading(true);

            await revokeCertificate(
                selectedCertificate.id
            );

            handleCloseRevokeDialog();

            await loadCertificates();

            showSnackbar(
                "Certificate revoked successfully."
            );

        } catch (error) {

            console.error(
                "Failed to revoke certificate:",
                error
            );

            showSnackbar(
                error?.response?.data?.message ||
                "Failed to revoke certificate.",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // Open Verification Dialog
    // ==========================================

    const handleOpenVerifyDialog = (
        type = "number"
    ) => {

        setVerifyType(type);

        setVerifyValue("");

        setVerificationResult(null);

        setVerifyDialog(true);
    };

    // ==========================================
    // Close Verification Dialog
    // ==========================================

    const handleCloseVerifyDialog = () => {

        setVerifyDialog(false);

        setVerifyValue("");

        setVerificationResult(null);
    };

    // ==========================================
    // Verify Certificate
    // ==========================================

    const handleVerifyCertificate = async () => {

        if (!verifyValue.trim()) {

            showSnackbar(
                "Please enter a certificate number or hash.",
                "warning"
            );

            return;
        }

        try {

            setVerifyLoading(true);

            let result;

            if (
                verifyType === "number"
            ) {

                result =
                    await getCertificateByNumber(
                        verifyValue.trim()
                    );

            } else {

                result =
                    await verifyCertificateByHash(
                        verifyValue.trim()
                    );
            }

            setVerificationResult(
                result
            );

            showSnackbar(
                "Certificate found successfully."
            );

        } catch (error) {

            console.error(
                "Certificate verification failed:",
                error
            );

            setVerificationResult(
                null
            );

            showSnackbar(
                error?.response?.data?.message ||
                "Certificate not found.",
                "error"
            );

        } finally {

            setVerifyLoading(false);
        }
    };

    // ==========================================
    // Search Certificates
    // ==========================================

    const filteredCertificates =
        certificates.filter(
            (certificate) => {

                const search =
                    searchText
                        .trim()
                        .toLowerCase();

                if (!search) {
                    return true;
                }

                return (

                    String(
                        certificate.id || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.certificateNumber || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.studentName || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.courseName || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.universityName || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.status || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.hash || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        certificate.blockchainTransactionHash || ""
                    )
                        .toLowerCase()
                        .includes(search)
                );
            }
        );

    // ==========================================
    // Pagination
    // ==========================================

    const totalPages =
        Math.ceil(
            filteredCertificates.length /
            rowsPerPage
        );

    const paginatedCertificates =
        filteredCertificates.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );

    // ==========================================
    // Search Change
    // ==========================================

    const handleSearchChange = (
        event
    ) => {

        setSearchText(
            event.target.value
        );

        setPage(0);
    };

    // ==========================================
    // Previous Page
    // ==========================================

    const handlePreviousPage = () => {

        setPage((previous) =>
            Math.max(
                previous - 1,
                0
            )
        );
    };

    // ==========================================
    // Next Page
    // ==========================================

    const handleNextPage = () => {

        setPage((previous) =>
            Math.min(
                previous + 1,
                Math.max(
                    totalPages - 1,
                    0
                )
            )
        );
    };

    // ==========================================
    // Render
    // ==========================================

    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >

            {/* ==========================================
                Header
            ========================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    mb: 3,
                    gap: 2,
                }}
            >

                <Box>

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
                        Certificates
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#6b7280",
                            mt: 0.5,
                        }}
                    >
                        View and verify student certificates.
                    </Typography>

                </Box>

                {/* ==========================================
                    Buttons
                ========================================== */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1.5}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <VerifiedIcon />
                        }
                        onClick={() =>
                            handleOpenVerifyDialog(
                                "number"
                            )
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Verify Certificate
                    </Button>

                    {canManageCertificates && (

                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={
                                handleOpenDialog
                            }
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2.5,
                            }}
                        >
                            Issue Certificate
                        </Button>

                    )}

                </Stack>

            </Box>

            {/* ==========================================
                Search
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                }}
            >

                <CardContent>

                    <TextField
                        fullWidth
                        value={searchText}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="Search by certificate number, student, course, university, hash, transaction hash or status..."
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <SearchIcon
                                        sx={{
                                            mr: 1,
                                            color: "#6b7280",
                                        }}
                                    />
                                ),
                            },
                        }}
                    />

                </CardContent>

            </Card>

            {/* ==========================================
                Certificates Table
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    overflow: "hidden",
                }}
            >

                <CardContent
                    sx={{
                        p: 0,
                    }}
                >

                    {loading ? (

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                py: 8,
                            }}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                width: "100%",
                                overflowX: "auto",
                            }}
                        >

                            <Table
                                sx={{
                                    minWidth: 1350,
                                }}
                            >

                                <TableHead>

                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#f9fafb",
                                        }}
                                    >

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            ID
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Certificate Number
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Student
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Course
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            University
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Issue Date
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                minWidth: 280,
                                            }}
                                        >
                                            Blockchain Transaction
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Actions
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {paginatedCertificates.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                colSpan={9}
                                                align="center"
                                                sx={{
                                                    py: 6,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#6b7280",
                                                    }}
                                                >
                                                    No certificates found.
                                                </Typography>

                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        paginatedCertificates.map(
                                            (certificate) => (

                                                <TableRow
                                                    key={
                                                        certificate.id
                                                    }
                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            certificate.id
                                                        }
                                                    </TableCell>

                                                    <TableCell>

                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                certificate.certificateNumber
                                                            }
                                                        </Typography>

                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            certificate.studentName ||
                                                            "-"
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            certificate.courseName ||
                                                            "-"
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            certificate.universityName ||
                                                            "-"
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            certificate.issueDate ||
                                                            "-"
                                                        }
                                                    </TableCell>

                                                    <TableCell>

                                                        <Chip
                                                            label={
                                                                certificate.status ||
                                                                "-"
                                                            }
                                                            size="small"
                                                            color={
                                                                certificate.status ===
                                                                "ACTIVE"
                                                                    ? "success"
                                                                    : "error"
                                                            }
                                                        />

                                                    </TableCell>

                                                    {/* ==========================================
                                                        Blockchain Transaction Hash
                                                    ========================================== */}

                                                    <TableCell>

                                                        {certificate.blockchainTransactionHash ? (

                                                            <Box
                                                                sx={{
                                                                    maxWidth: 280,
                                                                }}
                                                            >

                                                                <Typography
                                                                    variant="body2"
                                                                    title={
                                                                        certificate.blockchainTransactionHash
                                                                    }
                                                                    sx={{
                                                                        fontFamily:
                                                                            "monospace",
                                                                        fontSize:
                                                                            "0.75rem",
                                                                        wordBreak:
                                                                            "break-all",
                                                                        color:
                                                                            "#374151",
                                                                    }}
                                                                >
                                                                    {
                                                                        certificate.blockchainTransactionHash
                                                                    }
                                                                </Typography>

                                                            </Box>

                                                        ) : (

                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color:
                                                                        "#9ca3af",
                                                                    fontStyle:
                                                                        "italic",
                                                                }}
                                                            >
                                                                Not Available
                                                            </Typography>

                                                        )}

                                                    </TableCell>

                                                    {/* ==========================================
                                                        Actions
                                                    ========================================== */}

                                                    <TableCell>

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: 1,
                                                            }}
                                                        >

                                                            {/* PDF */}

                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    handleDownloadPdf(
                                                                        certificate.id
                                                                    )
                                                                }
                                                                sx={{
                                                                    textTransform:
                                                                        "none",
                                                                }}
                                                            >
                                                                PDF
                                                            </Button>

                                                            {/* QR */}

                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    handleGenerateQr(
                                                                        certificate.id
                                                                    )
                                                                }
                                                                sx={{
                                                                    textTransform:
                                                                        "none",
                                                                }}
                                                            >
                                                                QR
                                                            </Button>

                                                            {/* Verify */}

                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {

                                                                    setVerifyValue(
                                                                        certificate.certificateNumber
                                                                    );

                                                                    setVerifyType(
                                                                        "number"
                                                                    );

                                                                    setVerificationResult(
                                                                        null
                                                                    );

                                                                    setVerifyDialog(
                                                                        true
                                                                    );

                                                                }}
                                                                sx={{
                                                                    textTransform:
                                                                        "none",
                                                                }}
                                                            >
                                                                Verify
                                                            </Button>

                                                            {/* Revoke */}

                                                            {canManageCertificates &&
                                                            certificate.status ===
                                                            "ACTIVE" ? (

                                                                <Button
                                                                    size="small"
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        handleOpenRevokeDialog(
                                                                            certificate
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Revoke
                                                                </Button>

                                                            ) : (

                                                                certificate.status !==
                                                                "ACTIVE" && (

                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color:
                                                                                "#9ca3af",
                                                                            alignSelf:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        Revoked
                                                                    </Typography>

                                                                )

                                                            )}

                                                        </Box>

                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )

                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                    {/* ==========================================
                        Pagination
                    ========================================== */}

                    {!loading &&
                        filteredCertificates.length > 0 && (

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    px: 2,
                                    py: 2,
                                    borderTop:
                                        "1px solid #e5e7eb",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                    }}
                                >
                                    Showing{" "}
                                    {page *
                                        rowsPerPage +
                                        1}
                                    -
                                    {Math.min(
                                        (page + 1) *
                                        rowsPerPage,
                                        filteredCertificates.length
                                    )}
                                    {" "}of{" "}
                                    {
                                        filteredCertificates.length
                                    }
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        disabled={
                                            page === 0
                                        }
                                        onClick={
                                            handlePreviousPage
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        disabled={
                                            page >=
                                            totalPages - 1
                                        }
                                        onClick={
                                            handleNextPage
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        Next
                                    </Button>

                                </Box>

                            </Box>

                        )}

                </CardContent>

            </Card>

            {/* ==========================================
                Issue Certificate Dialog
            ========================================== */}

            {canManageCertificates && (

                <Dialog
                    open={
                        openDialog
                    }
                    onClose={
                        handleCloseDialog
                    }
                    fullWidth
                    maxWidth="sm"
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.5rem",
                        }}
                    >
                        Issue Certificate
                    </DialogTitle>

                    <DialogContent>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",
                                mb: 2,
                            }}
                        >
                            Select a student and course
                            to issue a certificate.
                        </Typography>

                        {/* Student */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >

                            <InputLabel>
                                Student
                            </InputLabel>

                            <Select
                                name="studentId"
                                value={
                                    formData.studentId
                                }
                                label="Student"
                                onChange={
                                    handleInputChange
                                }
                            >

                                {students.map(
                                    (student) => (

                                        <MenuItem
                                            key={
                                                student.id
                                            }
                                            value={
                                                student.id
                                            }
                                        >
                                            {
                                                student.studentName
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </Select>

                        </FormControl>

                        {/* Course */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >

                            <InputLabel>
                                Course
                            </InputLabel>

                            <Select
                                name="courseId"
                                value={
                                    formData.courseId
                                }
                                label="Course"
                                onChange={
                                    handleInputChange
                                }
                            >

                                {courses.map(
                                    (course) => (

                                        <MenuItem
                                            key={
                                                course.id
                                            }
                                            value={
                                                course.id
                                            }
                                        >
                                            {
                                                course.courseName
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </Select>

                        </FormControl>

                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 2,
                        }}
                    >

                        <Button
                            onClick={
                                handleCloseDialog
                            }
                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                !formData.studentId ||
                                !formData.courseId ||
                                loading
                            }
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Issue Certificate
                        </Button>

                    </DialogActions>

                </Dialog>

            )}

            {/* ==========================================
                Revoke Dialog
            ========================================== */}

            {canManageCertificates && (

                <Dialog
                    open={
                        revokeDialog
                    }
                    onClose={
                        handleCloseRevokeDialog
                    }
                    fullWidth
                    maxWidth="xs"
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Revoke Certificate
                    </DialogTitle>

                    <DialogContent>

                        <Typography>

                            Are you sure you want
                            to revoke{" "}

                            <strong>
                                {
                                    selectedCertificate
                                        ?.certificateNumber
                                }
                            </strong>

                            ?

                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",
                                mt: 1,
                            }}
                        >
                            This certificate will no longer
                            be considered active.
                        </Typography>

                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 2,
                        }}
                    >

                        <Button
                            onClick={
                                handleCloseRevokeDialog
                            }
                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={
                                handleRevokeCertificate
                            }
                            disabled={
                                loading
                            }
                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Revoke
                        </Button>

                    </DialogActions>

                </Dialog>

            )}

            {/* ==========================================
                Verify Certificate Dialog
            ========================================== */}

            <Dialog
                open={
                    verifyDialog
                }
                onClose={
                    handleCloseVerifyDialog
                }
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Verify Certificate
                </DialogTitle>

                <DialogContent>

                    <FormControl
                        fullWidth
                        margin="normal"
                    >

                        <InputLabel>
                            Verification Type
                        </InputLabel>

                        <Select
                            value={
                                verifyType
                            }
                            label="Verification Type"
                            onChange={(event) => {

                                setVerifyType(
                                    event.target.value
                                );

                                setVerifyValue("");

                                setVerificationResult(
                                    null
                                );

                            }}
                        >

                            <MenuItem value="number">
                                Certificate Number
                            </MenuItem>

                            <MenuItem value="hash">
                                Certificate Hash
                            </MenuItem>

                        </Select>

                    </FormControl>

                    <TextField
                        fullWidth
                        margin="normal"
                        label={
                            verifyType ===
                            "number"
                                ? "Certificate Number"
                                : "Certificate Hash"
                        }
                        placeholder={
                            verifyType ===
                            "number"
                                ? "Example: CERT-2026-XXXXXXXX"
                                : "Enter SHA-256 hash"
                        }
                        value={
                            verifyValue
                        }
                        onChange={(event) =>
                            setVerifyValue(
                                event.target.value
                            )
                        }
                    />

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
                            }}
                        >

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >

                                    <VerifiedIcon
                                        color="success"
                                    />

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: "#166534",
                                        }}
                                    >
                                        Certificate Found
                                    </Typography>

                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >

                                    <strong>
                                        Certificate:
                                    </strong>{" "}

                                    {
                                        verificationResult.certificateNumber
                                    }

                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >

                                    <strong>
                                        Student:
                                    </strong>{" "}

                                    {
                                        verificationResult.studentName
                                    }

                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >

                                    <strong>
                                        Course:
                                    </strong>{" "}

                                    {
                                        verificationResult.courseName
                                    }

                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >

                                    <strong>
                                        University:
                                    </strong>{" "}

                                    {
                                        verificationResult.universityName
                                    }

                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >

                                    <strong>
                                        Issue Date:
                                    </strong>{" "}

                                    {
                                        verificationResult.issueDate
                                    }

                                </Typography>

                                {/* Certificate Hash */}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                        wordBreak:
                                            "break-all",
                                    }}
                                >

                                    <strong>
                                        Certificate Hash:
                                    </strong>{" "}

                                    {
                                        verificationResult.hash ||
                                        "Not Available"
                                    }

                                </Typography>

                                {/* Blockchain Transaction Hash */}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        wordBreak:
                                            "break-all",
                                    }}
                                >

                                    <strong>
                                        Blockchain Transaction:
                                    </strong>{" "}

                                    {
                                        verificationResult.blockchainTransactionHash ||
                                        "Not Available"
                                    }

                                </Typography>

                                <Box
                                    sx={{
                                        mt: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                    >
                                        <strong>
                                            Status:
                                        </strong>
                                    </Typography>

                                    <Chip
                                        size="small"
                                        icon={
                                            verificationResult.status ===
                                            "ACTIVE"
                                                ? <VerifiedIcon />
                                                : <BlockIcon />
                                        }
                                        label={
                                            verificationResult.status
                                        }
                                        color={
                                            verificationResult.status ===
                                            "ACTIVE"
                                                ? "success"
                                                : "error"
                                        }
                                    />

                                </Box>

                            </CardContent>

                        </Card>

                    )}

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >

                    <Button
                        onClick={
                            handleCloseVerifyDialog
                        }
                        sx={{
                            textTransform:
                                "none",
                        }}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleVerifyCertificate
                        }
                        disabled={
                            !verifyValue.trim() ||
                            verifyLoading
                        }
                        sx={{
                            textTransform:
                                "none",
                            fontWeight: 600,
                        }}
                    >

                        {
                            verifyLoading
                                ? "Verifying..."
                                : "Verify"
                        }

                    </Button>

                </DialogActions>

            </Dialog>

            {/* ==========================================
                Snackbar
            ========================================== */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    4000
                }
                onClose={
                    handleCloseSnackbar
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    onClose={
                        handleCloseSnackbar
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%",
                    }}
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
}

export default Certificates;