import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";

export const SendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (formData: any) => {
      const response = await instance.post(`/message/send`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetMessageClient"]
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    }
  });
  return { mutate, ...rest };
};
