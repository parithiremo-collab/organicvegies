import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewsSectionProps {
  productId: string;
  isAuthenticated: boolean;
}

export default function ReviewsSection({
  productId,
  isAuthenticated,
}: ReviewsSectionProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/reviews", productId],
    queryFn: () =>
      apiRequest(`/api/reviews/${productId}`).then((r) => r.json()),
  });

  const submitReview = useMutation({
    mutationFn: () =>
      apiRequest("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId,
          rating: Number(rating),
          title,
          comment,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueryData({ queryKey: ["/api/reviews", productId] });
      setTitle("");
      setComment("");
      setRating(5);
      setShowForm(false);
      toast({ title: "Review submitted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error?.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    submitReview.mutate();
  };

  return (
    <div className="space-y-6" data-testid="section-reviews">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {isAuthenticated && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="mb-4"
            data-testid="button-write-review"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        )}

        {showForm && (
          <Card className="p-5 mb-6" data-testid="form-review">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      data-testid={`button-rating-${r}`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          r <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="text-sm font-semibold mb-2 block">
                  Review Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full p-2 border rounded-md"
                  data-testid="input-review-title"
                />
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="text-sm font-semibold mb-2 block"
                >
                  Your Review
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="min-h-24"
                  data-testid="textarea-review"
                />
              </div>

              <Button
                type="submit"
                disabled={submitReview.isPending}
                data-testid="button-submit-review"
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Card>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground mb-6">
            Please log in to write a review.
          </p>
        )}

        {isLoading ? (
          <p>Loading reviews...</p>
        ) : !reviews || reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review.id} className="p-4" data-testid={`card-review-${review.id}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.user.profileImageUrl} />
                      <AvatarFallback>
                        {review.user.firstName?.[0]}{review.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
