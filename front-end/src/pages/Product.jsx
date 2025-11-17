import ProductSection from "../components/sections/ProductSection"; // ← вот правильное имя!

function Product() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <ProductSection />
      </main>
    </div>
  );
}

export default Product;