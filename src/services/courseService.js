import api from "./api";


// Get All Courses
export const getAllCourses = async () => {

    const response = await api.get(
        "/api/courses"
    );

    return response.data;
};


// Get Course By ID
export const getCourseById = async (id) => {

    const response = await api.get(
        `/api/courses/${id}`
    );

    return response.data;
};


// Create Course
export const createCourse = async (courseData) => {

    const response = await api.post(
        "/api/courses",
        courseData
    );

    return response.data;
};


// Update Course
export const updateCourse = async (
    id,
    courseData
) => {

    const response = await api.put(
        `/api/courses/${id}`,
        courseData
    );

    return response.data;
};


// Delete Course
export const deleteCourse = async (id) => {

    const response = await api.delete(
        `/api/courses/${id}`
    );

    return response.data;
};


// Search Course By Name
export const searchCourses = async (name) => {

    const response = await api.get(
        "/api/courses/search",
        {
            params: {
                name: name,
            },
        }
    );

    return response.data;
};


// Search Courses By Department
export const getCoursesByDepartment = async (
    department
) => {

    const response = await api.get(
        "/api/courses/department",
        {
            params: {
                department: department,
            },
        }
    );

    return response.data;
};