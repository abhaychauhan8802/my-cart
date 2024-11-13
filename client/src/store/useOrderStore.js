import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-toastify";

export const useOrderStore = create((set, get) => ({
  allOrders: [],
  orders: [],

  getAllOrders: async () => {
    try {
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something wents wrong");
      }
    }
  },
}));
