import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FaqNoResultsStateProps {
  query: string;
}

export function FaqNoResultsState({ query }: FaqNoResultsStateProps) {
  return (
    <Alert className="border-dashed py-8">
      <AlertTitle>Couldn&apos;t find what you&apos;re looking for?</AlertTitle>
      <AlertDescription className="space-y-4">
        {query ? (
          <p>
            No results for &ldquo;{query}&rdquo;. Try different keywords or browse a category
            above.
          </p>
        ) : (
          <p>Try searching or browse a category above.</p>
        )}
        <Button variant="brand" asChild>
          <Link to="/contact">
            <MessageCircle className="size-4" />
            Contact support
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
