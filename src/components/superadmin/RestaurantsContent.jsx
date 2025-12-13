// src/components/superadmin/RestaurantsContent.jsx
import { Button } from "@/components/ui/button";
import { Search, Plus, Building2, Edit, Trash2, Power } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

const RestaurantsContent = ({
    restaurants,
    searchQuery,
    setSearchQuery,
    openRestaurantModal,
    toggleRestaurantStatus,
    deleteRestaurant
    ,
    approveRestaurant
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900"
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    onClick={() => openRestaurantModal()}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Restaurant
                </Button>
            </div>

            <div className="grid gap-4">
                {restaurants.map(r => (
                    <RestaurantCard
                        key={r.id}
                        restaurant={r}
                        onEdit={() => openRestaurantModal(r)}
                        onDelete={() => deleteRestaurant(r.id)}
                        onToggleStatus={() => toggleRestaurantStatus(r.id)}
                        onApprove={() => approveRestaurant(r._id || r.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RestaurantsContent;