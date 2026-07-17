import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ContactMethod } from "../types";

interface ContactMethodCardProps {
  method: ContactMethod;
}

export function ContactMethodCard({ method }: ContactMethodCardProps) {
  return (
    <a
      href={method.href}
      target={method.external ? "_blank" : undefined}
      rel={method.external ? "noopener noreferrer" : undefined}
      className="block"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-2 text-base">
            {method.label}
            {method.external && (
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription>{method.description}</CardDescription>
        </CardHeader>
        {method.responseTime && (
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-brand">{method.responseTime}</p>
          </CardContent>
        )}
      </Card>
    </a>
  );
}
