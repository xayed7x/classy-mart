import ProductForm from "./ProductForm";
import { getProductBySlugRaw } from "@/lib/contentful";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Defense in Depth: Verify user is authenticated (SECURE METHOD)
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Defense in Depth: Verify user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

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