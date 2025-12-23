// src/components/superadmin/PlanModal.jsx
import { Button } from "@/components/ui/button";

const PlanModal = ({
    open,
    onClose,
    editingPlan,
    planForm,
    setPlanForm,
    savePlan
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-xl">Edit Plan: {editingPlan?.name}</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Plan Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                value={planForm.name}
                                onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Price (per month)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="₹999"
                                value={planForm.price}
                                onChange={(e) => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Features (comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                                placeholder="Feature 1, Feature 2, Feature 3"
                                value={planForm.features}
                                onChange={(e) => setPlanForm(prev => ({ ...prev, features: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                                onClick={savePlan}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;