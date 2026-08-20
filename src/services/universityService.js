import api from "./api";


// ==========================================
// Get All Universities
// ==========================================

export const getAllUniversities = async () => {

    const response = await api.get(
        "/api/universities"
    );

    return response.data;
};


// ==========================================
// Get University By ID
// ==========================================

export const getUniversityById = async (id) => {

    const response = await api.get(
        `/api/universities/${id}`
    );

    return response.data;
};


// ==========================================
// Create University
// ==========================================

export const createUniversity = async (
    universityData
) => {

    const response = await api.post(
        "/api/universities",
        universityData
    );

    return response.data;
};


// ==========================================
// Update University
// ==========================================

export const updateUniversity = async (
    id,
    universityData
) => {

    const response = await api.put(
        `/api/universities/${id}`,
        universityData
    );

    return response.data;
};


// ==========================================
// Delete University
// ==========================================

export const deleteUniversity = async (id) => {

    const response = await api.delete(
        `/api/universities/${id}`
    );

    return response.data;
};


// ==========================================
// Search Universities
// ==========================================

export const searchUniversities = async (
    name
) => {

    const response = await api.get(
        "/api/universities/search",
        {
            params: {
                name: name,
            },
        }
    );

    return response.data;
};


// ==========================================
// Get Universities With Pagination
// ==========================================

export const getUniversitiesPage = async (
    page = 0,
    size = 5
) => {

    const response = await api.get(
        "/api/universities/page",
        {
            params: {
                page: page,
                size: size,
            },
        }
    );

    return response.data;
};