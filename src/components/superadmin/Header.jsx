// src/components/superadmin/Header.jsx
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";

const Header = ({ activeTab, setSidebarOpen }) => {
    return (
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h2 className="font-semibold text-lg capitalize">{activeTab}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    </Button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="font-semibold text-sm text-white">SA</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;