// hooks/useVoucherHandlers.ts
import { useState } from "react";
import { FormInstance } from "antd";
import { ICategory } from "../../../../common/interfaces/Category";
import { Auth } from "../../../../common/interfaces/Auth";

interface VoucherHandlersProps {
  form: FormInstance;
  products: any[];
  categories: ICategory[];
  auth: any;
}

export const useVoucherHandlers = ({
  form,
  products,
  categories,
  auth,
}: VoucherHandlersProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userType, setUserType] = useState<string[]>([]);
  const [applyType, setApplyType] = useState<string>("");
  const [limitType, setLimitType] = useState<string[]>([]);
  const [discountType, setdiscountType] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuths, setSelectedAuths] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const visibleCategories =
    categories?.filter((category) => category.published) || [];

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";
    for (let i = 0; i < 8; i++) {
      randomCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    form.setFieldsValue({ code_voucher: randomCode });
  };

  const handleSelectChange = (value: string[]) => {
    if (value.includes("all")) {
      const allUserIds = auth?.data.map((user: any) => user._id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers(value);
    }
  };

  const onApplyTypeChange = (value: string) => {
    // Reset các trường input khi áp dụng giảm giá thay đổi
    if (value !== "product") {
      setSelectAll(false);
      setSelectedItems([]);
      form.setFieldsValue({ appliedProducts: [] });
    }
    if (value !== "total") {
      form.setFieldsValue({ minimumSpend: null });
    }
    if (value !== "category") {
      setSelectAll(false);
      setSelectedCategories([]);
      form.setFieldsValue({ minimumSpend: null });
    }
    setApplyType(value);
  };

  const onLimitTypeChange = (value: string[]) => {
    setLimitType(value);
    // Reset các trường input khi checkbox bị bỏ chọn
    if (!value.includes("time")) {
      form.setFieldsValue({ startDate: null, expirationDate: null });
    }
    if (!value.includes("quantity")) {
      form.setFieldsValue({ quantity_voucher: null });
    }
  };

  const ondiscountTypeChange = (value: string) => {
    setdiscountType(value);
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };
  const handleCheckboxChangeCate = (categoryId: string) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const handleCheckboxChangeAuth = (userId: string) => {
    setSelectedAuths((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };
  const handleSelect = (value: string[]) => {
    setSelectedItems(value);
    form.setFieldsValue({ appliedProducts: value });
  };
  const handleSelectCate = (value: string[]) => {
    setSelectedCategories(value);
    form.setFieldsValue({ appliedCategories: value });
  };

  const handleSelectAuth = (value: string[]) => {
    setSelectedAuths(value);
    form.setFieldsValue({ allowedUsers: value });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allProducts = products.map((product) => product._id);
      setSelectedItems(allProducts);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectAllCate = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedCategories(visibleCategories.map((cat) => cat._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectAllAuth = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedAuths(auth?.data.map((user: Auth) => user._id));
    } else {
      setSelectedAuths([]);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name_product.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredCategorys = visibleCategories?.filter((category) =>
    category.name_category.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredAuths = auth?.data?.filter((user) =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    // States
    selectedUsers,
    selectedAuths,
    setSelectedAuths,
    userType,
    applyType,
    limitType,
    discountType,
    selectedItems,
    selectedCategories,
    setSelectedCategories,

    selectAll,
    searchText,
    setLimitType,
    setdiscountType,
    setSelectedUsers,
    setApplyType,
    setSelectedItems,

    // Handlers
    generateRandomCode,
    setSearchText,
    handleSelectChange,
    onApplyTypeChange,
    onLimitTypeChange,
    ondiscountTypeChange,
    handleCheckboxChange,
    handleCheckboxChangeCate,
    handleSelect,
    handleSelectCate,
    handleSelectAll,
    handleSelectAllCate,
    handleSelectAllAuth,
    handleSelectAuth,
    handleCheckboxChangeAuth,
    // Computed values
    filteredProducts,
    visibleCategories,
    filteredCategorys,
    filteredAuths,
  };
};
