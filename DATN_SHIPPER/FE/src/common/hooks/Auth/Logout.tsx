import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("user");
    },
    onSuccess: () => {
      toast.success("Đăng xuất thành công!", { autoClose: 500 });
      navigate("/");
    },
  });

  return { mutate };
};
export default Logout;
