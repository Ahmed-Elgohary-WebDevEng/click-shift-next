const LooksPageLoading = () => (
  <div className="xl:container px-2 md:px-4 animate-pulse">
    <div className="h-6 w-1/5 rounded-full bg-gray-300" />
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 mt-7">
      <div className="aspect-square rounded-[25px] bg-gray-300" />
      <div className="aspect-square rounded-[25px] bg-gray-300" />
      <div className="aspect-square rounded-[25px] bg-gray-300" />
    </div>
  </div>
);

export default LooksPageLoading;
