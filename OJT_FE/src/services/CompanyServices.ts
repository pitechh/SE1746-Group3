import { Company } from "../types/DataTypes";
import { CompanyFilter } from "../types/FilterTypes";
import axiosInstance from "./Axios";

const API_URL = "http://localhost:5028/api/Company";

// Hàm lấy danh sách công ty với tìm kiếm, phân trang và lọc
const fetchCompanies = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  location: string = ""
): Promise<{ items: Company[]; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companies`, {
      params: {
        SearchTerm: searchTerm,
        Location: location,
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });

    if (response.data && response.data.data) {
      return {
        items: response.data.data.items || [],
        totalPages: response.data.data.totalPages || 0,
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching companies:", error);
    return { items: [], totalPages: 0 };
  }
};

const fetchAllCompanies = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  location: string = ""
): Promise<Company[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companies`, {
      params: {
        SearchTerm: searchTerm,
        Location: location,
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data.items
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching companies:", error);
    return []
  }
};

const fetchCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companies/${id}`);
    if (response.data && response.data.data) {
      return response.data.data
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching companies:", error);
    return null;
  }
}


const fetchCompanyFilter = async (
): Promise<{ items: CompanyFilter[] }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companies`, {

    });

    if (response.data && response.data.data) {
      return {
        items: response.data.data.items || [],
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching Filters companies:", error);
    return { items: [] };
  }
};

export const getCompanyByAccountID = async (accountId: number): Promise<Company | null> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companiesbyAccount/${accountId}`);

    if (response.data && response.data.data) {
      return response.data.data;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching company by account ID:", error);
    return null;
  }
};

export { fetchCompanies, fetchAllCompanies, fetchCompanyById, fetchCompanyFilter };

// Tạo công ty mới (POST)
export const createCompany = async (companyData: FormData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/companies`, companyData);
    return response.data;
  } catch (error) {
    throw error; // Để lỗi có thể bắt ở nơi gọi service
  }
};

// Cập nhật thông tin công ty (PUT)
export const updateCompany = async (companyData: FormData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/companies`, companyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết công ty (GET)
export const getCompanyDetails = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/companies/${companyId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
