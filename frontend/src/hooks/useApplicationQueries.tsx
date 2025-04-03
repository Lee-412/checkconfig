import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import applicationService from "../api/service/applicationService";
import {
  Application,
  ApplicationResponse,
  CreateApplicationResponse,
  EditApplicationResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetApplications = () => {
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: applicationService.getAllApplications,
  });
};

export const useCreateApplications = () => {
  return useMutationAction<Application, Application>(
    ["applications"],
    applicationService.createApplication
  );
};

export const useRefreshApplications = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
  };

  return { refresh };
};
export const useEditApplications = () => {
  return useMutationAction<Application, Application>(
    ["applications"],
    applicationService.editApplication,
    {}
  );
};
export const useDeleteApplications = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["applications"],
    applicationService.deleteApplication,
    {}
  );
};

export const useDeleteMultipleToken = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: applicationService.deleteMultipleApplications,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// export const useDeleteApplications = () => {
//     const queryClient = useQueryClient();
//     return useMutation<{ success: boolean }, Error, string>({
//         mutationFn: applicationService.deleteApplication,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["applications"] });
//         },
//     });
// };
