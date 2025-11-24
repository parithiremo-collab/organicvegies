import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";

interface VerificationBadgeProps {
  isVerified: boolean;
  isPending?: boolean;
}

export default function VerificationBadge({
  isVerified,
  isPending = false,
}: VerificationBadgeProps) {
  if (isVerified) {
    return (
      <Badge className="bg-green-500" data-testid="badge-verified">
        <Check className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    );
  }
  
  if (isPending) {
    return (
      <Badge variant="outline" data-testid="badge-pending">
        <Clock className="h-3 w-3 mr-1" />
        Pending Verification
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" data-testid="badge-unverified">
      Not Verified
    </Badge>
  );
}
