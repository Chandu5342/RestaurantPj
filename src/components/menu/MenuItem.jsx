import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Flame, Star, Trash2 } from "lucide-react";

export const MenuItem = ({ item, onAddToCart, onUpdateQty, onRemove }) => {
  const [qty, setQty] = useState(0);

  const handleAdd = () => {
    const newQty = 1;
    setQty(newQty);
    onAddToCart?.(item, newQty);
  };

  const handleInc = () => {
    const newQty = qty + 1;
    setQty(newQty);
    onUpdateQty?.(item, newQty);
  };

  const handleDec = () => {
    const newQty = qty - 1;
    if (newQty <= 0) {
      setQty(0);
      onRemove?.(item);
    } else {
      setQty(newQty);
      onUpdateQty?.(item, newQty);
    }
  };

  return (
    <div
      className={`card-elevated overflow-hidden ${
        !item.isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {item.hasOffer && <Badge variant="offer">{item.offerLabel}</Badge>}
          {item.isNew && <Badge variant="gold">New</Badge>}
          {item.isTodaySpecial && !item.hasOffer && (
            <Badge variant="warning">Today&apos;s Special</Badge>
          )}
        </div>

        {/* Veg/Non-veg indicator */}
        <div className="absolute top-3 right-3">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              item.isVeg
                ? "border-green-600 bg-white"
                : "border-red-600 bg-white"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </div>
        </div>

        {/* Out of stock overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {item.name}
          </h3>
          {item.isRecommended && (
            <Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" />
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Spicy level */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: item.spicyLevel }).map((_, i) => (
            <Flame
              key={`hot-${i}`}
              className="w-3 h-3 text-orange-500 fill-orange-500"
            />
          ))}
          {Array.from({ length: 3 - item.spicyLevel }).map((_, i) => (
            <Flame key={`mild-${i}`} className="w-3 h-3 text-muted" />
          ))}
        </div>

        {/* Price & Add / Qty controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {qty === 0 ? (
            <Button
              size="sm"
              variant="default"
              onClick={handleAdd}
              disabled={!item.isAvailable}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="inline-flex items-center bg-muted rounded-full px-2 py-1">
              <button
                onClick={handleDec}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-border bg-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="mx-3 min-w-[1.5rem] text-center text-sm font-medium">
                {qty}
              </span>
              <button
                onClick={handleInc}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-border bg-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
