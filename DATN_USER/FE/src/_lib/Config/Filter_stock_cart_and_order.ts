export function filter_positive_Stock_Item(data_checked_true: any) {
    const positive_Stock_Item: any = [];
    data_checked_true?.map((value: any) => {
        if (value?.productId?.attributes?.values) {
            const check_color = value?.productId?.attributes?.values?.find((a: any) => a?.color === value?.color_item);
            const check_size = check_color?.size?.find((b: any) => (b?.name_size?.trim() ? b?.name_size : undefined) === value?.name_size);
            if (value?.size && value?.size_attribute_item === check_size?.name_size && check_size?.stock_attribute > 0) {
                positive_Stock_Item.push(value)
            }
            else {
                if (check_size?.stock_attribute > 0) {
                    positive_Stock_Item.push(value)
                }
            }
        }
        else {
            if (value?.productId?.stock > 0) {
                positive_Stock_Item.push(value)
            }
        }
    });
    return positive_Stock_Item
}