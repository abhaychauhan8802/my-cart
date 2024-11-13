import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "../libs/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  addProduct: async (product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products/create", product);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));

      toast.success("Product add successfully");
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

  getAllProducts: async (start, limit) => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `/products?start=${start || 0}&${limit || 9}`
      );
      set({
        products: res.data,
        loading: false,
      });
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

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/delete/${id}`);
      const data = res.data;

      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
      }));

      set({ loading: false });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something wents wrong");
      }
    } finally {
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (id) => {
    try {
      const res = await axios.put(`/products/toggle-featured-product/${id}`);
      const data = res.data;

      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: data.isFeatured }
            : product
        ),
      }));
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something wents wrong");
      }
    }
  },
}));
