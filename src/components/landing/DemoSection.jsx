import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Smartphone, Monitor, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const DemoSection = () => {
  return (
    <section id="demo" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gold" className="mb-4">Live Demo</Badge>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Experience the{" "}
            <span className="text-gradient">Complete Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore all three portals - Customer Menu, Restaurant Admin, and Super Admin.
            See how everything works together seamlessly.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">

          {/* Customer App */}
          <div className="card-elevated p-8 text-center group">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">Customer App</h3>
            <p className="text-muted-foreground mb-6">
              QR scan, digital menu, filters, offers, cart, and order tracking experience.
            </p>
            <Link to="/firstpage">
              <Button variant="default" className="w-full">
                Try Customer Menu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Restaurant Admin */}
          <div className="card-elevated p-8 text-center group">
            <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Monitor className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">Restaurant Admin</h3>
            <p className="text-muted-foreground mb-6">
              Dashboard, orders, menu management, offers, and staff controls.
            </p>
            <Link to="/admin/login">
              <Button variant="secondary" className="w-full">
                Explore Admin Portal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Super Admin */}


        </div>
      </div>
    </section>
  );
};
