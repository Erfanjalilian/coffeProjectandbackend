export function ArticlesSkeleton() {
    return (
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16 border-2 border-blue-200/80">
            <div className="mb-8">
              <div className="h-8 bg-blue-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-blue-100 rounded w-48 animate-pulse"></div>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-100/80">
                  <div className="h-32 bg-blue-200 rounded-xl mb-4 animate-pulse"></div>
                  <div className="h-6 bg-blue-100 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-blue-100 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-blue-100 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-blue-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-blue-100 rounded w-10 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }