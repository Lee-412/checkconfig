// import axiosClient from "../axiosClient";
import axiosClient from "../axiosClient";
import { CreateRouteResponse, EditRouteResponse, Route, RouteResponse } from "../type";

const tokenService = {
  getAllRoutes: async (): Promise<Route[]> => {
    try {
      const response = await axiosClient.get("/routes");
      console.log(response.data);
      return response.data.data;
  } catch (error) {
      throw error;
  }
  },

  createRoute: async (newRoutes: Route): Promise<Route> => {
    try {
      const response = await axiosClient.post("/routes", newRoutes);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  

  editRoute: async (updatedRoutes: Route): Promise<Route> => {
    try {
      const response = await axiosClient.put(`/routes/${updatedRoutes.id}`, updatedRoutes);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteRoute: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/routes/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleRoutes: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      await Promise.all(ids.map((id) => axiosClient.delete(`/routes/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

};

export default tokenService;
