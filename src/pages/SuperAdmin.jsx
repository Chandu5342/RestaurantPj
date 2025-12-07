import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Store,
  Activity,
  Menu,
  X,
  ChevronRight,
  Globe,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Building2, label: "Restaurants", badge: 156 },
  { icon: CreditCard, label: "Subscriptions" },
  { icon: DollarSign, label: "Payments" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Support Tickets", badge: 8 },
  { icon: Activity, label: "Activity Logs" },
  { icon: Settings, label: "Platform Settings" },
];

const platformStats = [
  { label: "Total Restaurants", value: "5,248", change: "+156", icon: Store, color: "bg-primary" },
  { label: "Monthly Revenue", value: "₹24.5L", change: "+18%", icon: DollarSign, color: "bg-green-500" },
  { label: "Active Users", value: "128K", change: "+12%", icon: Users, color: "bg-secondary" },
  { label: "Uptime", value: "99.9%", change: "Healthy", icon: Activity, color: "bg-gold" },
];

const topRestaurants = [
  { name: "Spice Garden", location: "Mumbai", orders: 1240, revenue: "₹3.2L", growth: "+24%" },
  { name: "Tandoor Tales", location: "Delhi", orders: 980, revenue: "₹2.8L", growth: "+18%" },
  { name: "Curry House", location: "Bangalore", orders: 856, revenue: "₹2.4L", growth: "+15%" },
  { name: "Biryani Palace", location: "Hyderabad", orders: 720, revenue: "₹2.1L", growth: "+22%" },
];

const SuperAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-950" />
              </div>
              <div>
                <h1 className="font-display font-bold">MenuQR</h1>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-gradient-to-r from-gold to-amber-600 text-amber-950"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant={item.active ? "secondary" : "default"} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Landing
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search restaurants, users..."
                  className="input-field pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="gold" className="hidden sm:flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Global View
              </Badge>
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-amber-950">SA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold">Platform Overview</h1>
              <p className="text-muted-foreground">Manage all restaurants and platform settings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export Report</Button>
              <Button variant="gold">Add Restaurant</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {platformStats.map((stat) => (
              <div key={stat.label} className="card-elevated p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="success" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Top Restaurants */}
          <div className="card-elevated mb-8">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Top Performing Restaurants</h2>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                      Restaurant
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                      Location
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                      Orders
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                      Revenue
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topRestaurants.map((restaurant) => (
                    <tr key={restaurant.name} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-semibold">{restaurant.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{restaurant.location}</td>
                      <td className="px-6 py-4">{restaurant.orders.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold">{restaurant.revenue}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <TrendingUp className="w-3 h-3" />
                          {restaurant.growth}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card-elevated p-6 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Restaurant Offers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor and approve festival offers from all restaurants
              </p>
              <Badge variant="warning">12 Pending</Badge>
            </div>

            <div className="card-elevated p-6 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Subscription Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage plans, billing cycles, and payment methods
              </p>
              <Badge variant="success">All Active</Badge>
            </div>

            <div className="card-elevated p-6 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Platform Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deep dive into platform-wide metrics and insights
              </p>
              <Badge variant="gold">View Reports</Badge>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
