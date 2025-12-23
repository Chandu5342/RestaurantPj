// src/components/superadmin/SupportContent.jsx
import { Button } from "@/components/ui/button";
import { XCircle, Clock, CheckCircle } from "lucide-react";
import SupportTicket from "./SupportTicket";

const SupportContent = ({ supportTickets }) => {
    return (
        <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {["all", "open", "in-progress", "resolved"].map(status => (
                    <Button
                        key={status}
                        variant="secondary"
                        size="sm"
                        className="capitalize"
                        onClick={() => console.log(`Filter by: ${status}`)}
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {supportTickets.map(ticket => (
                <SupportTicket key={ticket.id} ticket={ticket} />
            ))}
        </div>
    );
};

export default SupportContent;