export const SkeletonCard = () => {
  return (
    <div className="min-w-[250px] bg-gray-800 rounded-xl p-4 animate-pulse">
      <div className="h-40 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
      <div className="h-8 bg-gray-700 rounded mt-4"></div>
    </div>
  );
};