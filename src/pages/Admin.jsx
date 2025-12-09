// Admin.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Tag,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  QrCode,
} from "lucide-react";
import { Link } from "react-router-dom";
import { menuItems as initialMenuItems } from "@/data/menuData";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { TableManagement } from "@/components/admin/TableManagement";
import { Dashboard } from "@/components/admin/Dashboard";
import { LiveOrders } from "@/components/admin/LiveOrders";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ShoppingCart, label: "Live Orders", id: "orders", badge: 5 },
  { icon: UtensilsCrossed, label: "Menu Management", id: "menu" },
  { icon: QrCode, label: "Table Management", id: "tables" },
  { icon: Tag, label: "Offers & Promotions", id: "offers" },
  { icon: Users, label: "Staff & Roles", id: "staff" },
  { icon: BarChart3, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// Orders data from the image reference
const initialOrders = [
  {
    id: "MFO01",
    table: "Table 5",
    items: "Margherita Pizza, Caesar Salad, Garlic Bread",
    amount: "₹478",
    time: "2 min ago",
    status: "Pending"
  },
  {
    id: "MFO02",
    table: "Table 3",
    items: "Chicken Burger x2, Pasta Alfredo, Coke",
    amount: "₹647",
    time: "8 min ago",
    status: "Preparing"
  },
  {
    id: "MFO03",
    table: "Table 8",
    items: "Grilled Salmon, Mashed Potatoes",
    amount: "₹449",
    time: "15 min ago",
    status: "Ready"
  },
  {
    id: "MFO04",
    table: "Table 1",
    items: "Veggie Wrap, Caesar Salad, Smoothie",
    amount: "₹338",
    time: "25 min ago",
    status: "Completed"
  },
  {
    id: "MFO05",
    table: "Table 12",
    items: "Pasta Alfredo, Garlic Bread, Tiramisu",
    amount: "₹399",
    time: "1 min ago",
    status: "Pending"
  },
  {
    id: "MFO06",
    table: "Table 7",
    items: "Chicken Burger, French Fries",
    amount: "₹289",
    time: "5 min ago",
    status: "Preparing"
  },
  {
    id: "MFO07",
    table: "Table 9",
    items: "Veggie Pizza, Coke",
    amount: "₹359",
    time: "3 min ago",
    status: "Pending"
  },
];

const initialTables = [
  { id: "1", number: 1, capacity: 4, status: "available", qrCode: `${window.location.origin}/menu?table=1` },
  { id: "2", number: 2, capacity: 2, status: "occupied", qrCode: `${window.location.origin}/menu?table=2` },
  { id: "3", number: 3, capacity: 6, status: "reserved", qrCode: `${window.location.origin}/menu?table=3` },
  { id: "4", number: 4, capacity: 4, status: "available", qrCode: `${window.location.origin}/menu?table=4` },
  { id: "5", number: 5, capacity: 8, status: "occupied", qrCode: `${window.location.origin}/menu?table=5` },
];

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuItemsList, setMenuItemsList] = useState(initialMenuItems);
  const [tables, setTables] = useState(initialTables);
  const [orders, setOrders] = useState(initialOrders);

  // Menu CRUD operations
  const handleAddMenuItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItemsList((prev) => [...prev, newItem]);
  };

  const handleUpdateMenuItem = (item) => {
    setMenuItemsList((prev) =>
      prev.map((i) => (i.id === item.id ? item : i))
    );
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItemsList((prev) => prev.filter((i) => i.id !== id));
  };

  // Table CRUD operations
  const handleAddTable = (table) => {
    const newTable = {
      ...table,
      id: Date.now().toString(),
      qrCode: `${window.location.origin}/menu?table=${table.number}`,
    };
    setTables((prev) => [...prev, newTable]);
  };

  const handleUpdateTable = (table) => {
    setTables((prev) =>
      prev.map((t) => (t.id === table.id ? { ...table, qrCode: `${window.location.origin}/menu?table=${table.number}` } : t))
    );
  };

  const handleDeleteTable = (id) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  // Order actions
  const handleOrderAction = (orderId, action) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let newStatus = order.status;

        switch (action) {
          case "Accept":
            newStatus = "Preparing";
            break;
          case "Mark Ready":
            newStatus = "Ready";
            break;
          case "Complete":
            newStatus = "Completed";
            break;
          default:
            break;
        }

        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const handleSidebarClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sm sm:text-base">Spice Garden</h1>
                <p className="text-xs text-muted-foreground">Restaurant Admin</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge && (
                <Badge variant={activeTab === item.id ? "gold" : "default"} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full text-sm">
              Back to Landing
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search orders, items..."
                  className="input-field pl-10 w-48 lg:w-64 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-primary">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {activeTab === "dashboard" && (
            <Dashboard orders={orders} />
          )}

          {activeTab === "orders" && (
            <LiveOrders
              orders={orders}
              onOrderAction={handleOrderAction}
            />
          )}

          {activeTab === "menu" && (
            <MenuManagement
              items={menuItemsList}
              onAddItem={handleAddMenuItem}
              onUpdateItem={handleUpdateMenuItem}
              onDeleteItem={handleDeleteMenuItem}
            />
          )}

          {activeTab === "tables" && (
            <TableManagement
              tables={tables}
              onAddTable={handleAddTable}
              onUpdateTable={handleUpdateTable}
              onDeleteTable={handleDeleteTable}
            />
          )}

          {activeTab !== "dashboard" && activeTab !== "orders" && activeTab !== "menu" && activeTab !== "tables" && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                {sidebarItems.find((i) => i.id === activeTab)?.icon && (
                  <div className="w-8 h-8 text-muted-foreground">
                    {(() => {
                      const Icon = sidebarItems.find((i) => i.id === activeTab)?.icon;
                      return Icon ? <Icon className="w-full h-full" /> : null;
                    })()}
                  </div>
                )}
              </div>
              <h2 className="font-display text-xl font-bold mb-2 capitalize">{activeTab.replace("-", " ")}</h2>
              <p className="text-muted-foreground">This section is coming soon</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Admin;