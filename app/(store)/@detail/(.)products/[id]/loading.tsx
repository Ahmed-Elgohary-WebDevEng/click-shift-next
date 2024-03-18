import CircularLoading from "@/assets/icons/circular-loading";

const ProductDetailModalLoading = () => (
  <div className="fixed w-screen h-screen bg-dark bg-opacity-40 z-10 inset-0 flex items-center justify-center">
    <div className="p-20 rounded-2xl bg-white dark:bg-dark dark:bg-opacity-30 bg-opacity-80 backdrop-blur-lg">
      <CircularLoading />
    </div>
  </div>
);

export default ProductDetailModalLoading;
