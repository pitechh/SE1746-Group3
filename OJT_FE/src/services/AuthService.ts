// File: src/services/AuthService.ts
import { jwtDecode } from "jwt-decode";
import axiosInstance from "./Axios";
import { Account } from "../types/DataTypes";
import { getStudentByAccountId } from "./StudentServices"; // Adjust the path as needed

interface JwtPayload {
  status: string;
  id: string; // ID của user
  name: string; // Tên user
  email: string; // Email user
  role: string; // Vai trò user
  exp: number; // Thời gian hết hạn token (UNIX timestamp)
}

const AuthService = {
  getToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  setToken: (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
  },

  removeToken: () => {
    localStorage.removeItem("accessToken");
  },

  decodeToken: (): JwtPayload | null => {
    const token = AuthService.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token) as JwtPayload;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  },

  getUserInfo: (): Account | null => {
    const decoded = AuthService.decodeToken();
    if (!decoded) return null;

    return {
      accountId: Number(decoded.id), // Chuyển về kiểu số
      fullname: decoded.name,
      email: decoded.email,
      role: decoded.role,
      status: decoded.status,
    };
  },

  isTokenExpired: (): boolean => {
    const decoded = AuthService.decodeToken();
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now();
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("api/Auth/signin", {
      email,
      password,
    });
    if (response.data.data) {
      AuthService.setToken(response.data.data);
      const accountData = AuthService.getUserInfo();
      if (accountData?.role === "Student") {
        const studentData = await getStudentByAccountId(accountData.accountId);
        localStorage.setItem("studentData", JSON.stringify(studentData));
      }
    }
    return response.data;
  },

  logOut: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    try {
      const response = await axiosInstance.post(`/api/Auth/signout`, null);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("studentData");
      return response.data;
    } catch (error) {
      console.error('Logout failed: ', error);
      throw new Error("Logout failed.");
    }
  },
};

export default AuthService;
