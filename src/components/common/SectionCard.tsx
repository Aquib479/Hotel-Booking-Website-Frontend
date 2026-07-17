import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  size?: "default" | "sm";
  titleClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  contentClassName,
  size = "default",
  titleClassName,
}: SectionCardProps) {
  return (
    <Card size={size} className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle
          className={cn(
            size === "sm" ? "text-sm" : "text-lg",
            titleClassName
          )}
        >
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
