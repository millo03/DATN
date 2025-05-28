// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { getContactByNameOrEmail } from "../../../_lib/Contact/Contact";
// import instance from "../../../configs/axios";

// const API_URL = "http://localhost:2004/api/v1/contact";

// // Hàm để xóa contact
// const removeContact = async (id: string) => {
//   await axios.delete(`${API_URL}/${id}`);
// };

// export const useContacts = () => {
//   const queryClient = useQueryClient();

//   // Sử dụng useQuery để lấy dữ liệu
//   const { data, isLoading, error, isError, refetch } = useQuery({
//     queryKey: ["contacts"],
//     queryFn: async () => {
//       try {
//         const res = await instance.get(`/contact`);
//         return res?.data.data;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   });

//   // Sử dụng useMutation để xóa contact
//   const mutation = useMutation({
//     mutationFn: removeContact,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["contacts"]);
//     },
//   });

//   return {
//     contacts: data || [], // Trả về dữ liệu liên hệ hoặc mảng rỗng nếu không có dữ liệu
//     isLoading,
//     isError,
//     error,
//     refetch,
//     removeContact: mutation.mutate,
//   };
// };
// export const useSearchContactByNameOrEmail = (searchContact) => {
//   const { data, ...rest } = useQuery({
//     queryKey: ["Search_Contact", searchContact],
//     queryFn: () => getContactByNameOrEmail(searchContact),
//     enabled: !!searchContact,
//   });
//   return { data, ...rest };
// };
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getContactByNameOrEmail } from "../../../_lib/Contact/Contact";
import instance from "../../../configs/axios";

const API_URL = "http://localhost:2004/api/v1/contact";

// Hàm để xóa contact
const removeContact = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Hook để lấy danh bạ
export const useContacts = () => {
  const queryClient = useQueryClient();

  // Sử dụng useQuery để lấy dữ liệu
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      try {
        const res = await instance.get("/contact");
        return res?.data.data || []; // Trả về mảng rỗng nếu không có dữ liệu
      } catch (err) {
        console.error("Error fetching contacts:", err);
        throw err; // Re-throw the error for proper handling
      }
    }
  });

  // Sử dụng useMutation để xóa contact
  const mutation = useMutation({
    mutationFn: removeContact,
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
    },
    onError: (err) => {
      console.error("Error removing contact:", err);
      // You can handle error notifications here if desired
    }
  });

  return {
    contacts: data || [],
    isLoading,
    isError,
    error,
    refetch,
    removeContact: mutation.mutate
  };
};

export const useSearchContactByNameOrEmail = (searchContact: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_Contact", searchContact],
    queryFn: () => getContactByNameOrEmail(searchContact),
    enabled: !!searchContact // Query only runs if searchContact is truthy
  });

  return { data, ...rest };
};
