import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  add_cart,
  dow_quantity,
  handle_checked_products,
  remove_multiple_products,
  remove_quantity,
  up_quantity,
  updateQuantity
} from "../../../_lib/Cart/Cart";
// import { toast } from "react-toastify";
type Actions =
  | "ADD"
  | "UP"
  | "UPDATEQUANTITY"
  | "DOW"
  | "REMOVE"
  | "REMOVE_MULTIPLE"
  | "HANLDE_STATUS_CHECKED";

export function Mutation_Cart(action: Actions) {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (data: any) => {
      switch (action) {
        case "ADD":
          // toast.success("Thêm vào giỏ hàng thành công!", { autoClose: 300 });
          return await add_cart(data);
        case "UP":
          return await up_quantity(data);
        case "UPDATEQUANTITY":
          return await updateQuantity(data);
        case "DOW":
          return await dow_quantity(data);
        case "REMOVE":
          return await remove_quantity(data);
        case "REMOVE_MULTIPLE":
          return await remove_multiple_products(data);
        case "HANLDE_STATUS_CHECKED":
          return await handle_checked_products(data);
        default:
          return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Cart_Key"]
      });
    },
    onError: () => {
      console.error("Kiem tra lai server hoac internet!");
    }
  });
  return { mutate, ...rest };
}
