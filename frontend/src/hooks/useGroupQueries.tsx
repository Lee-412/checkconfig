  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import groupService from "../api/service/groupService";
  import {
    Group,
    GroupResponse,
    CreateGroupResponse,
    EditGroupResponse,
    UserGroup,
  } from "../api/type";
  import useMutationAction from "../provider/queryGlobal";

  export const useGetGroups = () => {
    return useQuery<Group[]>({
      queryKey: ["groups"],
      queryFn: groupService.getAllGroups,
    });
  };

  export const useGetUserGroups = () => {
    return useQuery<UserGroup[]>({
      queryKey: ["groups"],
      queryFn: groupService.getAllGroupUser,
    });
  };

  export const useCreateUserGroups = () => {
    return useMutationAction<UserGroup, UserGroup>(
      ["groups"],
      groupService.addGroupUser
    );
  };

  export const useEditUserGroups = () => {
    return useMutationAction<UserGroup, UserGroup>(
      ["groups"],
      groupService.editGroupUser
    );
  };

  export const useCreateGroups = () => {
    return useMutationAction<Group, Group>(["groups"], groupService.createGroup);
  };

  export const useRefreshGroups = () => {
    const queryClient = useQueryClient();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    };

    return { refresh };
  };

  export const useEditGroups = () => {
    return useMutationAction<Group, Group>(
      ["groups"],
      groupService.editGroup,
      {}
    );
  };

  export const useDeleteGroups = () => {
    return useMutationAction<{ success: boolean }, string>(
      ["groups"],
      groupService.deleteGroup,
      {}
    );
  };

  export const useDeleteUserInGroups = () => {
    return useMutationAction<UserGroup, { idUserDelete: string; idGroupDelete: string }>(
      ["groups"],
      groupService.deleteGroupUser
    );
    
  };
  

  export const useDeleteMultipleGroups = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean }, Error, string[]>({
      mutationFn: groupService.deleteMultipleGroups,
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };
