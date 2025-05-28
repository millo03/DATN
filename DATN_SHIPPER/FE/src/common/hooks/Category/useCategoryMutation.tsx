import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import Message from "../../../components/base/Message/Message";
import { createCategories, remove, update } from "../../../services/category";
import { ICategory } from "../../interfaces/Category";
import { CategoryJoiSchema } from "../../validations/category";

type useCategoryMutationProps = {
  action: "CREATE" | "DELETE" | "UPDATE";
  onSuccess?: () => void;
};

const useCategoryMutation = ({
  action,
  onSuccess,
}: useCategoryMutationProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: joiResolver(CategoryJoiSchema),
    defaultValues: {
      name: "",
    },
  });

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
          return null;
      }
    },
    onSuccess: (data) => {
      if (data) {
        onSuccess && onSuccess();
        queryClient.invalidateQueries({
          queryKey: ["CATEGORY_KEY"],
        });
      } else {
        <Message
          message={"Có lỗi xảy ra vui lòng thử lại !"}
          timeout={5000}
          openMessage={true}
          type={"error"}
        />;
        return;
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit: SubmitHandler<ICategory> = async (category) => {
    mutate(category);
    console.log(category);
  };

  return { mutate, form, onSubmit, ...rest };
};

export default useCategoryMutation;
