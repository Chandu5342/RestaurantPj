// src/components/superadmin/AnalyticsContent.jsx
const AnalyticsContent = () => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Platform Growth</h3>
                    <div className="h-48 flex items-end justify-around gap-2">
                        {[45, 60, 55, 70, 85, 90, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                />
                                <span className="text-xs text-gray-500">
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border bg-white border-gray-200 shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Revenue by Plan</h3>
                    <div className="space-y-4">
                        {[
                            { plan: "Business", percentage: 55, revenue: "₹25L" },
                            { plan: "Pro", percentage: 35, revenue: "₹16L" },
                            { plan: "Starter", percentage: 10, revenue: "₹4.6L" },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{item.plan}</span>
                                    <span className="text-gray-500">{item.revenue}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsContent;