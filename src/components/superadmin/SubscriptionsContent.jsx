// src/components/superadmin/SubscriptionsContent.jsx
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit } from "lucide-react";
import PlanCard from "./PlanCard";

const SubscriptionsContent = ({ plans, openPlanModal }) => {
    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Subscription Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <PlanCard key={index} plan={plan} onEdit={() => openPlanModal(plan)} />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsContent;