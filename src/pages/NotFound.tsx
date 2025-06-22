
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-accent/10 p-6 border border-accent/20">
            <FileX className="h-14 w-14 text-accent" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        
        <p className="text-xl text-muted-foreground mb-2">Page not found</p>
        
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            className="w-full sm:w-auto hover-lift"
            size="lg"
          >
            <a href="/">Return to Home</a>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="w-full sm:w-auto hover-lift"
            size="lg"
          >
            <a href="/guide">View Guide</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
