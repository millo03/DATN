import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { createCategories, remove, update } from "../../../services/category";
import { ICategory } from "../../interfaces/Category";
import { toast } from "react-toastify";
import { useState } from "react";

type useCategoryMutationProps = {
  action: "CREATE" | "DELETE" | "UPDATE";
  onSuccess?: () => void;
};

const useCategoryMutation = ({
  action,
  onSuccess,
}: useCategoryMutationProps) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (category: ICategory) => {
      switch (action) {
        case "CREATE":
          return await createCategories(category);
        case "DELETE":
          return await remove(category);
        case "UPDATE":
          return await update(category);
        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: (data) => {
      if (data) {
        // Callback onSuccess từ props
        onSuccess && onSuccess();

        // Invalidate các query để làm mới dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["CATEGORY_KEY"],
        });
      }
    },
    onError: (error: any) => {
      toast.error(` ${error?.message || "Vui lòng thử lại sau."}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
  });

  const onSubmit: SubmitHandler<ICategory> = async (category) => {
    mutate(category);
  };

  return { mutate, onSubmit, ...rest };
};

export default useCategoryMutation;
