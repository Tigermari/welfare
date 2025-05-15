import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SchemeType } from "@/types";

interface SchemeCardProps {
  scheme: SchemeType;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  return (
    <Card key={scheme.id} className="shadow-lg">
      <CardHeader>
        <CardTitle>{scheme.Scheme_Name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          {scheme.Description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-2">Benefits</h3>
          {scheme.Benefits.split(',').map((benefit, i) => (
            <p key={i}>• {benefit.trim()}</p>
          ))}
        </div>
        {/* Other sections... */}
      </CardContent>
    </Card>
  );
}
