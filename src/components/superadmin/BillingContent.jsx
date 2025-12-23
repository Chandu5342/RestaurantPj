// src/components/superadmin/BillingContent.jsx
const BillingContent = () => {
    const transactions = [
        { restaurant: "Pizza Paradise", amount: "₹4,999", date: "Dec 3, 2024", status: "completed" },
        { restaurant: "The Urban Kitchen", amount: "₹2,499", date: "Dec 2, 2024", status: "completed" },
        { restaurant: "Burger Barn", amount: "₹4,999", date: "Dec 1, 2024", status: "pending" },
        { restaurant: "Spice Route", amount: "₹999", date: "Nov 30, 2024", status: "completed" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
                    <p className="text-sm text-gray-500">This Month Revenue</p>
                    <p className="text-3xl font-bold mt-1">₹45.6L</p>
                    <p className="text-sm text-green-500 mt-2">+18% from last month</p>
                </div>
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
                    <p className="text-sm text-gray-500">Pending Payments</p>
                    <p className="text-3xl font-bold mt-1">₹2.3L</p>
                    <p className="text-sm text-gray-500 mt-2">15 invoices</p>
                </div>
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
                    <p className="text-sm text-gray-500">Total Collected</p>
                    <p className="text-3xl font-bold mt-1">₹5.2Cr</p>
                    <p className="text-sm text-gray-500 mt-2">All time</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Recent Transactions</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {transactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium">{tx.restaurant}</p>
                                    <p className="text-sm text-gray-500">{tx.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{tx.amount}</p>
                                    <span className={`text-xs ${tx.status === "completed" ? "text-green-500" : "text-yellow-500"
                                        }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingContent;