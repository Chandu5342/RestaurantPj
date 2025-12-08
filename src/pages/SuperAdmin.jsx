// src/pages/SuperAdmin.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Users,
  TrendingUp,
  DollarSign,
  Ticket,
  Home,
  Menu as MenuIcon
} from "lucide-react";

// Import SuperAdmin components
import {
  Sidebar,
  Header,
  DashboardContent,
  RestaurantsContent,
  SubscriptionsContent,
  BillingContent,
  AnalyticsContent,
  SupportContent,
  SettingsContent,
  RestaurantModal,
  PlanModal,
  DeleteModal
} from "@/components/superadmin";

// Define constants for tabs
const TABS = {
  DASHBOARD: "dashboard",
  RESTAURANTS: "restaurants",
  SUBSCRIPTIONS: "subscriptions",
  BILLING: "billing",
  ANALYTICS: "analytics",
  SUPPORT: "support",
  SETTINGS: "settings"
};

// Mock data
const mockRestaurants = [
  { id: 1, name: "The Urban Kitchen", owner: "John Smith", email: "john@urban.com", phone: "+91 98765 43210", address: "123 MG Road, Mumbai", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", plan: "Pro", status: "active", orders: 1250, revenue: "₹3,45,000" },
  { id: 2, name: "Pizza Paradise", owner: "Maria Garcia", email: "maria@pizza.com", phone: "+91 98765 43211", address: "456 Park Street, Delhi", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", plan: "Business", status: "active", orders: 2100, revenue: "₹5,20,000" },
  { id: 3, name: "Spice Route", owner: "Raj Patel", email: "raj@spice.com", phone: "+91 98765 43212", address: "789 Brigade Road, Bangalore", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400", plan: "Starter", status: "trial", orders: 150, revenue: "₹25,000" },
  { id: 4, name: "Sushi Master", owner: "Yuki Tanaka", email: "yuki@sushi.com", phone: "+91 98765 43213", address: "321 Linking Road, Mumbai", image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400", plan: "Pro", status: "suspended", orders: 0, revenue: "₹0" },
  { id: 5, name: "Burger Barn", owner: "Tom Wilson", email: "tom@burger.com", phone: "+91 98765 43214", address: "654 FC Road, Pune", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400", plan: "Business", status: "active", orders: 1800, revenue: "₹4,50,000" },
];

const initialPlans = [
  { id: 1, name: "Starter", price: "₹999", restaurants: 12, features: ["Basic Menu", "10 Tables", "Email Support"] },
  { id: 2, name: "Pro", price: "₹2,499", restaurants: 45, features: ["Unlimited Menu", "50 Tables", "Priority Support", "Analytics"] },
  { id: 3, name: "Business", price: "₹4,999", restaurants: 28, features: ["Everything in Pro", "Multi-location", "API Access", "Dedicated Manager"] },
];

const supportTickets = [
  { id: "TK001", restaurant: "Pizza Paradise", issue: "Payment gateway not working", status: "open", time: "2 hours ago" },
  { id: "TK002", restaurant: "Spice Route", issue: "Need help with menu setup", status: "in-progress", time: "5 hours ago" },
  { id: "TK003", restaurant: "The Urban Kitchen", issue: "QR codes not generating", status: "resolved", time: "1 day ago" },
];

export default function SuperAdminPortal() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [plans, setPlans] = useState(initialPlans);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Restaurant Modal State
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    plan: "Starter"
  });

  // Plan Modal State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    features: ""
  });

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toggleRestaurantStatus = (id) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === "active" ? "suspended" : "active" };
      }
      return r;
    }));
  };

  // Restaurant CRUD
  const openRestaurantModal = (restaurant) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setRestaurantForm({
        name: restaurant.name,
        owner: restaurant.owner,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        image: restaurant.image,
        plan: restaurant.plan
      });
    } else {
      setEditingRestaurant(null);
      setRestaurantForm({ name: "", owner: "", email: "", phone: "", address: "", image: "", plan: "Starter" });
    }
    setRestaurantModalOpen(true);
  };

  const saveRestaurant = () => {
    if (!restaurantForm.name || !restaurantForm.owner) {
      alert("Please fill in required fields: Name and Owner");
      return;
    }

    if (editingRestaurant) {
      setRestaurants(prev => prev.map(r =>
        r.id === editingRestaurant.id
          ? { ...r, ...restaurantForm }
          : r
      ));
      alert("Restaurant updated successfully!");
    } else {
      const newRestaurant = {
        id: Math.max(...restaurants.map(r => r.id)) + 1,
        ...restaurantForm,
        status: "trial",
        orders: 0,
        revenue: "₹0"
      };
      setRestaurants(prev => [...prev, newRestaurant]);
      alert("Restaurant added successfully!");
    }
    setRestaurantModalOpen(false);
  };

  const deleteRestaurant = (id) => {
    setDeleteTarget({ type: "restaurant", id });
    setDeleteModalOpen(true);
  };

  // Plan CRUD
  const openPlanModal = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      features: plan.features.join(", ")
    });
    setPlanModalOpen(true);
  };

  const savePlan = () => {
    if (!planForm.name || !planForm.price || !editingPlan) {
      alert("Please fill in all fields");
      return;
    }

    setPlans(prev => prev.map(p =>
      p.id === editingPlan.id
        ? { ...p, name: planForm.name, price: planForm.price, features: planForm.features.split(",").map(f => f.trim()) }
        : p
    ));
    setPlanModalOpen(false);
    alert("Plan updated successfully!");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "restaurant") {
      setRestaurants(prev => prev.filter(r => r.id !== deleteTarget.id));
      alert("Restaurant deleted successfully!");
    }
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const navItems = [
    { id: TABS.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { id: TABS.RESTAURANTS, label: "Restaurants", icon: Building2, badge: restaurants.length },
    { id: TABS.SUBSCRIPTIONS, label: "Subscriptions", icon: CreditCard },
    { id: TABS.BILLING, label: "Billing", icon: DollarSign },
    { id: TABS.ANALYTICS, label: "Analytics", icon: BarChart3 },
    { id: TABS.SUPPORT, label: "Support", icon: Ticket, badge: supportTickets.filter(t => t.status === "open").length },
    { id: TABS.SETTINGS, label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Total Restaurants", value: "2,547", change: "+15%", icon: Building2 },
    { label: "Active Users", value: "45.2K", change: "+22%", icon: Users },
    { label: "Monthly Revenue", value: "₹45.6L", change: "+18%", icon: DollarSign },
    { label: "Total Orders", value: "1.2M", change: "+25%", icon: TrendingUp },
  ];

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
      />

      <main className="flex-1 lg:ml-64">
        <Header activeTab={activeTab} setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          {activeTab === TABS.DASHBOARD && (
            <DashboardContent stats={stats} restaurants={restaurants} />
          )}

          {activeTab === TABS.RESTAURANTS && (
            <RestaurantsContent
              restaurants={filteredRestaurants}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openRestaurantModal={openRestaurantModal}
              toggleRestaurantStatus={toggleRestaurantStatus}
              deleteRestaurant={deleteRestaurant}
            />
          )}

          {activeTab === TABS.SUBSCRIPTIONS && (
            <SubscriptionsContent plans={plans} openPlanModal={openPlanModal} />
          )}

          {activeTab === TABS.BILLING && (
            <BillingContent />
          )}

          {activeTab === TABS.ANALYTICS && (
            <AnalyticsContent />
          )}

          {activeTab === TABS.SUPPORT && (
            <SupportContent supportTickets={supportTickets} />
          )}

          {activeTab === TABS.SETTINGS && (
            <SettingsContent />
          )}
        </div>
      </main>

      <RestaurantModal
        open={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
        editingRestaurant={editingRestaurant}
        restaurantForm={restaurantForm}
        setRestaurantForm={setRestaurantForm}
        saveRestaurant={saveRestaurant}
        plans={plans}
      />

      <PlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        editingPlan={editingPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        savePlan={savePlan}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}