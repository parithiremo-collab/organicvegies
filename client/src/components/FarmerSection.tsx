import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import farmerImage from "@assets/generated_images/farmer_profile_authentic_portrait.png";

export default function FarmerSection() {
  const farmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Maharashtra",
      specialty: "Organic Vegetables",
      image: farmerImage,
      verified: true,
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Punjab",
      specialty: "Fresh Fruits",
      image: farmerImage,
      verified: true,
    },
    {
      id: 3,
      name: "Amit Singh",
      location: "Uttarakhand",
      specialty: "Grains & Pulses",
      image: farmerImage,
      verified: true,
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="font-accent text-3xl sm:text-4xl font-semibold mb-3">
            Meet Our Farmers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connecting you directly with certified organic farmers who care about quality and sustainability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <Card key={farmer.id} className="p-6 text-center hover-elevate" data-testid={`card-farmer-${farmer.id}`}>
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={farmer.image} alt={farmer.name} />
                  <AvatarFallback>{farmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  {farmer.name}
                  {farmer.verified && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">{farmer.location}</p>
                
                <Badge variant="secondary" className="mt-2">
                  {farmer.specialty}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
