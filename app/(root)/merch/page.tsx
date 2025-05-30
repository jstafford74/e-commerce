import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";

const latestProducts = await getLatestProducts();
const featuredProducts = await getFeaturedProducts();

export default function MerchPage() {
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList
        data={latestProducts}
        title="HORSESHOE HATS HAVE ARRIVED"
        limit={8}
      />
      <ViewAllProductsButton />
      {/* <DealCountdown /> */}
      <IconBoxes />
    </>
  );
}
