import { 
  QrCode, 
  Smartphone, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Bell,
  Shield,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR Code Menu",
    description: "Generate unique QR codes for each table. Customers scan and browse your digital menu instantly.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Smartphone,
    title: "Mobile Ordering",
    description: "Seamless mobile experience with real-time order tracking and instant notifications.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track sales, popular items, peak hours, and customer preferences with detailed reports.",
    color: "bg-gold/10 text-gold",
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description: "Manage orders from multiple tables and platforms in one unified dashboard.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Instant notifications for new orders, kitchen updates, and customer requests.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Users,
    title: "Customer Loyalty",
    description: "Build loyalty with exclusive offers, rewards programs, and personalized promotions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Accept multiple payment methods with bank-grade security and instant confirmations.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Zap,
    title: "Festival Offers",
    description: "Create time-limited promotions for Dussehra, Diwali, and other festivals effortlessly.",
    color: "bg-gold/10 text-gold",
  },
  {
    icon: Globe,
    title: "Multi-Restaurant",
    description: "Manage multiple outlets from a single super admin dashboard with centralized control.",
    color: "bg-success/10 text-success",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Transform</span> Your Restaurant
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete SaaS solution for modern restaurants. From QR menus to 
            analytics, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-elevated p-6 md:p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
