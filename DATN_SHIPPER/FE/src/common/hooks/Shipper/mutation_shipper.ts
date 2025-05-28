import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useLocalStorage from "../Storage/useStorage";
import { addShipperOrder } from "../../../_lib/Shipper/shipper";

type Actions = "ADD";

export const Mutation_Shipper = (action: Actions) => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  // const [, setUser] = useLocalStorage("user", {});

  const { mutate, ...rest } = useMutation({
    mutationFn: async ({
      orderId,
      shipperId
    }: {
      orderId: string;
      shipperId: string;
    }) => {
      switch (action) {
        case "ADD":
          return await addShipperOrder(orderId, shipperId);

        default:
          return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["List_orders"]
      });
    },
    onError: (error) => {
      console.log("Error occurred:", error);
    }
  });

  return { mutate, ...rest };
};
