
import { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  chart?: ReactNode;
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  chart,
  className,
}: StatsCardProps) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {trend && trendValue && (
              <div className="flex items-center mt-1">
                {trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span 
                  className={`text-xs font-medium ${
                    trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-2 bg-gray-100 rounded-full">
              {icon}
            </div>
          )}
        </div>
        
        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
