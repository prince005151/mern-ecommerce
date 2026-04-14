
import axios from "../lib/axios.js"
import {create} from "zustand"
import {toast} from "react-hot-toast"


export const useUserStore = create((set) => ({
  user: null,
  checkingAuth: true,

  signup: async ({ name, email, password }) => {
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data });
      toast.success("Signup successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  },

  login: async ({ email, password }) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data });
      toast.success("Login successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout")
      set({user: null, checkingAuth: false})
      toast.success("Logout Successfully")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  }
}));