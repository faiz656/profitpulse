export function DashboardSkeleton() {
  const Shimmer = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`} />
  );

  return (
    <div className="p-6 space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <Shimmer className="h-3 w-20 mb-3" />
            <Shimmer className="h-7 w-28 mb-2" />
            <Shimmer className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      {/* Fee breakdown row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
            <Shimmer className="h-2.5 w-20 mb-2" />
            <Shimmer className="h-5 w-16" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <Shimmer className="h-4 w-40 mb-1" />
          <Shimmer className="h-3 w-32 mb-4" />
          <Shimmer className="h-48 w-full" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <Shimmer className="h-4 w-32 mb-1" />
          <Shimmer className="h-3 w-24 mb-4" />
          <Shimmer className="h-48 w-full" />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <Shimmer className="h-4 w-24 mb-4" />
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <Shimmer className="h-3.5 w-48 mb-2" />
              <Shimmer className="h-3 w-full mb-1" />
              <Shimmer className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
