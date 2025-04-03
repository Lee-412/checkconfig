// import axiosClient from "../axiosClient";
import axiosClient from "../axiosClient";
import { CreateRoleResponse, EditRoleResponse, Role, RoleResponse } from "../type";
const mockRoles = [
  { id: "ABC1", name: "truongkinhquinh", application: "bmchien1",created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC2", name: "tolaokien", application: "bmchien2", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC3", name: "truongkinhquinh", application: "bmchien3", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC4", name: "tolaokien", application: "bmchien4", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC5", name: "tolaokien", application: "bmchien5", created: "2025-02-21T16:51:11.872Z" },
];

const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await axiosClient.get("/roles");
      // console.log(response.data);
      return response.data;
  } catch (error) {
      throw error;
  }
  },

  createRole: async (newRole: Role): Promise<Role> => {
    try {
      const response = await axiosClient.post("/roles", newRole);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editRole: async (updatedRole: Role): Promise<Role> => {
    try {
      const response = await axiosClient.put(`/roles/${updatedRole.id}`, updatedRole);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteRole: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/roles/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleRoles: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      await Promise.all(ids.map((id) => axiosClient.delete(`/roles/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default roleService;