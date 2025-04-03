import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import roleService from "../api/service/roleService";
import {
  Role,
  RoleResponse,
  CreateRoleResponse,
  EditRoleResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: roleService.getAllRoles,
  });
};

export const useCreateRoles = () => {
  return useMutationAction<Role, Role>(["roles"], roleService.createRole);
};

export const useRefreshRoles = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  };

  return { refresh };
};

export const useEditRoles = () => {
  return useMutationAction<Role, Role>(["roles"], roleService.editRole, {});
};

export const useDeleteRoles = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["roles"],
    roleService.deleteRole,
    {}
  );
};

export const useDeleteMultipleRoles = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: roleService.deleteMultipleRoles,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
