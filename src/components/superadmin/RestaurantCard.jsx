// src/components/superadmin/RestaurantCard.jsx
import { Button } from "@/components/ui/button";
import { Building2, Edit, Trash2, Power } from "lucide-react";

const RestaurantCard = ({ restaurant, onEdit, onDelete, onToggleStatus, onApprove }) => {
    return (
        <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                        {restaurant.image ? (
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-7 h-7 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{restaurant.name}</p>
                        <p className="text-sm text-gray-500">{restaurant.owner} • {restaurant.plan} Plan</p>
                        <p className="text-xs text-gray-500">{restaurant.email} • {restaurant.phone}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{restaurant.orders} orders</span>
                            <span>{restaurant.revenue} revenue</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${restaurant.status === "active" ? "bg-green-100 text-green-800" :
                        restaurant.status === "trial" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                        }`}>
                        {restaurant.status}
                    </span>
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    {restaurant.status === 'pending' ? (
                        <Button variant="default" size="sm" onClick={() => onApprove && onApprove(restaurant._id || restaurant.id)}>
                            Approve
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleStatus}
                        >
                            <Power className={`w-4 h-4 ${restaurant.status === "active" ? "text-green-500" : "text-red-500"}`} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;