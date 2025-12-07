import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Leaf, Drumstick, Star, Flame, TrendingUp, Sparkles, Clock, Tag } from "lucide-react";

export const FilterPanel = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  const toggleFilter = (key, value) => {
    if (key === "spicyLevel" || key === "priceSort") {
      onFilterChange({ ...filters, [key]: value });
    } else {
      onFilterChange({ 
        ...filters, 
        [key]: !filters[key] 
      });
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
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card z-50 shadow-elevated animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Filters</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dietary */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Dietary</h3>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFilter("vegOnly")}
                className={`chip flex items-center gap-2 ${filters.vegOnly ? "chip-active" : "chip-inactive"}`}
              >
                <Leaf className="w-4 h-4" />
                Veg Only
              </button>
              <button
                onClick={() => toggleFilter("nonVegOnly")}
                className={`chip flex items-center gap-2 ${filters.nonVegOnly ? "chip-active" : "chip-inactive"}`}
              >
                <Drumstick className="w-4 h-4" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Popular Filters */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Popular</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleFilter("recommended")}
                className={`chip flex items-center gap-2 ${filters.recommended ? "chip-active" : "chip-inactive"}`}
              >
                <Star className="w-4 h-4" />
                Recommended
              </button>
              <button
                onClick={() => toggleFilter("popular")}
                className={`chip flex items-center gap-2 ${filters.popular ? "chip-active" : "chip-inactive"}`}
              >
                <TrendingUp className="w-4 h-4" />
                Most Popular
              </button>
              <button
                onClick={() => toggleFilter("todaySpecial")}
                className={`chip flex items-center gap-2 ${filters.todaySpecial ? "chip-active" : "chip-inactive"}`}
              >
                <Clock className="w-4 h-4" />
                Today's Special
              </button>
              <button
                onClick={() => toggleFilter("newArrivals")}
                className={`chip flex items-center gap-2 ${filters.newArrivals ? "chip-active" : "chip-inactive"}`}
              >
                <Sparkles className="w-4 h-4" />
                New Arrivals
              </button>
            </div>
          </div>

          {/* Offers */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Offers</h3>
            <button
              onClick={() => toggleFilter("hasOffer")}
              className={`chip flex items-center gap-2 ${filters.hasOffer ? "chip-active" : "chip-inactive"}`}
            >
              <Tag className="w-4 h-4" />
              Show Offers Only
            </button>
          </div>

          {/* Spicy Level */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Spicy Level</h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => toggleFilter("spicyLevel", filters.spicyLevel === level ? null : level)}
                  className={`chip flex items-center gap-1 ${filters.spicyLevel === level ? "chip-active" : "chip-inactive"}`}
                >
                  {Array.from({ length: level }).map((_, i) => (
                    <Flame key={i} className="w-4 h-4 text-orange-500" />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Price Sort */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Sort by Price</h3>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFilter("priceSort", filters.priceSort === "asc" ? null : "asc")}
                className={`chip ${filters.priceSort === "asc" ? "chip-active" : "chip-inactive"}`}
              >
                Low → High
              </button>
              <button
                onClick={() => toggleFilter("priceSort", filters.priceSort === "desc" ? null : "desc")}
                className={`chip ${filters.priceSort === "desc" ? "chip-active" : "chip-inactive"}`}
              >
                High → Low
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Availability</h3>
            <button
              onClick={() => toggleFilter("availableOnly")}
              className={`chip ${filters.availableOnly ? "chip-active" : "chip-inactive"}`}
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
      </div>
    </>
  );
};
