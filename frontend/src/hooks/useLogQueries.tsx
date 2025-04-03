import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import logService from "../api/service/logService";
import {
  LogResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetLogs = () => {
  return useQuery<LogResponse>({
    queryKey: ["logs"],
    queryFn: logService.getAllLogs,
  });
};

export const useRefreshLogs = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  };

  return { refresh };
};
export const useDeleteLogs = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["logs"],
    logService.deleteLog,
    {}
  );
};

export const useDeleteMultipleToken = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: logService.deleteMultipleLogs,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};

// export const useDeleteLogs = () => {
//     const queryClient = useQueryClient();
//     return useMutation<{ success: boolean }, Error, string>({
//         mutationFn: logService.deleteLog,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["logs"] });
//         },
//     });
// };
