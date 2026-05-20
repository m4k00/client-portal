import { Badge } from "@/components/ui/badge";
import { SUBMISSION_STATUS } from "@/lib/constants";

interface StatusBadgeProps {
  status: "new" | "reviewed" | "contacted" | "archived";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = SUBMISSION_STATUS.find((s) => s.value === status);

  if (!config) return null;

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
    green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
    gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <Badge variant="outline" className={colorClasses[config.color]}>
      {config.label}
    </Badge>
  );
}
