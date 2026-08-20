import api from "./api";


// ==========================================
// Issue Certificate
// ==========================================

export const issueCertificate = async (certificateData) => {

    const response = await api.post(
        "/api/certificates",
        certificateData
    );

    return response.data;
};


// ==========================================
// Get All Certificates
// ==========================================

export const getAllCertificates = async () => {

    const response = await api.get(
        "/api/certificates"
    );

    return response.data;
};


// ==========================================
// Get Certificate By ID
// ==========================================

export const getCertificateById = async (id) => {

    const response = await api.get(
        `/api/certificates/${id}`
    );

    return response.data;
};


// ==========================================
// Verify Certificate By Number
// ==========================================

export const getCertificateByNumber = async (
    certificateNumber
) => {

    const response = await api.get(
        `/api/certificates/number/${certificateNumber}`
    );

    return response.data;
};


// ==========================================
// Verify Certificate By Hash
// ==========================================

export const verifyCertificateByHash = async (
    hash
) => {

    const response = await api.get(
        `/api/certificates/hash/${hash}`
    );

    return response.data;
};


// ==========================================
// Revoke Certificate
// ==========================================

export const revokeCertificate = async (id) => {

    const response = await api.put(
        `/api/certificates/revoke/${id}`
    );

    return response.data;
};


// ==========================================
// Download Certificate PDF
// ==========================================

export const downloadCertificate = async (id) => {

    const response = await api.get(
        `/api/certificates/${id}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};


// ==========================================
// Generate QR Code
// ==========================================

export const generateQrCode = async (id) => {

    const response = await api.get(
        `/api/certificates/${id}/qrcode`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};