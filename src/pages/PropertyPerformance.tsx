import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PropertyPerformancePage } from "@/components/performance/PropertyPerformancePage";

export default function PropertyPerformance() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout title="Property Performance">
      <PropertyPerformancePage
        propertyId={id}
        propertyAddress="123 High Street, EN3"
      />
    </AppLayout>
  );
}
