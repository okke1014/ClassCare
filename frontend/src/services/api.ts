import axios from "axios";

// Environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for auth token injection (placeholder)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password: string) => {
    // TODO: Connect to actual backend endpoint /api/v1/login/access-token
    // const response = await api.post("/login/access-token", { username, password });
    // return response.data;
    
    // Mock response for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (username === "admin" || username === "student") {
        return {
            access_token: "mock_token_" + username,
            token_type: "bearer",
            user: {
                username,
                role: username === "admin" ? "admin" : "student",
                academy_id: "classcare",
                center_id: "gangnam"
            }
        };
    }
    throw new Error("Invalid credentials");
  }
};

export const assignmentService = {
  getAssignment: async (classId: number) => {
    const response = await api.get(`/classes/${classId}/assignment`);
    return response.data;
  },
  submitAssignment: async (classId: number, data: any) => {
    const response = await api.post(`/classes/${classId}/assignment`, data);
    return response.data;
  }
};

export default api;





