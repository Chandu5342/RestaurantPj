import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Check,
  X
} from "lucide-react";
import { MenuItemForm } from "./MenuItemForm";

export const MenuManagement = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Extract unique categories from items
  const categories = ["all", ...new Set(items.map((i) => i.category))];

  // Filter items by search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (item) => {
    if (item.id) {
      onUpdateItem(item);
    } else {
      onAddItem(item);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handlePriceEdit = (item) => {
    setEditingPriceId(item.id);
    setEditPrice(item.price.toString());
  };

  const handlePriceSave = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newPrice = parseFloat(editPrice);
      if (!isNaN(newPrice) && newPrice > 0) {
        onUpdateItem({ ...item, price: newPrice });
      }
    }
    setEditingPriceId(null);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      onDeleteItem(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const toggleAvailability = (item) => {
    onUpdateItem({ ...item, isAvailable: !item.isAvailable });
  };

  return (
    <>
      <div className="card-elevated">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold">Menu Items</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full sm:w-48"
              />
            </div>

            {/* Category filter dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full sm:w-36"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground">Item</th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground">Type</th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-semibold block">{item.name}</span>
                        <span className="text-xs text-muted-foreground sm:hidden capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 capitalize hidden sm:table-cell">
                    {item.category}
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <Badge variant={item.isVeg ? "veg" : "nonveg"}>
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </Badge>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="input-field w-20 px-2 py-1 text-sm"
                          autoFocus
                        />

                        <button
                          onClick={() => handlePriceSave(item.id)}
                          className="p-1 hover:bg-success/20 rounded text-success"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePriceEdit(item)}
                        className="font-semibold hover:text-primary transition-colors flex items-center gap-1"
                      >
                        ₹{item.price}
                        <Pencil className="w-3 h-3 opacity-50" />
                      </button>
                    )}
                  </td>

                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <button onClick={() => toggleAvailability(item)}>
                      <Badge
                        variant={item.isAvailable ? "success" : "muted"}
                        className="cursor-pointer"
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </button>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant={deleteConfirm === item.id ? "destructive" : "outline"}
                        onClick={() => handleDelete(item.id)}
                      >
                        {deleteConfirm === item.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items found</p>
          </div>
        )}
      </div>

      {showForm && (
        <MenuItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </>
  );
};
