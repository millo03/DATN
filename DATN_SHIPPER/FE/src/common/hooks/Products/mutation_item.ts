import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  add_items_client,
  destroy_delete_Product,
  edit_items_client,
  remove_items,
  remove_multiple_products,
  restoreProduct
} from "../../../_lib/Items/Products";
import { useState } from "react";

type Action = "CREATE" | "EDIT" | "REMOVE_and_REMOVE_MULTIPLE" | 'RESTORE_ITEM_and_DESTROY_ITEM';

export function Mutation_items(action: Action) {
  const [status_api, setStatusApi] = useState('no_call');
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (data_body_client: any) => {
      switch (action) {
        case "CREATE":
          return await add_items_client(data_body_client);
        case "EDIT":
          return await edit_items_client(data_body_client);
        case "REMOVE_and_REMOVE_MULTIPLE":
          if (data_body_client.action === 'remove') {
            return await remove_items(data_body_client);
          } else {
            return await remove_multiple_products(data_body_client);
          }
        case 'RESTORE_ITEM_and_DESTROY_ITEM':
          if (data_body_client.action === 'restore') {
            return await restoreProduct(data_body_client);
          }
          else {
            return await destroy_delete_Product(data_body_client)
          }
        default:
          throw new Error("Invalid action type");
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["Product_Key"]
      });
      if(res?.status === 400) {
        setStatusApi('call_error')
      }
      else {
        setStatusApi('call_ok')
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    }
  });

  return { mutate, status_api, ...rest };
}
