import { useQuery } from "@tanstack/react-query";
import { GetBlogsByName } from "../../../_lib/Blogs/blog";

export const useSearchBlogByName = (searchName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_blog", searchName],
    queryFn: () => GetBlogsByName(searchName),
    enabled: !!searchName
  });
  return { data, ...rest };
};
