import { useState, useEffect, useRef, useCallback } from "react";
import instance from "../../configs/axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import debounce from "lodash/debounce";

const useSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation(); // Để theo dõi thay đổi pathname

  const searchRef = useRef(null);

  // Reset ô tìm kiếm khi chuyển trang
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !(searchRef.current as Node).contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length > 0) {
      setIsLoading(true);
      try {
        const response = await instance.get("/products/filter/product", {
          params: { _search: searchQuery },
        });
        const products = response.data.data || [];
        setSuggestions(products);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm gợi ý:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 500),
    [fetchSuggestions]
  );

  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query, debouncedFetchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      setSearchError("Vui lòng nhập từ khóa");
      return;
    }
    navigate(`/search?keyword=${trimmedQuery}`);
    setShowSuggestions(false);
    setSearchError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);
    setShowSuggestions(true);

    if (value.trim().length === 0 && value.length > 0) {
      setSearchError("Vui lòng nhập từ khóa");
    } else {
      setSearchError(null);
    }
  };

  return {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSearch,
    searchRef,
    isLoading,
    handleInputChange,
    searchError,
  };
};

export default useSearch;
