import api from "./api";


// Get All Students
export const getAllStudents = async () => {

    const response = await api.get(
        "/api/students"
    );

    return response.data;
};


// Get Student By ID
export const getStudentById = async (id) => {

    const response = await api.get(
        `/api/students/${id}`
    );

    return response.data;
};


// Create Student
export const createStudent = async (studentData) => {

    const response = await api.post(
        "/api/students",
        studentData
    );

    return response.data;
};


// Update Student
export const updateStudent = async (
    id,
    studentData
) => {

    const response = await api.put(
        `/api/students/${id}`,
        studentData
    );

    return response.data;
};


// Delete Student
export const deleteStudent = async (id) => {

    const response = await api.delete(
        `/api/students/${id}`
    );

    return response.data;
};


// Search Students
export const searchStudents = async (name) => {

    const response = await api.get(
        "/api/students/search",
        {
            params: {
                name: name,
            },
        }
    );

    return response.data;
};