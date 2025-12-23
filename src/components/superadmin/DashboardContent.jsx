// src/components/superadmin/DashboardContent.jsx
import { TrendingUp, Building2, Plus, ArrowUpRight, DollarSign, CheckCircle } from "lucide-react";

const DashboardContent = ({ stats, restaurants }) => {
    const recentActivities = [
        { action: "New restaurant signed up", name: "Cafe Mocha", time: "5 min ago", icon: Plus },
        { action: "Subscription upgraded", name: "Pizza Paradise", time: "1 hour ago", icon: ArrowUpRight },
        { action: "Payment received", name: "₹4,999", time: "2 hours ago", icon: DollarSign },
        { action: "Support ticket resolved", name: "TK003", time: "3 hours ago", icon: CheckCircle },
    ];

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">Recent Restaurants</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {restaurants.slice(0, 4).map(r => (
                                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{r.name}</p>
                                            <p className="text-sm text-gray-500">{r.owner}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${r.status === "active" ? "bg-green-100 text-green-800" :
                                        r.status === "trial" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                        {r.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">Platform Activity</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <activity.icon className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.name}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;