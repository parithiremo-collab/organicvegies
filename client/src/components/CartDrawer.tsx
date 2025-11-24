import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
}

export default function CartDrawer({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add some fresh organic products to get started
            </p>
            <Button onClick={() => onOpenChange(false)} data-testid="button-start-shopping">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{item.weight}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onRemoveItem?.(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <p className="font-semibold" data-testid={`price-${item.id}`}>
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-subtotal">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span data-testid="text-delivery-fee">
                    {deliveryFee === 0 ? (
                      <span className="text-primary font-medium">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {subtotal < 500 && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{500 - subtotal} more for free delivery
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">₹{total}</span>
                </div>
              </div>

              <SheetFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={onCheckout}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
