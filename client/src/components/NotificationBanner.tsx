import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { useState } from "react";

interface NotificationBannerProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  onClose?: () => void;
}

export default function NotificationBanner({
  type,
  message,
  onClose,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const colors = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    error: "bg-red-50 border-red-200",
  };

  return (
    <div className={`${colors[type]} border rounded-md p-4 flex items-center justify-between mb-4`} data-testid={`banner-${type}`}>
      <AlertDescription>{message}</AlertDescription>
      <button
        onClick={() => setVisible(false)}
        className="ml-4"
        data-testid="button-close-notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
