import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { toast } = useToast();

  const { data: wishlistStatus } = useQuery({
    queryKey: ["/api/wishlist", productId],
    queryFn: () =>
      apiRequest(`/api/wishlist/${productId}`).then((r) =>
        r.json().catch(() => ({ inWishlist: false }))
      ),
  });

  const addToWishlist = useMutation({
    mutationFn: () => apiRequest("/api/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
    onSuccess: () => {
      queryClient.invalidateQueryData({ queryKey: ["/api/wishlist", productId] });
      queryClient.invalidateQueryData({ queryKey: ["/api/wishlist"] });
      toast({ title: "Added to wishlist!" });
    },
    onError: () => toast({ title: "Failed to add to wishlist", variant: "destructive" }),
  });

  const removeFromWishlist = useMutation({
    mutationFn: () => apiRequest(`/api/wishlist/${productId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueryData({ queryKey: ["/api/wishlist", productId] });
      queryClient.invalidateQueryData({ queryKey: ["/api/wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
    onError: () => toast({ title: "Failed to remove from wishlist", variant: "destructive" }),
  });

  const isInWishlist = wishlistStatus?.inWishlist ?? false;

  return (
    <Button
      size="icon"
      variant={isInWishlist ? "default" : "outline"}
      onClick={() =>
        isInWishlist
          ? removeFromWishlist.mutate()
          : addToWishlist.mutate()
      }
      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
      data-testid="button-wishlist"
      className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
    >
      <Heart
        className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
      />
    </Button>
  );
}
