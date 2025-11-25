import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Truck, Shield, Users, ArrowRight, Star, CheckCircle } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Landing() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "Certified organic produce directly from verified farmers",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Fresh produce delivered to your doorstep in 24-48 hours",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Every product verified for quality and freshness",
    },
    {
      icon: Users,
      title: "Fair Pricing",
      description: "Direct farmer-to-customer pricing, no middlemen",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Browse & Select",
      description: "Explore hundreds of organic products from local farmers",
    },
    {
      number: "2",
      title: "Add to Cart",
      description: "Choose your favorites and add them to your wishlist or cart",
    },
    {
      number: "3",
      title: "Checkout",
      description: "Secure payment with UPI or card options available",
    },
    {
      number: "4",
      title: "Fresh Delivery",
      description: "Receive fresh produce at your doorstep with tracking",
    },
  ];

  const testimonials = [
    {
      name: "Priya Kumar",
      role: "Mumbai, India",
      text: "Finally fresh organic vegetables! The quality is amazing and the farmers are trustworthy.",
      rating: 5,
    },
    {
      name: "Rajesh Singh",
      role: "Bangalore, India",
      text: "Great platform connecting farmers directly. Love supporting local agriculture!",
      rating: 5,
    },
    {
      name: "Sneha Patel",
      role: "Pune, India",
      text: "Affordable and authentic. This is how organic farming should be accessible.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/ulavar-angadi-logo.png" alt="Ulavar Angadi" className="h-10 object-contain" />
            <span className="font-accent text-xl font-bold text-primary hidden sm:inline">Ulavar Angadi</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button 
              onClick={() => window.location.href = "/api/login"}
              size="sm"
              data-testid="button-landing-login"
            >
              {t('signInWithReplit')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-28" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 sm:space-y-8" data-testid="hero-content">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 w-fit">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">100% Organic & Certified</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground" data-testid="text-hero-title">
                  Fresh Organic Produce
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Direct from Farmers</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Support local farmers and get fresh, certified organic produce delivered to your doorstep. No middlemen, fair prices, guaranteed quality.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 sm:space-y-4" data-testid="hero-benefits">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Direct from verified organic farmers</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Fresh delivery within 24-48 hours</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Secure payment with UPI & Card options</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "/api/login"}
                  className="gap-2"
                  data-testid="button-get-started"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center items-center" data-testid="hero-image">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-primary/20 dark:border-primary/30 shadow-xl">
                  <img 
                    src="/ulavar-angadi-logo.png" 
                    alt="Ulavar Angadi" 
                    className="w-full h-auto object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Why Choose Ulavar Angadi?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the best of organic farming with modern convenience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 sm:p-8 hover-elevate border text-center"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24" data-testid="section-howitworks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get fresh organic produce in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <Card className="p-6 sm:p-8 border h-full">
                  <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="font-bold text-lg text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-muted/30" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">What Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy customers getting fresh organic produce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-6 sm:p-8 border hover-elevate"
                data-testid={`card-testimonial-${index}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">500+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Verified Farmers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">5000+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">100+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Product Types</p>
            </div>
            <div className="col-span-2 sm:col-span-1 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">24/48hrs</p>
              <p className="text-sm sm:text-base text-muted-foreground">Delivery Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24" data-testid="section-final-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Get Fresh Organic Produce?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10">
            Join our community and start shopping from local organic farmers today.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="gap-2 text-base sm:text-lg px-8 py-6"
            data-testid="button-cta-final"
          >
            Start Shopping Now <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Connecting organic farmers directly to consumers for fresh, quality produce.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Browse Products</a></li>
                <li><a href="#" className="hover:text-primary">How It Works</a></li>
                <li><a href="#" className="hover:text-primary">Delivery Info</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Farmers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Sell Products</a></li>
                <li><a href="#" className="hover:text-primary">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@ulavarangadi.com</li>
                <li>farmers@ulavarangadi.com</li>
                <li>agents@ulavarangadi.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ulavar Angadi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
