import { StudentApplied } from "../types/DataTypes";
import { ApplyStatus } from "../types/StatusEnum";
import axiosInstance from "./Axios";
import AuthService from "./AuthService";


const API_URL = "http://localhost:5028/api/Student";


export const fetchStudentApplied = async (
  companyId: number,
  pageNumber: number = 1,
  pageSize: number = 10,
  major: string = "",
  searchTerm: string = ""
): Promise<{ items: StudentApplied[]; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/company/${companyId}/applied-students`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        major: major,
        SearchTerm: searchTerm,
      },
    });

    if (response.data && response.data.data) {
      return {
        items: response.data.data.items || [],
        totalPages: response.data.data.totalPages || 1,
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching applied students:", error);
    return { items: [], totalPages: 1 };
  }
};

export const getStudentByAccountId = async (
  accountId: number
) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/Student/${accountId}`);
    if (response.data && response.data.data) {
      return response.data.data
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching applied students:", error);
  }
}

export const getStudent = async () => {
  try {
    const accountData = await AuthService.getUserInfo();
    const response = await axiosInstance.get(`${API_URL}/Student/${accountData?.accountId}`);
    if (response.data && response.data.data) {
      return response.data.data
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching applied students:", error);
  }
}

export const getStudentInStorage = async () => {
  const studentDataString = localStorage.getItem("studentData");
  if (!studentDataString) {
    throw new Error("Student data not found in localStorage");
  }
  // Parse JSON để lấy đối tượng
  const studentData = JSON.parse(studentDataString);
  return studentData
}

export const fetchStudentInStorage = async () => {
  const accountData = await AuthService.getUserInfo();
  if (!accountData) {
    throw new Error("User info not found");
  }
  const studentData = await getStudentByAccountId(accountData.accountId);
  localStorage.setItem("studentData", JSON.stringify(studentData));
}

export const applyJob = async (internshipId: string) => {
  const studentData = await getStudentInStorage();
  const status: string = "Pending";
  try {
    const response = await axiosInstance.post(`${API_URL}/CreateApply`, {
      timeApply: new Date().toISOString(),
      status: status,
      studentId: studentData.studentId,
      internshipId: internshipId,
    })
    fetchStudentInStorage();
  } catch (error) {
    console.error("Error fetching applied students:", error);
  }
}

export const getListApplied = async () => {
  const studentData = await getStudentInStorage();
  try {
    const response = await axiosInstance.get(`${API_URL}/studentapply/${studentData.studentId}`);
    if (response.data && response.data.data) {
      return response.data
    }
    throw new Error("Invalid response format");

  } catch (error) {
    console.error("Error fetching applied list:", error);

  }
}

export const updateApplyStatus = async (studentID: number, applyId: number, status: string) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/update-status/${applyId}`, {
      status,
      studentID
    });

    return response.data;
  } catch (error) {
    console.error("Error updating apply status:", error);
    throw error;
  }
};
