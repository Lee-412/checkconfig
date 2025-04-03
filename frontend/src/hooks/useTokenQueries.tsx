import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tokenService from "../api/service/tokenService";
import { Token } from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetTokens = () => {
  return useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: tokenService.getAllTokens,
  });
};

export const useCreateToken = () => {
  return useMutationAction<Token, Token>(
    ["tokens"],
    tokenService.createToken,
    {}
  );
};

export const useEditToken = () => {
  return useMutationAction<Token, Token>(
    ["tokens"],
    tokenService.editToken,
    {}
  );
};

export const useDeleteToken = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["tokens"],
    tokenService.deleteToken,
    {}
  );
};

export const useDeleteMultipleToken = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: tokenService.deleteMultipleTokens,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tokens"],
      });
    },
  });
};
