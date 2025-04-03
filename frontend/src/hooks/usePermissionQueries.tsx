import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import permissionService from "../api/service/permissionService";
import {
  Permission,
  PermissionResponse,
  CreatePermissionResponse,
  EditPermissionResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetPermissions = () => {
  return useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: permissionService.getAllPermissions,
  });
};

export const useCreatePermissions = () => {
  return useMutationAction<Permission, Permission>(
    ["permissions"],
    permissionService.createPermission
  );
};

export const useRefreshPermissions = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["permissions"] });
  };

  return { refresh };
};

export const useEditPermissions = () => {
  return useMutationAction<Permission, Permission>(
    ["permissions"],
    permissionService.editPermission,
    {}
  );
};

export const useDeletePermissions = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["permissions"],
    permissionService.deletePermission,
    {}
  );
};

export const useDeleteMultiplePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: permissionService.deleteMultiplePermissions,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};
