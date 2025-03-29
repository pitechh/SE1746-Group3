import { MajorFilter } from "../types/FilterTypes";
import axiosInstance from "./Axios";
import axios from "axios";

// URL của API backend
const API_URL = "http://localhost:5028/api/Major";

// Hàm lấy tất cả ngành học
export const fetchMajorFilters = async (): Promise<MajorFilter[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/GetAllMajor`);

    // Kiểm tra nếu response có data và đúng format
    if (response.data && response.data.data) {
      return response.data.data; // Trả về danh sách majors từ `data`
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching Filters majors:", error);
    return [];
  }
};