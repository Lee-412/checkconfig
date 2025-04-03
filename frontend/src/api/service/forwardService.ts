import axiosClient from "../axiosClient.ts";

const forwardService = {
    getTemplateNginx: async (applicationId: string): Promise<any> => {
        try {
            const response = await axiosClient.get(`/template/nginx.conf`, {
                params: { applicationId }
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    getTemplateAuthstreamjs: async (applicationId: string): Promise<any> => {
        try {
            const response = await axiosClient.get(`/template/authstream.js`, {
                params: { applicationId }
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
};

export default forwardService;