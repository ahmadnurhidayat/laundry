export default function TrackingLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 animate-pulse">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Invoice header skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
          <div className="text-center space-y-3">
            <div className="h-6 bg-gray-200 rounded w-40 mx-auto"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Status skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Price skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
