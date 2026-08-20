import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {

    const location = useLocation();

    // ==========================================
    // Check Login Token
    // ==========================================

    const token =
        localStorage.getItem("token");

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        );
    }

    // ==========================================
    // Get User Role
    // ==========================================

    let role = null;

    const storedUser =
        localStorage.getItem("user");

    const storedRole =
        localStorage.getItem("role");

    const storedEduChainUser =
        localStorage.getItem("educhainUser");

    // ==========================================
    // Read User Object
    // ==========================================

    if (storedUser) {

        try {

            const user =
                JSON.parse(storedUser);

            role =
                user?.role ||
                user?.userRole ||
                user?.authority ||
                user?.authorities;

            if (Array.isArray(role)) {

                role = role[0];
            }

        } catch (error) {

            console.error(
                "User data error:",
                error
            );
        }
    }

    // ==========================================
    // Read Role Directly
    // ==========================================

    if (!role && storedRole) {

        role =
            storedRole;
    }

    // ==========================================
    // Read EduChain User
    // ==========================================

    if (!role && storedEduChainUser) {

        try {

            const data =
                JSON.parse(
                    storedEduChainUser
                );

            role =
                data?.role ||
                data?.user?.role ||
                data?.user?.userRole ||
                data?.user?.authority ||
                data?.user?.authorities;

            if (Array.isArray(role)) {

                role = role[0];
            }

        } catch (error) {

            console.error(
                "EduChain user data error:",
                error
            );
        }
    }

    // ==========================================
    // Read Role From JWT
    // ==========================================

    if (!role && token) {

        try {

            const tokenParts =
                token.split(".");

            if (tokenParts.length === 3) {

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
                        atob(
                            paddedPayload
                        )
                    );

                role =
                    payload?.role ||
                    payload?.roles ||
                    payload?.authority ||
                    payload?.authorities;

                if (Array.isArray(role)) {

                    role = role[0];
                }
            }

        } catch (error) {

            console.error(
                "JWT role error:",
                error
            );
        }
    }

    // ==========================================
    // Normalize Role
    // ==========================================

    if (role) {

        role =
            String(role)
                .replace("ROLE_", "")
                .toUpperCase()
                .trim();
    }

    // ==========================================
    // No Role
    // ==========================================

    if (!role) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        );
    }

    // ==========================================
    // Role Permissions
    // ==========================================

    const permissions = {

        ADMIN: [
            "/",
            "/universities",
            "/students",
            "/courses",
            "/certificates",
            "/verify-certificate",
            "/blockchain",
            "/search"
        ],

        UNIVERSITY: [
            "/",
            "/universities",
            "/students",
            "/courses",
            "/certificates",
            "/verify-certificate",
            "/blockchain",
            "/search"
        ],

        STUDENT: [
            "/",
            "/certificates",
            "/verify-certificate",
            "/blockchain",
            "/search"
        ],

        EMPLOYER: [
            "/",
            "/certificates",
            "/verify-certificate",
            "/blockchain",
            "/search"
        ]
    };

    // ==========================================
    // Allowed Routes
    // ==========================================

    const allowedRoutes =
        permissions[role] || [];

    // ==========================================
    // Current URL
    // ==========================================

    const currentPath =
        location.pathname;

    // ==========================================
    // Check Permission
    // ==========================================

    const allowed =
        allowedRoutes.includes(
            currentPath
        );

    // ==========================================
    // Access Denied
    // ==========================================

    if (!allowed) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    width: "100%",
                    backgroundColor: "#f5f7fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "50px 30px",
                        textAlign: "center",
                        boxShadow:
                            "0 4px 20px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            fontSize: "52px",
                            marginBottom: "15px"
                        }}
                    >
                        🔒
                    </div>

                    <h1
                        style={{
                            margin: "0 0 15px",
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#111827"
                        }}
                    >
                        Access Restricted
                    </h1>

                    <p
                        style={{
                            margin: "0 0 12px",
                            fontSize: "18px",
                            color: "#6b7280"
                        }}
                    >
                        You are not authorized
                        to view this page.
                    </p>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            color: "#6b7280"
                        }}
                    >
                        Current role:{" "}

                        <strong
                            style={{
                                color: "#2563eb"
                            }}
                        >
                            {role}
                        </strong>
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // Access Granted
    // ==========================================

    return <Outlet />;
}

export default ProtectedRoute;