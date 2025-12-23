// src/components/superadmin/RestaurantModal.jsx
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

const RestaurantModal = ({
    open,
    onClose,
    editingRestaurant,
    restaurantForm,
    setRestaurantForm,
    saveRestaurant,
    plans
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-xl">
                        {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {restaurantForm.image ? (
                                        <img src={restaurantForm.image} alt="Restaurant" className="w-full h-full object-cover" />
                                    ) : (
                                        <Image className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Restaurant Image URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="https://example.com/image.jpg"
                                value={restaurantForm.image}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, image: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Restaurant Name *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="Enter restaurant name"
                                value={restaurantForm.name}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Owner Name *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="Enter owner name"
                                value={restaurantForm.owner}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, owner: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="owner@restaurant.com"
                                value={restaurantForm.email}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Phone</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="+91 98765 43210"
                                value={restaurantForm.phone}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Address</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="Full address"
                                value={restaurantForm.address}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Subscription Plan</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                value={restaurantForm.plan}
                                onChange={(e) => setRestaurantForm(prev => ({ ...prev, plan: e.target.value }))}
                            >
                                {plans.map(p => (
                                    <option key={p.id} value={p.name}>{p.name} - {p.price}/mo</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                                onClick={saveRestaurant}
                            >
                                {editingRestaurant ? "Update" : "Add"} Restaurant
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantModal;