import axiosClient from "../axiosClient";
import {Application } from "../type";


const applicationService = {
  getAllApplications: async (): Promise<Application[]> => {
    try {
      const response = await axiosClient.get("/applications");
      console.log(response.data);
      return response.data.data;
  } catch (error) {
      throw error;
  }
  },

  createApplication: async (newApplication: Application): Promise<Application> => {
    try {
      const response = await axiosClient.post("/applications", newApplication);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  editApplication: async (updatedApplication: Application): Promise<Application> => {
    try {
      const response = await axiosClient.put("/applications", updatedApplication);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/applications/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleApplications: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      await Promise.all(ids.map((id) => axiosClient.delete(`/applications/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default applicationService;