export default function OrdersLoading() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
