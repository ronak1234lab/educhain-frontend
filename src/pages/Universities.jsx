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
    InputAdornment,
    Pagination,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { useEffect, useState } from "react";

import {
    getUniversitiesPage,
    searchUniversities,
    createUniversity,
    updateUniversity,
    deleteUniversity,
} from "../services/universityService";


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


    // Safe default
    return "STUDENT";
};


// ==========================================
// Universities Page
// ==========================================

function Universities() {

    // ==========================================
    // Current User Role
    // ==========================================

    const [userRole] =
        useState(getCurrentUserRole);


    // ==========================================
    // Permissions
    // ==========================================

    const canAccessUniversities =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    const canManageUniversities =
        userRole === "ADMIN" ||
        userRole === "UNIVERSITY";


    // ==========================================
    // Universities
    // ==========================================

    const [universities, setUniversities] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // Search
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // Pagination
    // ==========================================

    const [page, setPage] =
        useState(0);


    const [totalPages, setTotalPages] =
        useState(0);


    const pageSize = 5;


    // ==========================================
    // Add / Edit Dialog
    // ==========================================

    const [openDialog, setOpenDialog] =
        useState(false);


    const [editMode, setEditMode] =
        useState(false);


    const [selectedUniversityId, setSelectedUniversityId] =
        useState(null);


    // ==========================================
    // Delete Dialog
    // ==========================================

    const [deleteDialog, setDeleteDialog] =
        useState(false);


    const [universityToDelete, setUniversityToDelete] =
        useState(null);


    // ==========================================
    // Form
    // ==========================================

    const [formData, setFormData] =
        useState({
            universityName: "",
            email: "",
            address: "",
            phone: "",
        });


    // ==========================================
    // Form Errors
    // ==========================================

    const [formErrors, setFormErrors] =
        useState({
            universityName: "",
            email: "",
            address: "",
            phone: "",
        });


    // ==========================================
    // Saving / Deleting
    // ==========================================

    const [saving, setSaving] =
        useState(false);


    const [deleting, setDeleting] =
        useState(false);


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
    // Load Universities On Page Open
    // ==========================================

    useEffect(() => {

        // STUDENT / EMPLOYER:
        // Do NOT call the API.

        if (!canAccessUniversities) {

            setLoading(false);

            return;
        }


        loadUniversities(0);

    }, []);


    // ==========================================
    // Show Snackbar
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

    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (reason === "clickaway") {
            return;
        }


        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };


    // ==========================================
    // Load Paginated Universities
    // ==========================================

    const loadUniversities = async (
        requestedPage = 0
    ) => {

        if (!canAccessUniversities) {
            return;
        }


        try {

            setLoading(true);


            const data =
                await getUniversitiesPage(
                    requestedPage,
                    pageSize
                );


            setUniversities(
                Array.isArray(data.content)
                    ? data.content
                    : []
            );


            setTotalPages(
                data.totalPages || 0
            );


            setPage(
                data.number ?? requestedPage
            );

        } catch (error) {

            console.error(
                "Failed to load universities:",
                error
            );


            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to view universities.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to load universities.",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Search Universities
    // ==========================================

    const handleSearch = async (
        value
    ) => {

        if (!canAccessUniversities) {
            return;
        }


        setSearch(value);


        // Empty search:
        // Return to pagination.

        if (value.trim() === "") {

            loadUniversities(0);

            return;
        }


        try {

            setLoading(true);


            const data =
                await searchUniversities(
                    value.trim()
                );


            setUniversities(
                Array.isArray(data)
                    ? data
                    : []
            );


            // Search results don't use pagination.

            setTotalPages(0);

            setPage(0);

        } catch (error) {

            console.error(
                "Failed to search universities:",
                error
            );


            if (
                error?.response?.status === 403
            ) {

                showSnackbar(
                    "You are not authorized to search universities.",
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to search universities.",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // Change Page
    // ==========================================

    const handlePageChange = (
        event,
        selectedPage
    ) => {

        if (!canAccessUniversities) {
            return;
        }


        const newPage =
            selectedPage - 1;


        loadUniversities(
            newPage
        );
    };


    // ==========================================
    // Form Input
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


        setFormErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };


    // ==========================================
    // Validate Form
    // ==========================================

    const validateForm = () => {

        const errors = {};


        // University Name

        if (!formData.universityName.trim()) {

            errors.universityName =
                "University name is required.";

        } else if (
            formData.universityName.trim().length < 3
        ) {

            errors.universityName =
                "University name must contain at least 3 characters.";

        } else if (
            formData.universityName.trim().length > 100
        ) {

            errors.universityName =
                "University name cannot exceed 100 characters.";
        }


        // Email

        if (!formData.email.trim()) {

            errors.email =
                "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {

            errors.email =
                "Please enter a valid email address.";
        }


        // Address

        if (!formData.address.trim()) {

            errors.address =
                "Address is required.";
        }


        // Phone

        if (!formData.phone.trim()) {

            errors.phone =
                "Phone number is required.";

        } else if (
            !/^[0-9]{10}$/.test(
                formData.phone.trim()
            )
        ) {

            errors.phone =
                "Phone number must contain exactly 10 digits.";
        }


        setFormErrors({
            universityName:
                errors.universityName || "",

            email:
                errors.email || "",

            address:
                errors.address || "",

            phone:
                errors.phone || "",
        });


        return Object.keys(errors).length === 0;
    };


    // ==========================================
    // Open Add Dialog
    // ==========================================

    const handleOpenAddDialog = () => {

        if (!canManageUniversities) {
            return;
        }


        setEditMode(false);

        setSelectedUniversityId(null);


        setFormData({
            universityName: "",
            email: "",
            address: "",
            phone: "",
        });


        setFormErrors({
            universityName: "",
            email: "",
            address: "",
            phone: "",
        });


        setOpenDialog(true);
    };


    // ==========================================
    // Open Edit Dialog
    // ==========================================

    const handleOpenEditDialog = (
        university
    ) => {

        if (!canManageUniversities) {
            return;
        }


        setEditMode(true);


        setSelectedUniversityId(
            university.id
        );


        setFormData({
            universityName:
                university.universityName || "",

            email:
                university.email || "",

            address:
                university.address || "",

            phone:
                university.phone || "",
        });


        setFormErrors({
            universityName: "",
            email: "",
            address: "",
            phone: "",
        });


        setOpenDialog(true);
    };


    // ==========================================
    // Close Dialog
    // ==========================================

    const handleCloseDialog = () => {

        if (saving) {
            return;
        }


        setOpenDialog(false);

        setEditMode(false);

        setSelectedUniversityId(null);
    };


    // ==========================================
    // Add / Update University
    // ==========================================

    const handleSubmit = async () => {

        if (!canManageUniversities) {
            return;
        }


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);


            const cleanedData = {

                universityName:
                    formData.universityName.trim(),

                email:
                    formData.email.trim(),

                address:
                    formData.address.trim(),

                phone:
                    formData.phone.trim(),
            };


            if (editMode) {

                await updateUniversity(
                    selectedUniversityId,
                    cleanedData
                );


                showSnackbar(
                    "University updated successfully.",
                    "success"
                );

            } else {

                await createUniversity(
                    cleanedData
                );


                showSnackbar(
                    "University added successfully.",
                    "success"
                );
            }


            handleCloseDialog();


            if (search.trim()) {

                await handleSearch(
                    search
                );

            } else {

                await loadUniversities(0);
            }

        } catch (error) {

            console.error(
                "Failed to save university:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to save university. Please try again.",
                "error"
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================
    // Open Delete Dialog
    // ==========================================

    const handleOpenDeleteDialog = (
        university
    ) => {

        if (!canManageUniversities) {
            return;
        }


        setUniversityToDelete(
            university
        );


        setDeleteDialog(true);
    };


    // ==========================================
    // Close Delete Dialog
    // ==========================================

    const handleCloseDeleteDialog = () => {

        if (deleting) {
            return;
        }


        setDeleteDialog(false);

        setUniversityToDelete(null);
    };


    // ==========================================
    // Delete University
    // ==========================================

    const handleDeleteUniversity = async () => {

        if (!canManageUniversities) {
            return;
        }


        if (!universityToDelete) {
            return;
        }


        try {

            setDeleting(true);


            await deleteUniversity(
                universityToDelete.id
            );


            setDeleteDialog(false);

            setUniversityToDelete(null);


            showSnackbar(
                "University deleted successfully.",
                "success"
            );


            if (search.trim()) {

                await handleSearch(
                    search
                );

            } else {

                await loadUniversities(
                    page
                );
            }

        } catch (error) {

            console.error(
                "Failed to delete university:",
                error
            );


            const backendMessage =
                error?.response?.data?.message;


            showSnackbar(
                backendMessage ||
                "Failed to delete university. Please try again.",
                "error"
            );

        } finally {

            setDeleting(false);
        }
    };


    // ==========================================
    // Unauthorized View
    // ==========================================

    if (!canAccessUniversities) {

        return (

            <Box
                sx={{
                    width: "100%",

                    minHeight:
                        "60vh",

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    px: 2,
                }}
            >

                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 520,

                        borderRadius: 3,

                        border:
                            "1px solid #e5e7eb",

                        textAlign:
                            "center",
                    }}
                >

                    <CardContent
                        sx={{
                            py: 6,
                            px: 3,
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,

                                color:
                                    "#111827",

                                mb: 1,
                            }}
                        >
                            Access Restricted
                        </Typography>


                        <Typography
                            variant="body1"
                            sx={{
                                color:
                                    "#6b7280",

                                mb: 1,
                            }}
                        >
                            You are not authorized
                            to view universities.
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "#9ca3af",
                            }}
                        >
                            Current role:{" "}
                            <strong>
                                {userRole}
                            </strong>
                        </Typography>

                    </CardContent>

                </Card>

            </Box>
        );
    }


    // ==========================================
    // Main Render
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

                    justifyContent:
                        "space-between",

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

                <Box
                    sx={{
                        minWidth: 0,
                    }}
                >

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,

                            color:
                                "#111827",

                            fontSize: {
                                xs: "2rem",
                                sm: "2.125rem",
                            },
                        }}
                    >
                        Universities
                    </Typography>


                    <Typography
                        variant="body1"
                        sx={{
                            color:
                                "#6b7280",

                            mt: 0.5,
                        }}
                    >
                        Manage universities
                        registered on EduChain.
                    </Typography>

                </Box>


                {/* ==========================================
                    Add University
                ========================================== */}

                {canManageUniversities && (

                    <Button
                        variant="contained"

                        startIcon={
                            <AddIcon />
                        }

                        onClick={
                            handleOpenAddDialog
                        }

                        sx={{
                            borderRadius: 2,

                            textTransform:
                                "none",

                            fontWeight: 600,

                            px: 2.5,

                            width: {
                                xs: "100%",
                                sm: "auto",
                            },

                            minWidth: {
                                xs: "100%",
                                sm: 160,
                            },
                        }}
                    >
                        Add University
                    </Button>

                )}

            </Box>


            {/* ==========================================
                Search
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,

                    border:
                        "1px solid #e5e7eb",

                    mb: 2,
                }}
            >

                <CardContent
                    sx={{
                        p: 2,
                    }}
                >

                    <TextField
                        fullWidth

                        value={
                            search
                        }

                        onChange={(event) =>
                            handleSearch(
                                event.target.value
                            )
                        }

                        placeholder="Search university by name..."

                        size="small"

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

                        sx={{
                            maxWidth: 500,

                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />

                </CardContent>

            </Card>


            {/* ==========================================
                Results Count
            ========================================== */}

            {!loading && (

                <Box
                    sx={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        mb: 1.5,

                        px: 0.5,
                    }}
                >

                    <Typography
                        variant="body2"
                        sx={{
                            color:
                                "#6b7280",
                        }}
                    >

                        {search.trim()

                            ? `Found ${
                                universities.length
                            } ${
                                universities.length === 1
                                    ? "university"
                                    : "universities"
                            }`

                            : `Showing ${
                                universities.length
                            } ${
                                universities.length === 1
                                    ? "university"
                                    : "universities"
                            }`
                        }

                    </Typography>

                </Box>

            )}


            {/* ==========================================
                University Table
            ========================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,

                    border:
                        "1px solid #e5e7eb",

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

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

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

                                overflowX:
                                    "auto",
                            }}
                        >

                            <Table
                                sx={{
                                    minWidth: 750,
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
                                            University Name
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Email
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Address
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Phone
                                        </TableCell>


                                        {canManageUniversities && (

                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Actions
                                            </TableCell>

                                        )}

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {universities.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                colSpan={
                                                    canManageUniversities
                                                        ? 6
                                                        : 5
                                                }

                                                align="center"

                                                sx={{
                                                    py: 7,
                                                }}
                                            >

                                                <Box>

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                600,

                                                            color:
                                                                "#374151",

                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        No universities found
                                                    </Typography>


                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color:
                                                                "#9ca3af",
                                                        }}
                                                    >

                                                        {search.trim()

                                                            ? "Try changing your search."

                                                            : "No universities are currently available."
                                                        }

                                                    </Typography>

                                                </Box>

                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        universities.map(
                                            (university) => (

                                                <TableRow
                                                    key={
                                                        university.id
                                                    }

                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            university.id
                                                        }
                                                    </TableCell>


                                                    <TableCell>

                                                        <Typography
                                                            sx={{
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            {
                                                                university.universityName
                                                            }
                                                        </Typography>

                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            university.email ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            university.address ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    <TableCell>
                                                        {
                                                            university.phone ||
                                                            "-"
                                                        }
                                                    </TableCell>


                                                    {canManageUniversities && (

                                                        <TableCell>

                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",

                                                                    gap:
                                                                        0.5,

                                                                    flexWrap:
                                                                        "wrap",
                                                                }}
                                                            >

                                                                <Button
                                                                    size="small"

                                                                    onClick={() =>
                                                                        handleOpenEditDialog(
                                                                            university
                                                                        )
                                                                    }

                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>


                                                                <Button
                                                                    size="small"

                                                                    color="error"

                                                                    onClick={() =>
                                                                        handleOpenDeleteDialog(
                                                                            university
                                                                        )
                                                                    }

                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>

                                                            </Box>

                                                        </TableCell>

                                                    )}

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
                        !search.trim() &&
                        totalPages > 1 && (

                            <Box
                                sx={{
                                    display: "flex",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    py: 2.5,

                                    px: 2,

                                    borderTop:
                                        "1px solid #e5e7eb",

                                    overflowX:
                                        "auto",
                                }}
                            >

                                <Pagination
                                    count={
                                        totalPages
                                    }

                                    page={
                                        page + 1
                                    }

                                    onChange={
                                        handlePageChange
                                    }

                                    color="primary"

                                    shape="rounded"

                                    showFirstButton

                                    showLastButton

                                    size="medium"
                                />

                            </Box>

                        )}

                </CardContent>

            </Card>


            {/* ==========================================
                Add / Edit Dialog
            ========================================== */}

            {canManageUniversities && (

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
                        }}
                    >
                        {editMode
                            ? "Edit University"
                            : "Add University"
                        }
                    </DialogTitle>


                    <DialogContent>

                        <TextField
                            fullWidth

                            label="University Name"

                            name="universityName"

                            value={
                                formData.universityName
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.universityName
                                )
                            }

                            helperText={
                                formErrors.universityName
                            }

                            margin="normal"

                            autoFocus
                        />


                        <TextField
                            fullWidth

                            label="Email"

                            name="email"

                            type="email"

                            value={
                                formData.email
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.email
                                )
                            }

                            helperText={
                                formErrors.email
                            }

                            margin="normal"
                        />


                        <TextField
                            fullWidth

                            label="Address"

                            name="address"

                            value={
                                formData.address
                            }

                            onChange={
                                handleInputChange
                            }

                            error={
                                Boolean(
                                    formErrors.address
                                )
                            }

                            helperText={
                                formErrors.address
                            }

                            margin="normal"
                        />


                        <TextField
                            fullWidth

                            label="Phone Number"

                            name="phone"

                            value={
                                formData.phone
                            }

                            onChange={(event) => {

                                const value =
                                    event.target.value;


                                if (
                                    /^[0-9]*$/.test(
                                        value
                                    ) &&
                                    value.length <= 10
                                ) {

                                    handleInputChange(
                                        event
                                    );
                                }
                            }}

                            error={
                                Boolean(
                                    formErrors.phone
                                )
                            }

                            helperText={
                                formErrors.phone ||
                                "Enter exactly 10 digits."
                            }

                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric",
                                    maxLength: 10,
                                },
                            }}

                            margin="normal"
                        />

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

                            disabled={
                                saving
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
                                saving
                            }

                            sx={{
                                textTransform:
                                    "none",

                                minWidth: 140,
                            }}
                        >

                            {saving ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,
                                    }}
                                >

                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />

                                    Saving...

                                </Box>

                            ) : (

                                editMode
                                    ? "Update University"
                                    : "Add University"

                            )}

                        </Button>

                    </DialogActions>

                </Dialog>

            )}


            {/* ==========================================
                Delete Dialog
            ========================================== */}

            {canManageUniversities && (

                <Dialog
                    open={
                        deleteDialog
                    }

                    onClose={
                        handleCloseDeleteDialog
                    }

                    maxWidth="xs"

                    fullWidth
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Delete University
                    </DialogTitle>


                    <DialogContent>

                        <Typography>

                            Are you sure you want
                            to delete{" "}

                            <strong>
                                {
                                    universityToDelete
                                        ?.universityName
                                }
                            </strong>

                            ?

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "#6b7280",

                                mt: 1,
                            }}
                        >
                            This action cannot be undone.
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
                                handleCloseDeleteDialog
                            }

                            disabled={
                                deleting
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
                                handleDeleteUniversity
                            }

                            disabled={
                                deleting
                            }

                            sx={{
                                textTransform:
                                    "none",

                                minWidth: 100,
                            }}
                        >

                            {deleting ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,
                                    }}
                                >

                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />

                                    Deleting...

                                </Box>

                            ) : (

                                "Delete"

                            )}

                        </Button>

                    </DialogActions>

                </Dialog>

            )}


            {/* ==========================================
                Snackbar
            ========================================== */}

            <Snackbar
                open={
                    snackbar.open
                }

                autoHideDuration={
                    3500
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


export default Universities;