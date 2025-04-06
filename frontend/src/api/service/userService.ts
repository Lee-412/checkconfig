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

  // createBulkUsers: async (file: File): Promise<{ success: boolean }> => {
  //   try {
  //     const response = await axiosClient.post("/users/bulk", { file });
  //     return { success: true };
  //   } catch (error) {
  //     throw error;
  //   }
  // },
   createBulkUsers: async (file: File): Promise<{ success: boolean }> => {
    try {
      // Tạo FormData và append file CSV vào nó
      const formData = new FormData();
      formData.append("file", file);
  
      // Gửi yêu cầu POST tới API để tải lên file
      const response = await axiosClient.post("/users/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo gửi file dưới dạng form-data
        },
      });
  
      // Kiểm tra response nếu thành công
      if (response.status === 200) {
        return { success: true };
      }
  
      throw new Error("Failed to upload file");
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