import ProductForm from "./ProductForm";
import { getProductBySlugRaw } from "@/lib/contentful";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product = null;
  if (params.slug !== 'new') {
    product = await getProductBySlugRaw(params.slug);
  }

  return (
    <div>
      <ProductForm product={product} />
    </div>
  );
}