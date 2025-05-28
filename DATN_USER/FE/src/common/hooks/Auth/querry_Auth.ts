/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNewUserIn7Day,
  getUserByUsername,
  list_Auth,
  list_Auth_By_Id,
  set_default_address
} from "../../../_lib/Auth/Auth";

export const List_Auth = (userId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: userId ? ["AUTH_KEY", userId] : ["AUTH_KEY"],
    queryFn: async () => {
      return userId ? await list_Auth_By_Id(userId) : await list_Auth();
    }
  });
  return { data, ...rest };
};

type Action = "EDIT_DEFAULT_ADDRESS";
export function Mutation_address(action: Action) {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (dataClient) => {
      switch (action) {
        case "EDIT_DEFAULT_ADDRESS":
          return await set_default_address(dataClient);
        default:
          return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY"]
      });
    },
    onError: (error) => {
      return error;
    }
  });
  return { mutate, ...rest };
}
export const useSearchUserByUsername = (searchName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_User", searchName],
    queryFn: () => getUserByUsername(searchName),
    enabled: !!searchName
  });
  return { data, ...rest };
};
export const useGetNewUserIn7Day = () => {
  const { data, error, isError, ...rest } = useQuery({
    queryKey: ["NewUserIn7Day"],
    queryFn: async () => {
      try {
        const response = await getNewUserIn7Day();
        return response;
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, error, isError, ...rest };
};
