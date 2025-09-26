import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GuestDetail = () => {
  const { eventId, guestId } = useParams<{ eventId: string; guestId: string }>();

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">
              Guest {guestId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a placeholder for the guest detail view. Event ID: {eventId}, Guest ID: {guestId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestDetail;