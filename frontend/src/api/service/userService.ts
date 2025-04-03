// import axiosClient from "../axiosClient";
import axiosClient from "../axiosClient";
import { User } from "../type";


const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axiosClient.get("/users");
      return response.data;
    } catch (error) {
        throw error;
    }
  },

  createUser: async (newUser: User): Promise<User> => {
    try {
      const response = await axiosClient.post("/users", newUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editUser: async (updatedUser: User): Promise<User> => {
    try {
      const response = await axiosClient.put(`/users/${updatedUser.id}`, updatedUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/users/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleUsers: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      // console.log(ids);
      await Promise.all(ids.map((id) => axiosClient.delete(`/users/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  createBulkUsers: async (file: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.post("/users/bulk", { file });
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  getUserById: async(id: string):Promise<User>=>{
    try{
      const response=await axiosClient.get(`/users/${id}`);
      return response.data;
    }
    catch(error){
      throw error;
    }
  }
};

export default userService;