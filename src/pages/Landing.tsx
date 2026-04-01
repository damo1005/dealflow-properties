import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowRight,
  Check,
  Star,
  Target,
  FileText,
  BedDouble,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Deal Analyser",
    description:
      "Enter any UK property and get an instant R2SA viability score, break-even occupancy, and projected profit.",
  },
  {
    icon: FileText,
    title: "Landlord Pitch Generator",
    description:
      "Generate a professional guaranteed rent proposal in seconds. Built on what actually convinces landlords to say yes.",
  },
  {
    icon: BedDouble,
    title: "STR Management",
    description:
      "Connect Airbnb and Booking.com. Manage your calendar, track revenue, and monitor occupancy — all in one place.",
  },
];

const testimonials = [
  {
    name: "James R.",
    role: "SA Operator, Manchester",
    text: "DealFlow cut my deal analysis time from hours to minutes. I signed two new landlords in my first month using the pitch generator.",
    rating: 5,
  },
  {
    name: "Priya K.",
    role: "R2SA Operator, Birmingham",
    text: "The landlord pipeline keeps me organised and the AI pitches are incredibly professional. Landlords take me seriously now.",
    rating: 5,
  },
  {
    name: "Tom W.",
    role: "SA Operator, Bristol",
    text: "I manage 8 SA units and finally have everything in one place. Bookings, revenue, compliance — no more spreadsheets.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Operator",
    price: "£29",
    period: "/month",
    description: "For individual SA operators",
    features: [
      "Up to 5 properties",
      "R2SA deal analyser",
      "Landlord pitch generator",
      "STR calendar & bookings",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "£49",
    period: "/month",
    description: "For scaling SA businesses",
    features: [
      "Unlimited properties",
      "Everything in Operator",
      "Branded pitch documents",
      "Airbnb Radar & competitor data",
      "Priority support",
    ],
    popular: true,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">DealFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Start free trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            Built for UK SA &amp; R2SA Operators
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            The all-in-one platform for R2SA and serviced accommodation operators
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyse deals in minutes. Generate landlord pitch letters. Manage your SA properties in one place.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="gap-2 text-base px-8">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Three tools. One platform.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Everything an SA operator needs — nothing you don't.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <f.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Trusted by SA operators across the UK
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Pick the plan that fits your SA business
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? "border-primary shadow-lg relative" : ""}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl sm:text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup">
                    <Button className="w-full text-base" size="lg" variant={plan.popular ? "default" : "outline"}>
                      Start free trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to scale your SA portfolio?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
            Join SA operators across the UK who use DealFlow to find deals, win landlords, and grow their business.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-bold">DealFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The all-in-one platform for UK serviced accommodation operators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/auth/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DealFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}