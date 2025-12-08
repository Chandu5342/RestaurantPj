import { Button } from "@/components/ui/button";
import { X, Leaf, Drumstick, Star, Flame, TrendingUp, Sparkles, Clock, Tag } from "lucide-react";

export const FilterPanel = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  const toggleFilter = (key, value) => {
    if (key === "spicyLevel" || key === "priceSort") {
      onFilterChange({ ...filters, [key]: value });
    } else {
      onFilterChange({ ...filters, [key]: !filters[key] });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      vegOnly: false,
      nonVegOnly: false,
      recommended: false,
      popular: false,
      todaySpecial: false,
      newArrivals: false,
      hasOffer: false,
      availableOnly: false,
      spicyLevel: null,
      priceSort: null,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9990]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          fixed left-0 right-0 bottom-0 
          h-[80vh] w-full 
          rounded-t-2xl 
          bg-white 
          z-[9999] 
          shadow-xl 
          overflow-y-auto
          animate-slide-in-up
          px-4 py-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dietary */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Dietary
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => toggleFilter("vegOnly")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${
                filters.vegOnly
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Leaf className="w-4 h-4" />
              Veg Only
            </button>

            <button
              onClick={() => toggleFilter("nonVegOnly")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${
                filters.nonVegOnly
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Drumstick className="w-4 h-4" />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Popular */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Popular
          </h3>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "recommended", label: "Recommended", icon: Star },
              { key: "popular", label: "Most Popular", icon: TrendingUp },
              { key: "todaySpecial", label: "Today's Special", icon: Clock },
              { key: "newArrivals", label: "New Arrivals", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${
                  filters[key]
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Offers
          </h3>

          <button
            onClick={() => toggleFilter("hasOffer")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${
              filters.hasOffer
                ? "bg-purple-100 border-purple-500 text-purple-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <Tag className="w-4 h-4" />
            Show Offers Only
          </button>
        </div>

        {/* Spicy Level */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Spicy Level
          </h3>

          <div className="flex gap-2">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() =>
                  toggleFilter("spicyLevel", filters.spicyLevel === level ? null : level)
                }
                className={`flex items-center gap-1 px-3 py-2 rounded-full border text-sm ${
                  filters.spicyLevel === level
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {Array.from({ length: level }).map((_, i) => (
                  <Flame key={i} className="w-4 h-4" />
                ))}
              </button>
            ))}
          </div>
        </div>

        {/* Price Sort */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Sort by Price
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() =>
                toggleFilter("priceSort", filters.priceSort === "asc" ? null : "asc")
              }
              className={`px-3 py-2 rounded-full border text-sm ${
                filters.priceSort === "asc"
                  ? "bg-teal-100 border-teal-500 text-teal-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              Low → High
            </button>

            <button
              onClick={() =>
                toggleFilter("priceSort", filters.priceSort === "desc" ? null : "desc")
              }
              className={`px-3 py-2 rounded-full border text-sm ${
                filters.priceSort === "desc"
                  ? "bg-teal-100 border-teal-500 text-teal-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              High → Low
            </button>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wide">
            Availability
          </h3>

          <button
            onClick={() => toggleFilter("availableOnly")}
            className={`px-3 py-2 rounded-full border text-sm ${
              filters.availableOnly
                ? "bg-green-100 border-green-500 text-green-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            Available Now
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={clearFilters}>
            Clear All
          </Button>
          <Button variant="default" className="flex-1" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};
