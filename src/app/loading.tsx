export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Skeleton Header */}
      <div className="h-10 w-64 bg-slate-100 rounded-xl animate-pulse mb-4" />
      <div className="h-4 w-40 bg-slate-100 rounded-lg mb-12 animate-pulse" />
      
      {/* Skeleton Form Area */}
      <div className="h-64 w-full bg-slate-50 border border-slate-100 rounded-2xl mb-12 animate-pulse" />

      {/* Skeleton Task Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 animate-pulse mt-1" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}