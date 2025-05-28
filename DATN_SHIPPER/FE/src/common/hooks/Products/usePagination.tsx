import { useState, useEffect } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePagination({
  initialPage = 1,
  // initialLimit = 20,
  totalItems,
  itemsPerPage
}: UsePaginationProps): Pagination {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Đảm bảo trang hiện tại nằm trong phạm vi hợp lệ
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Chuyển đến trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Chuyển về trang trước đó
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    setPage: setCurrentPage,
    nextPage,
    prevPage
  };
}
