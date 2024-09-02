import Response from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const take = 9;
    const query = req.nextUrl.searchParams;
    const page = query.get("page")
      ? parseInt(query.get("page") as string) - 1
      : 0;
    const skip = page * take;
    const categories = query.get("category")?.split(",") || undefined;
    const minPrice = query.get("min_price")
      ? parseInt(query.get("min_price") as string)
      : undefined;
    const maxPrice = query.get("max_price")
      ? parseInt(query.get("max_price") as string)
      : undefined;
    const rating =
      query
        .get("rating")
        ?.split(",")
        .map((val) => +val) || undefined;

    const queryFilter = {
      AND: [
        {
          category: {
            in: categories as ProductCategory[],
          },
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
          rating: {
            in: rating,
          },
        },
      ],
    };

    const totalProducts = await prisma.product.count();
    const products = await prisma.product.findMany({
      take,
      skip,
      where: queryFilter,
    });

    return Response({
      message: "Get data success",
      data: {
        total: totalProducts,
        data: products,
      },
    });
  } catch (error: any) {
    return Response({
      message: "Error",
      data: error,
      status: 500,
    });
  }
}
