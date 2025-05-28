import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cancel_Order,
  cancel_product,
  complete_product,
  confirmCancelOrder,
  failDelivery,
  Update_Status, // Import hàm failDelivery
} from "../../../services/orderProduct";
import { message } from "antd";

type Action =
  "UPDATE"
  | "CONFIRM_CANCEL"
  | "UPDATE_ORDER"
  | "REQUEST_CANCEL_or_CANCEL_PRODUCT_or_COMPLETED_PRODUCT"
  | "FAIL_DELIVERY"; // Thêm hành động mới

export function useOrderMutations(action: Action) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isLoading, ...rest } = useMutation({
    mutationFn: async (data: {
      id_item: string | number;
      action?: string;
      cancellationReason?: string;
      failureReason?: string; // Thêm lý do thất bại
    }) => {
      // console.log(data);

      switch (action) {
        case "UPDATE":
          return await Update_Status(data?.id_item, data.cancellationReason)
        case "CONFIRM_CANCEL":
          return await confirmCancelOrder(data);
        case "REQUEST_CANCEL_or_CANCEL_PRODUCT_or_COMPLETED_PRODUCT":
          if (data?.action === "huy") {
            return await cancel_product(data.id_item, data.cancellationReason);
          }
          if (data?.action === "yeu_cau_huy") {
            return await Cancel_Order(data?.id_item, data.cancellationReason);
          }
          return await complete_product(data?.id_item);
        case "FAIL_DELIVERY":
          return await failDelivery(data.id_item, data.failureReason); // Thực hiện hành động thất bại giao hàng
        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: (data) => {
      let message = "";
      queryClient.invalidateQueries({
        queryKey: ["Order_Key"],
      });
      switch (action) {
        case "CONFIRM_CANCEL":
          message = data.data_status_order
            ? "Yêu cầu hủy đơn hàng đã được xác nhận"
            : "Lỗi không thể gửi yêu cầu hủy đơn!";
          break;
        case "REQUEST_CANCEL_or_CANCEL_PRODUCT_or_COMPLETED_PRODUCT":
          if (data?.message === "huy") {
            message = "Hủy đơn hàng thành công";
          } else if (data?.message === "yeu_cau_huy") {
            message = "Yêu cầu hủy đơn hàng thành công";
          } else {
            message = "Đã nhận hàng thành công";
          }
          break;
        case "FAIL_DELIVERY":
          message = "Giao hàng thất bại đã được ghi nhận"; // Thông điệp cho failDelivery
          break;
        default:
          break;
      }
      messageApi.open({
        type: "success",
        content: message,
      });
    },
  });
  return { mutate, ...rest, contextHolder, isLoading };
}
