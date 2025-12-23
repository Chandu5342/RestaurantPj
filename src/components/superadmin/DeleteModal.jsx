// src/components/superadmin/DeleteModal.jsx
import { Button } from "@/components/ui/button";

const DeleteModal = ({
    open,
    onClose,
    deleteTarget,
    confirmDelete
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-xl">Confirm Delete</h2>
                </div>
                <div className="p-6">
                    <div className="py-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;