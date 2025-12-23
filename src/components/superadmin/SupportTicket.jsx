// src/components/superadmin/SupportTicket.jsx
import { XCircle, Clock, CheckCircle } from "lucide-react";

const SupportTicket = ({ ticket }) => {
    return (
        <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ticket.status === "open" ? "bg-red-100 text-red-600" :
                        ticket.status === "in-progress" ? "bg-yellow-100 text-yellow-600" :
                            "bg-green-100 text-green-600"
                        }`}>
                        {ticket.status === "open" ? <XCircle className="w-5 h-5" /> :
                            ticket.status === "in-progress" ? <Clock className="w-5 h-5" /> :
                                <CheckCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="font-semibold">{ticket.id}</p>
                        <p className="text-sm text-gray-500">{ticket.restaurant}</p>
                        <p className="mt-2">{ticket.issue}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === "open" ? "bg-red-100 text-red-800" :
                        ticket.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                        }`}>
                        {ticket.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">{ticket.time}</p>
                </div>
            </div>
        </div>
    );
};

export default SupportTicket; // Don't forget this!