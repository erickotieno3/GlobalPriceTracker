import AutoPilotDashboard from "@/components/admin/auto-pilot-dashboard";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AutoPilotDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Auto-Pilot Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and control the auto-pilot system and automatic content generation
          </p>
        </div>
        
        <Separator />
        
        <Card className="p-6">
          <AutoPilotDashboard />
        </Card>
      </div>
    </div>
  );
}