import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMutationAction from "../provider/queryGlobal";
import providerService from "../api/service/providerService";
import { ProviderType } from "../api/type";

export const useGetProviders = () => {
  return useQuery<{ contents: ProviderType[] }>({
    queryKey: ["providers"],
    queryFn: providerService.getAllProviders,
  });
};

export const useCreateProviders = () => {
  return useMutationAction<ProviderType, ProviderType>(
    ["providers"],
    providerService.createProvider
  );
};

export const useRefreshProviders = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["providers"] });
  };

  return { refresh };
};
export const useEditProviders = () => {
  return useMutationAction<ProviderType, ProviderType>(
    ["providers"],
    providerService.editProvider,
    {}
  );
};
export const useDeleteProviders = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["providers"],
    providerService.deleteProvider,
    {}
  );
};

export const useDeleteMultipleProvider = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: providerService.deleteMultipleProviders,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};
