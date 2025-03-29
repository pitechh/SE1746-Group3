import { Company, Internship } from "../types/DataTypes";
import axiosInstance from "./Axios";
import axios from "axios";


const API_URL = "http://localhost:5028/api/Internship";

const fetchInternships = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  companyId: number = 0,
  majorId: number = 0
): Promise<{ items: Internship[]; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/Internship-page-by-company`, {
      params: {
        CompanyId: companyId,
        MajorId: majorId,
        SearchTerm: searchTerm,
        PageNumber: pageNumber,
        PageSize: pageSize,
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
    console.error("Error fetching internships:", error);
    return { items: [], totalPages: 1 };
  }
};

const fetchAllInternships = async (
  pageNumber: number = 1,
  pageSize: number | null = null,
  searchTerm: string = "",
  MajorId: number | null = null,
  CompanyId: number | null = null,


): Promise<{ items: Internship[]; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/Internship-page-by-company`, {
      params: {
        SearchTerm: searchTerm,
        PageNumber: pageNumber,
        PageSize: pageSize,
        MajorId: MajorId,
        CompanyId: CompanyId
      }
    });
    if (response.data && response.data) {
      return {
        items: response?.data?.data.items || [],
        totalPages: response?.data?.data.totalPages || 0
      }
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching internship:", error);
    return { items: [], totalPages: 0 };
  }
}
const fetchInternshipById = async (id: string): Promise<Internship | null> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/GetInternship/${id}`);
    if (response.data) {
      return response.data.data
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching companies:", error);
    return null;
  }
}

export { fetchInternships, fetchInternshipById, fetchAllInternships };


export const updateInternship = async (id: number, internshipData: any) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/Update/${id}`, internshipData);
    return response.data;
  } catch (error) {
    console.error("Error updating internship:", error);
    throw error;
  }
};

export const createInternship = async (internshipData: any) => {
  try {
    const response = await axios.post( `${API_URL}/CreateInternship`, internshipData);
    return response.data;
  } catch (error) {
    console.error("Error creating internship:", error);
    throw error;
  }
};

export const deleteInternship = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/Delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating internship:", error);
    throw error;
  }
};