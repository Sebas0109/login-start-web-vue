import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Events page content will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;