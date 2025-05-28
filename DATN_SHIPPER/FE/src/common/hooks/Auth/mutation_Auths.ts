import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SignIn, SignOut, SignUp } from "../../../_lib/Auth/Auth";
import useLocalStorage from "../Storage/useStorage";

type Actions = "SIGNIN" | "SIGNUP" | "SIGNOUT";

export const Mutation_Auth = (action: Actions) => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage("user", {});

  const { mutate, ...rest } = useMutation({
    mutationFn: async (user: any) => {
      switch (action) {
        case "SIGNIN":
          return await SignIn(user);
        case "SIGNUP":
          return await SignUp(user);
        case "SIGNOUT":
          return await SignOut();
        default:
          return;
      }
    },
    onSuccess: (user: any) => {
      if (action === "SIGNIN") {
        setUser(user);
        alert("Đăng Nhập Tài Khoản Thành Công");
        navigate("/");
        window.location.reload();
      } else if (action === "SIGNUP") {
        alert("Đăng ký thành công");
        navigate("/login");
      } else if (action === "SIGNOUT") {
        setUser(null);
        localStorage.removeItem("token");
        alert("Đăng xuất thành công");
        navigate("/login");
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error(error || "Kiểm tra lại server hoặc internet!");
      alert(
        action === "SIGNIN"
          ? "Đăng nhập thất bại"
          : action === "SIGNUP"
          ? "Đăng ký thất bại"
          : "Đăng xuất thất bại"
      );
    }
  });

  return { mutate, ...rest };
};
