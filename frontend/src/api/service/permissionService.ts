// import axiosClient from "../axiosClient";
import axiosClient from "../axiosClient";
import { CreatePermissionResponse, EditPermissionResponse, Permission, PermissionResponse } from "../type";
const mockPermissions = [
  { id: "ABC1", name: "truongkinhquinh", application: "bmchien1",created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC2", name: "tolaokien", application: "bmchien2", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC3", name: "truongkinhquinh", application: "bmchien3", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC4", name: "tolaokien", application: "bmchien4", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC5", name: "tolaokien", application: "bmchien5", created: "2025-02-21T16:51:11.872Z" },
];

const permissionService = {
  getAllPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await axiosClient.get("/permissions");
      // console.log(response.data);
      return response.data;
  } catch (error) {
      throw error;
  }
  },

  createPermission: async (newPermission: Permission): Promise<Permission> => {
    try {
      console.log(newPermission);
      const response = await axiosClient.post("/permissions", newPermission);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editPermission: async (updatedPermission: Permission): Promise<Permission> => {
    try {
      const response = await axiosClient.put(`/permissions/${updatedPermission.id}`, updatedPermission);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePermission: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/permissions/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultiplePermissions: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      await Promise.all(ids.map((id) => axiosClient.delete(`/permissions/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default permissionService;