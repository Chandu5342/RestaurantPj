import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, QrCode, Smartphone, BarChart3, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-food.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2">
              <Badge variant="offer" className="animate-pulse">
                🎉 Festival Season Sale
              </Badge>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Smart QR Menu &{" "}
              <span className="text-gradient">Restaurant Management</span>{" "}
              Platform
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Transform your restaurant with digital menus, real-time ordering,
              and powerful analytics. Delight customers with exclusive offers
              and seamless dining experiences.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/scan">
                <Button size="xl" variant="hero" className="gap-2">
                  <ScanLine className="w-5 h-5" />
                  Scan QR Code
                </Button>
              </Link>
              <Button size="xl" variant="outline">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
              <div>
                <p className="text-3xl font-bold text-foreground">5000+</p>
                <p className="text-muted-foreground">Restaurants</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">2M+</p>
                <p className="text-muted-foreground">Orders/Month</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">4.9★</p>
                <p className="text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Image & Phone Mockup */}
          <div className="relative lg:h-[600px]">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-elevated animate-float">
              <img
                src={heroImage}
                alt="Restaurant digital menu experience"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-4 md:-left-8 top-1/4 card-glass p-4 animate-slide-up opacity-0 stagger-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">QR Scan</p>
                  <p className="text-sm text-muted-foreground">Instant Menu</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 md:-right-8 top-1/2 card-glass p-4 animate-slide-up opacity-0 stagger-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Mobile First</p>
                  <p className="text-sm text-muted-foreground">Responsive UI</p>
                </div>
              </div>
            </div>

            <div className="absolute left-1/4 -bottom-4 md:-bottom-8 card-glass p-4 animate-slide-up opacity-0 stagger-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Analytics</p>
                  <p className="text-sm text-muted-foreground">Real-time Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
