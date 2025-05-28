import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  type: "info" | "success" | "warning" | "error";
  message: string;
  timeout: number;
  openMessage: boolean;
};

const Message = ({ type, message, timeout, openMessage = false }: Props) => {
  useEffect(() => {
    if (openMessage) {
      switch (type) {
        case "info":
          toast.info(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          break;
        case "success":
          toast.success(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          break;
        case "warning":
          toast.warning(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          break;
        case "error":
          toast.error(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          break;
        default:
          break;
      }
    }
  }, [openMessage, message, timeout, type]);

  return <ToastContainer />;
};

export default Message;
