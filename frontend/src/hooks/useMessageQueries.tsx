import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import messageService from "../api/service/messageService";
import {
  Message,
  MessageResponse,
  CreateMessageResponse,
  EditMessageResponse,
} from "../api/type";
import useMutationAction from "../provider/queryGlobal";

export const useGetMessages = () => {
  return useQuery<MessageResponse>({
    queryKey: ["messages"],
    queryFn: messageService.getAllMessages,
  });
};

export const useCreateMessages = () => {
  return useMutationAction<CreateMessageResponse, Message>(
    ["messages"],
    messageService.createMessage
  );
};

export const useRefreshMessages = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  };

  return { refresh };
};
export const useEditMessages = () => {
  return useMutationAction<EditMessageResponse, Message>(
    ["messages"],
    messageService.editMessage,
    {}
  );
};
export const useDeleteMessages = () => {
  return useMutationAction<{ success: boolean }, string>(
    ["messages"],
    messageService.deleteMessage,
    {}
  );
};

export const useDeleteMultipleToken = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string[]>({
    mutationFn: messageService.deleteMultipleMessages,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// export const useDeleteMessages = () => {
//     const queryClient = useQueryClient();
//     return useMutation<{ success: boolean }, Error, string>({
//         mutationFn: messageService.deleteMessage,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["messages"] });
//         },
//     });
// };
