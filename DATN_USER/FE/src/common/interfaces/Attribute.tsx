// types.ts (or any suitable file for types)
export interface Size {
  name_size: string;
  stock_attribute: number;
  price_attribute: number;
  _id: string;
}

export interface ColorValue {
  color: string;
  size: Size[];
  _id: string;
}

export interface AttributeData {
  _id: string;
  id_item: string;
  values: ColorValue[];
}
