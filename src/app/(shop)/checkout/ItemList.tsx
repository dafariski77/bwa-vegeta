"use client";

import React, { useState } from "react";

// components
import ProductCheckout from "@/components/product-checkout/product-checkout";
import { Product } from "@prisma/client";

interface ItemListProps {
  products: {
    id: string;
    userId: string;
    productId: string;
    qty: number;
    pricePerItem: number;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
  }[];
}

function ItemList({ products = [] }: ItemListProps) {
  return (
    <>
      <div className="text-lg font-semibold">Barang yang dibeli</div>

      {products.map((product, index) => (
        <ProductCheckout
          key={`productCheckout${index}`}
          productDetails={product.product}
          onDeleteItem={() => {
            const updatedProducts = [...products];
            updatedProducts.splice(index, 1);
          }}
          onChangeItemCount={(count) => {
            const updatedProducts = [...products];
            updatedProducts[index].qty = count;
          }}
          qty={product.qty}
        />
      ))}
    </>
  );
}

export default ItemList;
