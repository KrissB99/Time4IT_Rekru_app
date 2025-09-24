import { Dot } from "lucide-react";
import { Badge } from "../ui/badge";
import { Order } from "@/lib/orders-types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Order["status"];
}

const getBadgeStyle = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "processing":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "new":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "shipped":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getBadgeText = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return "Dostarczono";
    case "cancelled":
      return "Anulowano";
    case "processing":
      return "Przygotowanie";
    case "new":
      return "Nowe";
    case "shipped":
      return "Wysłane";
    default:
      return "Satus nieznany";
  }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full", getBadgeStyle(status))}
    >
      <Dot />
      {getBadgeText(status)}
    </Badge>
  );
}
