import {ProviderType } from "../type";
import axiosClient from "../axiosClient.ts";

const providerService = {
    
    getAllProviders: async (): Promise<{ contents: ProviderType[] }> => {
        try {
            const response = await axiosClient.get("/providers");
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    createProvider: async (
        newProvider: ProviderType
      ): Promise<ProviderType> => {
        try {
            const response = await axiosClient.post("/providers", newProvider);
            return response.data.data;
          } catch (error) {
            throw error;
          }
    },

    editProvider: async (updatedProvider: ProviderType): Promise<ProviderType> => {
        try {
          // console.log(updatedProvider);
            const response = await axiosClient.put("/providers", updatedProvider);
            return response.data.data;
          } catch (error) {
            throw error;
          }
    },

    deleteProvider: async (id: string): Promise<{ success: boolean }> => {
        try {
            await axiosClient.delete(`/providers/${id}`);
            return { success: true };
          } catch (error) {
            throw error;
          }
    },

    deleteMultipleProviders: async (ids: string[]): Promise<{ success: boolean }> => {
        try {
            await Promise.all(ids.map((id) => axiosClient.delete(`/providers/${id}`)));
            return { success: true };
          } catch (error) {
            throw error;
          }
    },
};

export default providerService;