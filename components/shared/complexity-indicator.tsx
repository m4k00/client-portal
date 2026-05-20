import { Badge } from "@/components/ui/badge";
import { COMPLEXITY_RATINGS } from "@/lib/constants";

interface ComplexityIndicatorProps {
  rating: "straightforward" | "moderate" | "complex" | "enterprise";
}

export function ComplexityIndicator({ rating }: ComplexityIndicatorProps) {
  const config = COMPLEXITY_RATINGS.find((r) => r.value === rating);

  if (!config) return null;

  const colorClasses = {
    green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
    orange: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
    red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
    blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
    gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <Badge
      variant="outline"
      className={`text-lg px-4 py-2 ${colorClasses[config.color]}`}
    >
      {config.label}
    </Badge>
  );
}
