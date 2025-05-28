import { useQuery } from "@tanstack/react-query";
import { getAll, getById } from "../../../services/category";
import { getCategoryByName } from "../../../_lib/Category/category";
export const useCategoryQuery = (id?: string) => {
  const queryKey = id ? ["CATEGORY_KEY", id] : ["CATEGORY_KEY"];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      return id ? await getById(id) : await getAll();
    }
  });
  return { data, ...rest };
};

export const useSearchCategoryByName = (searchName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_Category", searchName],
    queryFn: () => getCategoryByName(searchName),
    enabled: !!searchName
  });
  return { data, ...rest };
};
