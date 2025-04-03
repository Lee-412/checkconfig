import { useQuery } from "@tanstack/react-query";
import forwardService from "../api/service/forwardService";

export const useGetNginx = (applicationId: string) => {
  return useQuery<any>({
    queryKey: ["nginx", applicationId],
    queryFn: () => forwardService.getTemplateNginx(applicationId),
    enabled: !!applicationId, // Only run query if applicationId exists
  });
};

export const useGetAuthstreamjs = (applicationId: string) => {
  return useQuery<any>({
    queryKey: ["authstreamjs", applicationId],
    queryFn: () => forwardService.getTemplateAuthstreamjs(applicationId),
    enabled: !!applicationId, // Only run query if applicationId exists
  });
};
