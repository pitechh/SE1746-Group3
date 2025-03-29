import { Account, AccountEntity } from "../types/DataTypes";
import { Role } from "../types/StatusEnum";
import axiosInstance from "./Axios";

const API_URL = "http://localhost:5028/api/Account";

const fetchAllAccounts = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  role: string = "",
  status: string = ""

): Promise<{ items: Account[], totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/accounts`, {
      params: {
        searchTerm: searchTerm,
        role: role,
        status: status,
        PageNumber: pageNumber,
        PageSize: pageSize,
      }
    });
    if (response.data && response.data.data) {
      return {
        items: response.data.data.items || [],
        totalPages: response.data.data.totalPages || 1
      }
    }

    throw new Error("Invalid response format")
  } catch (error) {
    console.error("Error fetching internships:", error);
    return { items: [], totalPages: 1 };
  }
};

export { fetchAllAccounts };

export const createAccount = async (reqAccountDTO: AccountEntity) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/accounts`,
      reqAccountDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllcountByRoleAndStatus = async (
  role: string = "",
  status: string = ""
): Promise<Account[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/accounts`, {
      params: {
        role: role,
        status: status,
      },
    });
    if (response.data && response.data.data) {
      return response.data.data.items;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching internships:", error);
    return [];
  }
};
