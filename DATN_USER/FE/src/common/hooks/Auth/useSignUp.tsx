import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../../configs/axios";

interface SignUpFormData {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

const useSignUp = () => {
  const [status_api, setStatus_api] = useState(false);
  // const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async (formData: SignUpFormData) => {
      try {
        const response = await instance.post(`auth/signup`, formData);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (res) => {
      if (res?.status === 201) {
        toast.success("Đăng ký thành công!");
        setStatus_api(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setStatus_api(true);
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        setStatus_api(true);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        setStatus_api(true);
      }
    }
  });

  return {
    isLoading,
    isError,
    error,
    mutate,
    status_api
  };
};

export default useSignUp;
