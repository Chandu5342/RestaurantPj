// src/components/admin/LiveOrders.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const orderTabs = ["All", "Pending", "Preparing", "Ready", "Completed"];

export const LiveOrders = ({ orders, onOrderAction }) => {
  const [activeOrderTab, setActiveOrderTab] = useState("All");

  // Filter orders based on active tab
  const filteredOrders = activeOrderTab === "All"
    ? orders
    : orders.filter(order => order.status === activeOrderTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Live Orders</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Real-time order tracking and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {orderTabs.map((tab) => (
          <Button
            key={tab}
            variant={activeOrderTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveOrderTab(tab)}
          >
            {tab}
            {tab !== "All" && (
              <Badge variant="outline" className="ml-2 text-xs">
                {orders.filter(o => o.status === tab).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Table ID</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-medium">{order.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{order.table}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {order.items}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{order.amount}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">{order.time}</div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        order.status === "Pending" ? "default" :
                          order.status === "Preparing" ? "secondary" :
                            order.status === "Ready" ? "success" : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant={
                        order.status === "Pending" ? "default" :
                          order.status === "Preparing" ? "secondary" :
                            order.status === "Ready" ? "success" : "outline"
                      }
                      onClick={() => onOrderAction(order.id,
                        order.status === "Pending" ? "Accept" :
                          order.status === "Preparing" ? "Mark Ready" :
                            order.status === "Ready" ? "Complete" : "Done"
                      )}
                      disabled={order.status === "Completed"}
                    >
                      {order.status === "Pending" ? "Accept" :
                        order.status === "Preparing" ? "Mark Ready" :
                          order.status === "Ready" ? "Complete" : "Done"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Pending Orders</div>
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Pending").length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Preparing</div>
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Preparing").length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Ready</div>
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Ready").length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Completed").length}</div>
        </div>
      </div>
    </div>
  );
};