import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { offers } from "@/data/menuData";

export const OfferBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const currentOffer = offers[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-offer p-6 text-primary-foreground">
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center flex-shrink-0">
          <Gift className="w-8 h-8" />
        </div>
        
        <div className="flex-1 min-w-0">
          <Badge variant="gold" className="mb-2">
            {currentOffer.discount}
          </Badge>
          <h3 className="font-display text-xl font-bold truncate">
            {currentOffer.title}
          </h3>
          <p className="text-sm text-white/80 truncate">
            {currentOffer.description}
          </p>
          <p className="text-xs text-white/60 mt-1">
            Code: {currentOffer.code} • Valid till {currentOffer.validTill}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
