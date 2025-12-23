import { useState } from "react";
import { Link } from "react-router-dom"; // ADD THIS LINE
import { Button } from "@/components/ui/button";
import { Menu, X, QrCode } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              MenuQR
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#demo"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>

          {/* CTA Buttons - UPDATED SECTION */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="ghost">Admin Login</Button>
            </Link>
            <Link to="/admin/signup">
              <Button variant="default">Start Free Trial</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - UPDATED SECTION */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Pricing
              </a>
              <a
                href="#demo"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Demo
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Contact
              </a>

              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/admin/login">
                  <Button variant="ghost" className="w-full justify-center">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/admin/signup">
                  <Button variant="default" className="w-full justify-center">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};