import { useState } from "react";

const useCategoryFilter = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const selectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
  };

  const resetCategoryFilter = () => {
    setSelectedCategoryId(null);
  };

  return {
    selectedCategoryId,
    selectCategory,
    resetCategoryFilter,
  };
};

export default useCategoryFilter;
