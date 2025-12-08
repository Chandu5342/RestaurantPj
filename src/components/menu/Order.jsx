// src/App.jsx
function Order() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-[2.5rem] md:rounded-3xl shadow-lg border border-neutral-200">
        {/* Top bar */}
        <div className="h-10 flex items-center justify-between px-4 pt-3 text-xs text-neutral-500">
          <span>9:41</span>
          <span className="w-8 h-2 bg-neutral-300 rounded-full" />
        </div>

        {/* Main content */}
        <div className="px-6 pb-8 pt-4 flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="w-5 h-2 border-b-2 border-l-2 border-white rotate-[-45deg] translate-y-0.5" />
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-neutral-800">
            Order Placed!
          </h1>
          <p className="text-sm md:text-base text-neutral-500 mt-1">
            Order #ORD-2847
          </p>

          {/* Card with timeline */}
          <div className="w-full bg-white shadow-sm rounded-2xl border border-neutral-100 mt-6 p-4">
            <div className="flex items-center justify-between text-xs md:text-sm text-neutral-500 mb-3">
              <span>Estimated Time</span>
              <span className="font-semibold text-neutral-800">15–20 min</span>
            </div>

            {/* Timeline bar */}
            <div className="flex items-center justify-between text-[11px] md:text-xs text-neutral-400">
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-orange-400 mb-1" />
                <span className="text-orange-500 font-medium">Confirmed</span>
              </div>
              <div className="flex-1 px-2">
                <div className="h-1.5 rounded-full bg-neutral-200 mb-1" />
                <span>Preparing</span>
              </div>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-neutral-200 mb-1" />
                <span>Ready</span>
              </div>
            </div>
          </div>

          {/* Dine-in pill */}
          <div className="mt-5 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs md:text-sm font-medium">
            <span>🍽️ Dine‑in</span>
            <span className="text-emerald-500/70">· Table 5</span>
          </div>

          {/* Button */}
          <button className="mt-6 w-full py-3 md:py-3.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm md:text-base font-semibold shadow-md hover:from-orange-500 hover:to-orange-600 transition">
            Order More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;
