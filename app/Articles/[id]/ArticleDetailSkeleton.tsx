export function ArticleDetailSkeleton() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-blue-200 rounded w-48 mb-6"></div>
  
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl p-6 mb-8">
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-blue-200 rounded-full w-16"></div>
                <div className="h-6 bg-blue-100 rounded-full w-16"></div>
              </div>
              <div className="h-8 bg-blue-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-blue-100 rounded w-full mb-2"></div>
              <div className="h-4 bg-blue-100 rounded w-2/3 mb-6"></div>
              <div className="border-t pt-4">
                <div className="flex gap-6">
                  <div className="h-4 bg-blue-100 rounded w-24"></div>
                  <div className="h-4 bg-blue-100 rounded w-24"></div>
                  <div className="h-4 bg-blue-100 rounded w-24"></div>
                </div>
              </div>
            </div>
  
            {/* Cover skeleton */}
            <div className="h-64 bg-blue-200 rounded-2xl mb-8"></div>
  
            {/* Body skeleton */}
            <div className="bg-white rounded-2xl p-8 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="h-4 bg-blue-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }