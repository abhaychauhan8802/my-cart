import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-toastify";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  isAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (!name || !email || !password || !confirmPassword) {
      set({ loading: false });
      return toast.error("Please fill up all fields");
    }

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", {
        username: name,
        email,
        password,
      });

      set({ user: res.data, loading: false });
      toast.success("SignUp successfully");
    } catch (error) {
      set({ loading: false });

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something wents wrong");
      }
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({ user: res.data, loading: false });
      toast.success("Login successfully");
    } catch (error) {
      set({ loading: false });

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something wents wrong");
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");

      set({ user: null });
      toast.success("Logout successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something wents wrong");
    }
  },

  checkAuth: async () => {
    set({ isAuth: true });
    try {
      const res = await axios.get("/auth/profile");

      set({ user: res.data, isAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ user: null, isAuth: false });
    }
  },

  refreshToken: async () => {
    if (get().isAuth) return;

    set({ isAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ isAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, isAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else {
          refreshPromise = useUserStore.getState().refreshToken();
          await refreshPromise;
        }

        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
