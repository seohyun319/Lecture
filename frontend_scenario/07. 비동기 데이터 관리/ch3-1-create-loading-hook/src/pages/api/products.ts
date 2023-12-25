// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Product } from "@/types/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  const products: Product[] = [
    {
      id: 1,
      name: "과자",
      originalPrice: 1300,
      description: "달콤한 초코과자",
    },
    { id: 1, name: "생수", originalPrice: 1000, description: "시원해요" },
    {
      id: 1,
      name: "초콜릿",
      originalPrice: 1500,
      description: "달콤한 벨기에 초콜릿",
    },
    {
      id: 1,
      name: "아이스크림",
      originalPrice: 2000,
      description: "아이스크림은 맛있어",
    },
  ];
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 2000);
  });
  res.status(200).json(products);
}
