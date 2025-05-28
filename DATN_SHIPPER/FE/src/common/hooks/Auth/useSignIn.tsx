import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Joi from "joi";
import { signInSchema } from "../../validations/auth/SignIn";
import { useState } from "react";
import { SignIn } from "../../../_lib/Auth/Auth";
const useSignIn = (userId?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [status_api, setStatus_api] = useState(false);

  const validateForm = (name: string, value: string) => {
    const fieldSchema = Joi.object({ [name]: signInSchema.extract(name) });
    const { error } = fieldSchema.validate({ [name]: value });
    if (error) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.details[0].message,
      }));
    } else {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      return await SignIn(formData);
    },
    onSuccess: (res: any) => {
      const token = res.data.token;

      localStorage.setItem("token", token);
      console.log(token);
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY", userId],
      });
      if (res.status === 200) {
        const role = res.data.user.role;
        toast.success("Đăng nhập thành công!", { autoClose: 500 });
        navigate("/infor_shipper");
        setStatus_api(false);
      } else {
        setStatus_api(true);
      }
    },
    onError: (res: AxiosError) => {
      if (res) {
        console.log(error);
        if (res.status === 404) {
          toast.error("Sai thông tin đăng nhập. Vui lòng đăng nhập lại!");
          setStatus_api(true);
        } else {
          toast.error("Đăng nhập thất bại!");
          setStatus_api(true);
        }
      } else {
        toast.error("Đã xảy ra lỗi kết nối.");
      }
    },
  });

  const onSubmit = (formData: { email: string; password: string }) => {
    mutate(formData);
  };
  return {
    onSubmit,
    formErrors,
    setFormErrors,
    validateForm,
    isPending,
    isError,
    error,
    status_api,
  };
};

export default useSignIn;
