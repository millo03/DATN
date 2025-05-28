import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendMessage } from "../../../_lib/chatCoze/chatCoze";

export const ChatCozeMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async ({
      conversationId,
      content,
      user_id
    }: {
      conversationId: string;
      content: string;
      user_id: string;
    }) => {
      if (!conversationId || !content || !user_id) {
        throw new Error("All fields are required");
      }
      return await SendMessage({
        conversationId,
        content,
        user_id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetMessage"]
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    }
  });

  return { mutate, ...rest };
};
