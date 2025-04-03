// import axiosClient from "../axiosClient";
import { CreateMessageResponse, EditMessageResponse, Message, MessageResponse } from "../type";
const mockMessages = [
  { id: "ABC1", name: "truongkinhquinh", type: "401", created: "2025-02-21T16:51:11.872Z" ,body: "---"},
  { id: "ABC2", name: "tolaokien", type: "402", created: "2025-02-21T16:51:11.872Z",body: "---" },
  { id: "ABC3", name: "truongkinhquinh", type: "403", created: "2025-02-21T16:51:11.872Z",body: "---" },
  { id: "ABC4", name: "tolaokien", type: "404", created: "2025-02-21T16:51:11.872Z",body: "---" },
  { id: "ABC5", name: "tolaokien", type: "405", created: "2025-02-21T16:51:11.872Z",body: "---" },
];

const messageService = {
  getAllMessages: async (): Promise<MessageResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ contents: mockMessages, totalElements: mockMessages.length });
      }, 500);
    });
  },

  createMessage: async (newMessage: Message): Promise<CreateMessageResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockMessages.push({ ...newMessage, id: `ABC${mockMessages.length + 1}` });
        resolve({ success: true });
      }, 500);
    });
  },

  editMessage: async (updatedMessage: Message): Promise<EditMessageResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockMessages.findIndex((message) => message.id === updatedMessage.id);
        if (index !== -1) {
          mockMessages[index] = updatedMessage;
        }
        resolve({ success: true });
      }, 500);
    });
  },

  deleteMessage: async (id: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockMessages.findIndex((message) => message.id === id);
        if (index !== -1) {
          mockMessages.splice(index, 1);
        }
        resolve({ success: true });
      }, 500);
    });
  },
  deleteMultipleMessages: async (ids: string[]): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach((id) => {
          const index = mockMessages.findIndex((message) => message.id === id);
          if (index !== -1) {
            mockMessages.splice(index, 1);
          }
        });
        resolve({ success: true });
      }, 500);
    });
  },
};

export default messageService;