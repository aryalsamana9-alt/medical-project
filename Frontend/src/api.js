import axios from "axios";

// API requests are routed to /api. Vercel handles this in production, and Vite proxy handles it locally.
const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Transform network/CORS/timeout errors into a structured error so
    // pages can read err.response.data.detail instead of a generic fallback.
    if (!error.response) {
      let detail = "Registration failed. Please try again.";
      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        detail =
          "Cannot reach the server. Please check your internet connection and try again.";
      } else if (error.code === "ECONNABORTED") {
        detail =
          "Request timed out. Please check your connection and try again.";
      }
      // Attach a response-like object so existing error handlers work
      error.response = {
        data: { detail },
        status: 0,
      };
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
};

export const profileAPI = {
  getProfile: () => api.get("/profile"),
};

export const formAPI = {
  submitForm: (data) => api.post("/submit-form", data),
  getSubmissions: () => api.get("/submissions"),
};

export const appointmentAPI = {
  createAppointment: (data) => api.post("/appointments", data),
  getAppointments: () => api.get("/appointments"),
  getUpcomingAppointments: () => api.get("/appointments/upcoming"),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  cancelAppointment: (id) => api.patch(`/appointments/${id}/cancel`),
};

export default api;
