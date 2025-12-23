import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Plus } from "lucide-react";
import { categories } from "@/data/menuData";

export const MenuItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price?.toString() || "",
    originalPrice: item?.originalPrice?.toString() || "",
    category: item?.category || "starters",
    isVeg: item?.isVeg ?? true,
    isRecommended: item?.isRecommended ?? false,
    isPopular: item?.isPopular ?? false,
    isNew: item?.isNew ?? false,
    isTodaySpecial: item?.isTodaySpecial ?? false,
    spicyLevel: item?.spicyLevel || 1,
    isAvailable: item?.isAvailable ?? true,
    hasOffer: item?.hasOffer ?? false,
    offerLabel: item?.offerLabel || "",
    image: item?.image || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const menuItem = {
      ...(item?.id ? { id: item.id } : {}),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      category: formData.category,
      isVeg: formData.isVeg,
      isRecommended: formData.isRecommended,
      isPopular: formData.isPopular,
      isNew: formData.isNew,
      isTodaySpecial: formData.isTodaySpecial,
      spicyLevel: formData.spicyLevel,
      isAvailable: formData.isAvailable,
      hasOffer: formData.hasOffer,
      offerLabel: formData.hasOffer ? formData.offerLabel : undefined,
      image: formData.image || "/placeholder.svg",
    };

    onSave(menuItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elevated">
        <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {item ? "Edit Item" : "Add New Item"}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Item Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field min-h-[80px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input-field"
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spicy Level</label>
              <select
                value={formData.spicyLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    spicyLevel: parseInt(e.target.value),
                  })
                }
                className="input-field"
              >
                <option value={1}>🌶️ Mild</option>
                <option value={2}>🌶️🌶️ Medium</option>
                <option value={3}>🌶️🌶️🌶️ Hot</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="input-field flex-1"
                />
                <Button type="button" variant="outline" className="shrink-0">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium">Item Properties</label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: true })}
                className={`chip ${
                  formData.isVeg ? "chip-active" : "chip-inactive"
                }`}
              >
                🥬 Veg
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: false })}
                className={`chip ${
                  !formData.isVeg
                    ? "bg-destructive text-destructive-foreground"
                    : "chip-inactive"
                }`}
              >
                🍖 Non-Veg
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isAvailable: !formData.isAvailable,
                  })
                }
                className={`chip ${
                  formData.isAvailable
                    ? "bg-success text-success-foreground"
                    : "chip-inactive"
                }`}
              >
                {formData.isAvailable ? "✓ Available" : "Unavailable"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isRecommended: !formData.isRecommended,
                  })
                }
                className={`chip ${
                  formData.isRecommended ? "chip-active" : "chip-inactive"
                }`}
              >
                ⭐ Recommended
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isPopular: !formData.isPopular })
                }
                className={`chip ${
                  formData.isPopular ? "chip-active" : "chip-inactive"
                }`}
              >
                🔥 Popular
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isNew: !formData.isNew })
                }
                className={`chip ${
                  formData.isNew ? "chip-active" : "chip-inactive"
                }`}
              >
                ✨ New
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isTodaySpecial: !formData.isTodaySpecial,
                  })
                }
                className={`chip ${
                  formData.isTodaySpecial ? "chip-active" : "chip-inactive"
                }`}
              >
                📅 Today's Special
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, hasOffer: !formData.hasOffer })
                }
                className={`chip ${
                  formData.hasOffer
                    ? "gradient-offer text-white"
                    : "chip-inactive"
                }`}
              >
                🏷️ Has Offer
              </button>

              {formData.hasOffer && (
                <input
                  type="text"
                  value={formData.offerLabel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offerLabel: e.target.value,
                    })
                  }
                  className="input-field flex-1 min-w-[150px]"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>

            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {item ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
