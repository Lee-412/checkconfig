// import axiosClient from "../axiosClient";
import {LogResponse } from "../type";
const mockLogs = [
    { 
      id: "ABC1", 
      ip: "192.168.1.1", 
      user: "truongkinhquinh", 
      event: "LOGIN_SUCCESS", 
      created: "2025-02-21T16:51:11.872Z",
      context: { browser: "Chrome", os: "Windows" },
      rawEvent: { detail: "User logged in successfully" }
    },
    { 
      id: "ABC2", 
      ip: "192.168.1.2", 
      user: "tolaokien", 
      event: "LOGIN_FAILED", 
      created: "2025-02-21T16:52:11.872Z",
      context: { browser: "Firefox", os: "Linux" },
      rawEvent: { detail: "Incorrect password" }
    },
    { 
      id: "ABC3", 
      ip: "192.168.1.3", 
      user: "truongkinhquinh", 
      event: "FILE_UPLOAD", 
      created: "2025-02-21T16:53:11.872Z",
      context: { fileName: "report.pdf", size: "2MB" },
      rawEvent: { detail: "File uploaded to /docs" }
    },
    { 
      id: "ABC4", 
      ip: "192.168.1.4", 
      user: "tolaokien", 
      event: "LOGOUT", 
      created: "2025-02-21T16:54:11.872Z",
      context: { sessionDuration: "30m" },
      rawEvent: { detail: "User logged out successfully" }
    },
    { 
      id: "ABC5", 
      ip: "192.168.1.5", 
      user: "tolaokien", 
      event: "PASSWORD_CHANGE", 
      created: "2025-02-21T16:55:11.872Z",
      context: { method: "Self-service" },
      rawEvent: { detail: "User changed password" }
    },
  ];
  

const logService = {
  getAllLogs: async (): Promise<LogResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ contents: mockLogs, totalElements: mockLogs.length });
      }, 500);
    });
  },

  deleteLog: async (id: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockLogs.findIndex((log) => log.id === id);
        if (index !== -1) {
          mockLogs.splice(index, 1);
        }
        resolve({ success: true });
      }, 500);
    });
  },
  deleteMultipleLogs: async (ids: string[]): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach((id) => {
          const index = mockLogs.findIndex((log) => log.id === id);
          if (index !== -1) {
            mockLogs.splice(index, 1);
          }
        });
        resolve({ success: true });
      }, 500);
    });
  },
};

export default logService;