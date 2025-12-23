// src/pages/SuperAdmin.jsx - UPDATED DELETE FUNCTIONS
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  TrendingUp,
  DollarSign,
  Ticket,
  Plus
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

// Import API services
import { restaurantAPI, subscriptionAPI } from "@/services/api";

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

// Mock data for fallback
const mockRestaurants = [
  { id: "1", name: "The Urban Kitchen", owner: "John Smith", email: "john@urban.com", phone: "+91 98765 43210", address: "123 MG Road, Mumbai", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", plan: "Pro", status: "active", orders: 1250, revenue: "₹3,45,000" },
  { id: "2", name: "Pizza Paradise", owner: "Maria Garcia", email: "maria@pizza.com", phone: "+91 98765 43211", address: "456 Park Street, Delhi", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", plan: "Business", status: "active", orders: 2100, revenue: "₹5,20,000" },
  { id: "3", name: "Spice Route", owner: "Raj Patel", email: "raj@spice.com", phone: "+91 98765 43212", address: "789 Brigade Road, Bangalore", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400", plan: "Starter", status: "trial", orders: 150, revenue: "₹25,000" },
  { id: "4", name: "Sushi Master", owner: "Yuki Tanaka", email: "yuki@sushi.com", phone: "+91 98765 43213", address: "321 Linking Road, Mumbai", image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400", plan: "Pro", status: "suspended", orders: 0, revenue: "₹0" },
  { id: "5", name: "Burger Barn", owner: "Tom Wilson", email: "tom@burger.com", phone: "+91 98765 43214", address: "654 FC Road, Pune", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400", plan: "Business", status: "active", orders: 1800, revenue: "₹4,50,000" },
];

const initialPlans = [
  { id: "1", name: "Starter", price: "₹999", restaurants: 12, features: ["Basic Menu", "10 Tables", "Email Support"] },
  { id: "2", name: "Pro", price: "₹2,499", restaurants: 45, features: ["Unlimited Menu", "50 Tables", "Priority Support", "Analytics"] },
  { id: "3", name: "Business", price: "₹4,999", restaurants: 28, features: ["Everything in Pro", "Multi-location", "API Access", "Dedicated Manager"] },
];

const supportTickets = [
  { id: "TK001", restaurant: "Pizza Paradise", issue: "Payment gateway not working", status: "open", time: "2 hours ago" },
  { id: "TK002", restaurant: "Spice Route", issue: "Need help with menu setup", status: "in-progress", time: "5 hours ago" },
  { id: "TK003", restaurant: "The Urban Kitchen", issue: "QR codes not generating", status: "resolved", time: "1 day ago" },
];

export default function SuperAdminPortal() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [restaurants, setRestaurants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    restaurants: false,
    plans: false,
    stats: false
  });
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalRevenue: 0,
    totalOrders: 0
  });

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
    features: "",
    restaurants: 0
  });

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Store restaurant data by ID for lookup
  const [restaurantDataMap, setRestaurantDataMap] = useState({});

  // Update restaurant data map when restaurants change
  useEffect(() => {
    const map = {};
    restaurants.forEach(restaurant => {
      const id = restaurant._id || restaurant.id;
      if (id) {
        map[id] = restaurant;
      }
    });
    setRestaurantDataMap(map);
    console.log("📊 Restaurant data map updated:", Object.keys(map).length, "restaurants");
  }, [restaurants]);

  // Fetch data on component mount and tab change
  useEffect(() => {
    if (activeTab === TABS.DASHBOARD || activeTab === TABS.RESTAURANTS) {
      fetchRestaurants();
      fetchStats();
    }
    if (activeTab === TABS.SUBSCRIPTIONS) {
      fetchPlans();
    }
  }, [activeTab]);

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    setLoading(prev => ({ ...prev, restaurants: true }));
    try {
      const response = await restaurantAPI.getAll({
        search: searchQuery,
        page: 1,
        limit: 50
      });

      console.log("📋 Restaurant API Response:", response.data);

      let restaurantsData = [];

      // Handle different response formats
      if (response.data && Array.isArray(response.data.restaurants)) {
        restaurantsData = response.data.restaurants;
      } else if (Array.isArray(response.data)) {
        restaurantsData = response.data;
      }

      // Ensure all restaurants have both id and _id fields
      const normalizedRestaurants = restaurantsData.map(restaurant => {
        const id = restaurant._id || restaurant.id;
        return {
          ...restaurant,
          id: id,
          _id: restaurant._id || id
        };
      });

      setRestaurants(normalizedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(prev => ({ ...prev, restaurants: false }));
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await restaurantAPI.getStats();
      const data = response.data;
      setStats({
        totalRestaurants: data.totalRestaurants || 0,
        activeRestaurants: data.activeRestaurants || 0,
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalRestaurants: 2547,
        activeRestaurants: 2200,
        totalRevenue: 45600000,
        totalOrders: 1200000
      });
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fetch subscription plans from API
  const fetchPlans = async () => {
    setLoading(prev => ({ ...prev, plans: true }));
    try {
      const response = await subscriptionAPI.getAllPlans();

      const plansData = Array.isArray(response.data) ? response.data : [];
      const normalizedPlans = plansData.map(plan => ({
        ...plan,
        id: plan._id || plan.id || `plan-${Math.random().toString(36).substr(2, 9)}`
      }));

      setPlans(normalizedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans(initialPlans);
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  // Toggle restaurant status
  const toggleRestaurantStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    try {
      await restaurantAPI.toggleStatus(id, newStatus);
      setRestaurants(prev => prev.map(r => {
        if (r.id === id) {
          return { ...r, status: newStatus };
        }
        return r;
      }));
      alert(`Restaurant ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error toggling restaurant status:", error);
      alert("Failed to update restaurant status");
    }
  };

  // Restaurant CRUD
  const openRestaurantModal = (restaurant) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setRestaurantForm({
        name: restaurant.name || "",
        owner: restaurant.owner || "",
        email: restaurant.email || "",
        phone: restaurant.phone || "",
        address: restaurant.address || "",
        image: restaurant.image || "",
        plan: restaurant.plan || "Starter"
      });
    } else {
      setEditingRestaurant(null);
      setRestaurantForm({
        name: "",
        owner: "",
        email: "",
        phone: "",
        address: "",
        image: "",
        plan: "Starter"
      });
    }
    setRestaurantModalOpen(true);
  };

  const saveRestaurant = async () => {
    // Validate required fields
    if (!restaurantForm.name || !restaurantForm.owner || !restaurantForm.email) {
      alert("Please fill in required fields: Name, Owner, and Email");
      return;
    }

    try {
      const restaurantData = {
        name: restaurantForm.name,
        owner: restaurantForm.owner,
        email: restaurantForm.email,
        phone: restaurantForm.phone || '',
        address: restaurantForm.address || '',
        image: restaurantForm.image || '',
        plan: restaurantForm.plan || 'Starter'
      };

      if (editingRestaurant) {
        await restaurantAPI.update(editingRestaurant.id, restaurantData);
        alert("Restaurant updated successfully!");
      } else {
        await restaurantAPI.create(restaurantData);
        alert("Restaurant added successfully!");
      }

      fetchRestaurants();
      fetchStats();
      setRestaurantModalOpen(false);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      alert(error.response?.data?.error || "Failed to save restaurant");
    }
  };

  // DELETE RESTAURANT - UPDATED VERSION
  const deleteRestaurant = (restaurantIdOrObject) => {
    console.log("🗑️ Delete restaurant called with:", restaurantIdOrObject);
    console.log("🗑️ Type of parameter:", typeof restaurantIdOrObject);

    let restaurantId;
    let restaurantName = "Restaurant";

    // Check if we received an ID string or a full restaurant object
    if (typeof restaurantIdOrObject === 'string') {
      // It's an ID string (like "6942d5f5a3a5a5ac83c15cfa")
      restaurantId = restaurantIdOrObject;

      // Try to find the restaurant in our data map
      const restaurantData = restaurantDataMap[restaurantId];
      if (restaurantData) {
        restaurantName = restaurantData.name || "Restaurant";
      }

      console.log(`✅ Received ID string: ${restaurantId}, Name: ${restaurantName}`);
    } else if (typeof restaurantIdOrObject === 'object' && restaurantIdOrObject !== null) {
      // It's a restaurant object
      restaurantId = restaurantIdOrObject._id || restaurantIdOrObject.id;
      restaurantName = restaurantIdOrObject.name || "Restaurant";
      console.log(`✅ Received restaurant object, ID: ${restaurantId}, Name: ${restaurantName}`);
    } else {
      console.error("❌ Invalid parameter to deleteRestaurant:", restaurantIdOrObject);
      alert("Cannot delete: Invalid restaurant data");
      return;
    }

    if (!restaurantId) {
      console.error("❌ No restaurant ID found");
      alert("Cannot delete: Restaurant ID not found");
      return;
    }

    console.log(`✅ Setting delete target: ID=${restaurantId}, Name=${restaurantName}`);

    setDeleteTarget({
      type: "restaurant",
      id: restaurantId,
      name: restaurantName
    });
    setDeleteModalOpen(true);
  };

  // Plan CRUD
  const openPlanModal = (plan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        name: plan.name || "",
        price: plan.price || "",
        features: Array.isArray(plan.features) ? plan.features.join(", ") : plan.features || "",
        restaurants: plan.restaurants || 0
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        name: "",
        price: "",
        features: "",
        restaurants: 0
      });
    }
    setPlanModalOpen(true);
  };

  const savePlan = async () => {
    if (!planForm.name || !planForm.price) {
      alert("Please fill in required fields: Plan Name and Price");
      return;
    }

    try {
      const planData = {
        name: planForm.name,
        price: planForm.price,
        restaurants: planForm.restaurants || 0,
        features: planForm.features.split(",").map(f => f.trim()).filter(f => f)
      };

      if (editingPlan) {
        await subscriptionAPI.updatePlan(editingPlan.id, planData);
        alert("Plan updated successfully!");
      } else {
        await subscriptionAPI.createPlan(planData);
        alert("Plan created successfully!");
      }

      fetchPlans();
      setPlanModalOpen(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      alert(error.response?.data?.error || "Failed to save plan");
    }
  };

  const deletePlan = (plan) => {
    const planId = plan._id || plan.id || plan.ID;

    setDeleteTarget({
      type: "plan",
      id: planId,
      name: plan.name
    });
    setDeleteModalOpen(true);
  };

  // CONFIRM DELETE - WORKING VERSION
  const confirmDelete = async () => {
    if (!deleteTarget) {
      console.error("No delete target");
      return;
    }

    console.log("✅ Confirm delete for:", deleteTarget);

    try {
      if (deleteTarget.type === "restaurant") {
        console.log(`🗑️ Deleting restaurant ID: ${deleteTarget.id}`);

        // Call API using fetch directly
        const response = await fetch(`http://localhost:5000/api/restaurants/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Delete failed');
        }

        console.log("✅ Delete successful:", data);
        alert(`Restaurant "${deleteTarget.name}" deleted successfully!`);

        // Refresh data
        fetchRestaurants();
        fetchStats();

      } else if (deleteTarget.type === "plan") {
        await subscriptionAPI.deletePlan(deleteTarget.id);
        alert(`Plan "${deleteTarget.name}" deleted successfully!`);
        fetchPlans();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.message || "Failed to delete");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const navItems = [
    { id: TABS.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { id: TABS.RESTAURANTS, label: "Restaurants", icon: Building2, badge: restaurants.length },
    { id: TABS.SUBSCRIPTIONS, label: "Subscriptions", icon: CreditCard, badge: plans.length },
    { id: TABS.BILLING, label: "Billing", icon: DollarSign },
    { id: TABS.ANALYTICS, label: "Analytics", icon: BarChart3 },
    { id: TABS.SUPPORT, label: "Support", icon: Ticket, badge: supportTickets.filter(t => t.status === "open").length },
    { id: TABS.SETTINGS, label: "Settings", icon: Settings },
  ];

  const dashboardStats = [
    { label: "Total Restaurants", value: stats.totalRestaurants.toLocaleString(), change: "+15%", icon: Building2 },
    { label: "Active Restaurants", value: stats.activeRestaurants.toLocaleString(), change: "+22%", icon: Users },
    { label: "Monthly Revenue", value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: "+18%", icon: DollarSign },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), change: "+25%", icon: TrendingUp },
  ];

  const filteredRestaurants = restaurants.filter(r =>
    (r.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (r.owner?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (r.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === TABS.RESTAURANTS && searchQuery !== "") {
        fetchRestaurants();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
          {loading.restaurants && activeTab === TABS.RESTAURANTS && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {activeTab === TABS.DASHBOARD && (
            <DashboardContent
              stats={dashboardStats}
              restaurants={restaurants.slice(0, 4)}
              loading={loading.stats}
            />
          )}

          {activeTab === TABS.RESTAURANTS && !loading.restaurants && (
            <RestaurantsContent
              restaurants={filteredRestaurants}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openRestaurantModal={openRestaurantModal}
              toggleRestaurantStatus={toggleRestaurantStatus}
              deleteRestaurant={deleteRestaurant}
              loading={loading.restaurants}
            />
          )}

          {activeTab === TABS.SUBSCRIPTIONS && (
            <SubscriptionsContent
              plans={plans}
              openPlanModal={openPlanModal}
              deletePlan={deletePlan}
              loading={loading.plans}
            />
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
        isEditing={!!editingPlan}
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