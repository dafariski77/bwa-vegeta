import BaseResponse from "@/types/response";
import { Product } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

interface ProductResponse extends BaseResponse {
  data: {
    total: number;
    data: Product[];
  };
}

interface ProductDetailResponse extends BaseResponse {
  data: Product;
}

interface ProductApiParams {
  page?: string | undefined;
  category?: string | undefined;
  min_price?: string | undefined;
  max_price?: string | undefined;
  rating?: string | undefined;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/product",
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductResponse, ProductApiParams>({
      query: (params) => ({
        url: "/",
        params: {
          page: params.page || undefined,
          category: params.category || undefined,
          min_price: params.min_price || undefined,
          max_price: params.max_price || undefined,
          rating: params.rating || undefined,
        },
      }),
    }),
    getOneProduct: builder.query<ProductDetailResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
    }),
  }),
});
