export interface ICategory {
  published: unknown | boolean;
  name_category: string | any;
  image_category?: FileList | string[] | any;
  _id?: string | any;
  slug?: string;
  products?: string[];
  createdAt?: string | number;
  updatedAt?: string | number;
}
export interface ApiResponse {
  status: number;
  data?: any;
  message?: string;
}
