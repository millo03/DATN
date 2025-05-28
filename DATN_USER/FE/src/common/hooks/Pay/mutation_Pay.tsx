import { useMutation } from "@tanstack/react-query";
import { Add_Order } from "../../../services/orderProduct";
import useLocalStorage from "../Storage/useStorage";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export function Pay_Mutation() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isLoading } = useMutation({
    mutationFn: (order) => Add_Order(order),
    onSuccess: async (res) => {
      // messageApi.open({
      //     type: 'success',
      //     content: 'Bạn đã đặt hành thành công',
      // })
      if (res?.status === 201) {
        // navigate("/profile/list_order")
      }
    },
    onError: () => {
      alert("Đặt hàng thất bại");
    }
  });

  const onSubmit = async (formData: any) => {
    console.log(formData);

    mutate(formData);
  };
  return { mutate, onSubmit, userId, contextHolder, messageApi, isLoading };
}
