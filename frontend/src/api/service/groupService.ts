// import axiosClient from "../axiosClient";
import axiosClient from "../axiosClient";
import { CreateGroupResponse, EditGroupResponse, Group, GroupResponse, UserGroup } from "../type";
const mockGroups = [
  { id: "ABC1", email: "truongkinhquinh", password: "bmchien1", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC2", email: "tolaokien", password: "bmchien2", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC3", email: "truongkinhquinh", password: "bmchien3", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC4", email: "tolaokien", password: "bmchien4", created: "2025-02-21T16:51:11.872Z" },
  { id: "ABC5", email: "tolaokien", password: "bmchien5", created: "2025-02-21T16:51:11.872Z" },
];

const groupService = {
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await axiosClient.get("/groups");
      // console.log(response.data);
      return response.data;
  } catch (error) {
      throw error;
  }
  },

  createGroup: async (newGroup: Group): Promise<Group> => {
    try {
      const response = await axiosClient.post("/groups", newGroup);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editGroup: async (updatedGroup: Group): Promise<Group> => {
    try {
      const response = await axiosClient.put(`/groups/${updatedGroup.id}`, updatedGroup);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteGroup: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/groups/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleGroups: async (ids: string[]): Promise<{ success: boolean }> => {
    try {
      await Promise.all(ids.map((id) => axiosClient.delete(`/groups/${id}`)));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  getAllGroupUser: async():Promise<UserGroup[]>=>{
    try{
      const response=await axiosClient.get("/user-groups");
      return response.data;
    }
    catch(error){
      throw error;
    }
  },
  
  addGroupUser: async(newGroupUser:UserGroup):Promise<UserGroup>=>{
    try{
      const response=await axiosClient.post("/user-groups",newGroupUser);
      return response.data;
    }
    catch(error){
      throw error;
    }
  },
  deleteGroupUser: async ({
    idUserDelete,
    idGroupDelete,
  }: {
    idUserDelete: string;
    idGroupDelete: string;
  }): Promise<UserGroup> => {
    try {
      const response = await axiosClient.delete(`/user-groups/user/${idUserDelete}/group/${idGroupDelete}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  

  editGroupUser: async(updatedGroupUser:UserGroup):Promise<UserGroup>=>{
    try{
      const response=await axiosClient.put("/user-groups", updatedGroupUser);
      return response.data;
    }
    catch(error){
      throw error;
    }
  }
};

export default groupService;