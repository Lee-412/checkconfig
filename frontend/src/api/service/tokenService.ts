import axiosClient from "../axiosClient";
import { CreateTokenResponse, EditTokenResponse, Token, TokenResponse } from "../type";
const mockTokens = [
  {
    id: "ABC1",
    name: "truongkinhquinh",
    expired: 1000,
    body: "Sample body 1",
    encrypt: "tken1",
  },
  {
    id: "ABC2",
    name: "tolaokien",
    expired: 3000,
    body: "Sample body 2",
    encrypt: "tken2",
  },
];

const tokenService = {
  getAllTokens: async (): Promise<Token[]> => {
    try{
      const response = await axiosClient.get("/tokens");
      return response.data;
    }
    catch(error){
      throw error;
    }
  },

  createToken: async (newToken: Token): Promise<Token> => {
    try{
      const response=await axiosClient.post("/tokens",newToken);
      return response.data;
    }catch(error)
    {
      throw error;
    }
  },

  editToken: async (updatedToken: Token): Promise<Token> => {
    try{
      const response=await axiosClient.put(`/tokens/${updatedToken.id}`,updatedToken);
      return response.data;
    }
    catch(error)
    {
      throw error;
    }
  },

  deleteToken: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.delete(`/tokens/${id}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  deleteMultipleTokens: async (ids: string[]): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach((id) => {
          const index = mockTokens.findIndex((token) => token.id === id);
          if (index !== -1) {
            mockTokens.splice(index, 1);
          }
        });
        resolve({ success: true });
      }, 500);
    });
  },

};

export default tokenService;
