import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { api } from "@/app/lib/api";
import { Product } from "@/app/types";
import ProductCard from "./_components/product";
import AddProduct from "./_components/add-product";


export default async function Dashboard() {

  const token = (await cookies()).get('token')?.value

  if (!token) {
    redirect("/login")
  }

  const response = await api.get<{ data: Product[] }>('/products', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const products = response.data.data;

  return (
    <>
      <AddProduct />

      {products.length > 0 ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">
          Nenhum produto encontrado.
        </p>
      )}
    </>
  );
}