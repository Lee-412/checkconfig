import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import routeService from "../api/service/routeService";
import {
  Route,
  RouteResponse,
  CreateRouteResponse,
  EditRouteResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetRoutes = () => {
  return useQuery<Route[]>({
    queryKey: ["routes"],
    queryFn: routeService.getAllRoutes,
  });
};

export const useCreateRoute = () => {
  return useMutationAction<Route, Route>(
    ["routes"],
    routeService.createRoute,
    {}
  );
};

export const useEditRoute = () => {
  return useMutationAction<Route, Route>(
    ["routes"],
    routeService.editRoute,
    {}
  );
};

export const useDeleteRoute = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["routes"],
    routeService.deleteRoute,
    {}
  );
};

export const useDeleteMultipleRoute = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: routeService.deleteMultipleRoutes,
    onSettled: () => {
      // Invalidate query để làm mới dữ liệu sau khi mutation (thành công hoặc thất bại)
      queryClient.invalidateQueries({
        queryKey: ["routes"],
      });
    },
  });
};
