import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Plus, Trash2, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export const CartSheet = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const total = subtotal;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-elevated animate-slide-in-right flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in cart
          </p>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Tag className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some delicious items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-1">
                          {item.name}
                        </h4>

                        {item.hasOffer && (
                          <Badge variant="offer" className="mt-1 text-[10px]">
                            {item.offerLabel}
                          </Badge>
                        )}
                      </div>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>

                        {item.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{item.originalPrice * item.quantity}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Offer Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
             <Link to="/checkout">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
