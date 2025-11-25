import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, X, MapPin, Leaf } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCart?: (id: string) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddToCart
}: ProductDetailsModalProps) {
  const { language, t } = useTranslation();

  if (!product) return null;

  const discount = Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100);

  const details = [
    { label: "Product ID", value: product.id },
    { label: "Price", value: `₹${product.price}` },
    { label: "MRP", value: `₹${product.mrp}` },
    { label: "Discount", value: `${discount}% OFF` },
    { label: "Weight", value: product.weight },
    { label: "Origin", value: product.origin },
    { label: "Category", value: product.category || "Organic" },
    { label: "Stock Status", value: product.inStock ? "In Stock" : "Out of Stock" },
    { label: "Rating", value: `${product.rating} ★ (${product.reviewCount} reviews)` },
    { label: "Seller", value: product.farmerName || "Fresh Harvest Farmer" },
    { label: "Availability", value: product.lowStock ? "Low Stock" : "Available" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-product-details">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{product.name}</span>
            <Badge variant="default">{discount}% OFF</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">₹{product.price}</div>
              <div className="text-xs text-muted-foreground">Current Price</div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.rating}
              </div>
              <div className="text-xs text-muted-foreground">{product.reviewCount} reviews</div>
            </div>
            <div className="bg-accent/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold">{product.weight}</div>
              <div className="text-xs text-muted-foreground">Weight/Size</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm" data-testid="table-product-details">
              <tbody>
                {details.map((detail, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <td className="px-4 py-3 font-semibold text-muted-foreground w-1/3 border-r">
                      {detail.label}
                    </td>
                    <td className="px-4 py-3">
                      {detail.label === "Stock Status" ? (
                        <Badge variant={detail.value === "In Stock" ? "default" : "destructive"}>
                          {detail.value}
                        </Badge>
                      ) : detail.label === "Discount" ? (
                        <Badge variant="destructive" className="font-bold">
                          {detail.value}
                        </Badge>
                      ) : (
                        detail.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Benefits */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              Organic Benefits
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>100% Organic</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>No Chemicals</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Farm Fresh</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Direct from Farmer</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t pt-4">
            <Button
              className="flex-1 gap-2"
              disabled={!product.inStock}
              onClick={() => {
                onAddToCart?.(product.id);
                onClose();
              }}
              data-testid="button-add-from-modal"
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
