import { useConnectionStore } from "../../utils/connectionStore";
import { setConnectionString } from "../../utils/dbConnectionStore";
import axiosClient from "../axiosClient";
import { DbConfig, DbPreviewRequest, TableConfig, RegisterData, RegisterResponse, SigninData, SignInResponse } from "../type";

  const signinService = {
    login: async (data:SigninData):Promise<SignInResponse> => {
      try{
        // console.log(data);
        const response=await axiosClient.post("/auth/login",data);
        console.log(response.data);

        return response.data;
      }
      catch(error){
        throw error;
      }
    },
  
    register: async (data:RegisterData):Promise<RegisterResponse> => {
      try{
        const response=await axiosClient.post("/users",data);
        return response.data;
      }
      catch(error){
        throw error;
      }
    },

    checkConnection: async (data: DbConfig): Promise<any> =>
    {
      try{
        const response = await axiosClient.post("/previews/checkconnection",data);
        return response.data;
      }
      catch(error){
        throw error;
      }
    },

    getSchema: async (data: DbConfig): Promise<any>=>
      {
        try{
          const response = await axiosClient.post("/previews/viewschema",data);
          console.log(response.data);
    
          setConnectionString(response.data.connectionString);
          return response.data;
        }
        catch(error){
          console.log("vailonconchon get Schema");
          
          throw error;
        }
      },

    previewData: async (data: DbPreviewRequest ): Promise<any>=>
    {
      try{
        // console.log(data);
        const response = await axiosClient.post("/previews/preview-data",data);
        return response.data;
      }
      catch(error){
        throw error;
      }
    },

    submitConfig: async (data: DbConfig ): Promise<any>=>
      {
        try{
          console.log(data);
          const response = await axiosClient.post("/admins/config",data);
          return response.data.data;
        }
        catch(error){
          throw error;
        }
      },

      getConfig: async (): Promise<DbConfig[]>=>
        {
          try{
            // console.log(data);
            const response = await axiosClient.get("/admins/config");
            return response.data.data;
          }
          catch(error){
            throw error;
          }
        },



      submitTableConfig: async (data: TableConfig ): Promise<any>=>
        {
          try{
            console.log(data);
            const response = await axiosClient.post("/auth-table-configs",data);
            return response.data;
          }
          catch(error){
            throw error;
          }
        },

      getTableConfig: async (): Promise<TableConfig[]>=>
        {
          try{
            const response = await axiosClient.get("/auth-table-configs");
            return response.data;
          }
          catch(error){
            throw error;
          }
        },

  
    // resendKey: async (email: string) => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       const user = mockUsers.find((user) => user.username === username);
    //       if (user) {
    //         resolve({ success: true, message: "Verification key resent successfully" });
    //       } else {
    //         resolve({ success: false, message: "Email not found" });
    //       }
    //     }, 500);
    //   });
    // },
  };
  
  export default signinService;