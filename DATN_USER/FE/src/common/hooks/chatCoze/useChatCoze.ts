import { useQuery } from "@tanstack/react-query";
import { GetMessageByChatCoze } from "../../../_lib/chatCoze/chatCoze";

export const useGetMessageById = (userId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["GetMessage", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      return await GetMessageByChatCoze(userId);
    }
  });
  return { data, ...rest };
};
