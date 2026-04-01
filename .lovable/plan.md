
# Landing Page Redesign Plan

## 1. Hero Section
- **Headline:** "Run Your SA Business Like a Pro" (or similar R2SA-specific copy)
- **Subheadline:** "The all-in-one platform for serviced accommodation operators. Analyse deals, pitch landlords, and manage your SA portfolio — from first viewing to first booking."
- **CTA button:** "Start Your Free Trial" → `/auth/signup`
- **Secondary CTA:** "See How It Works" → scrolls to benefits

## 2. Core Benefits (3 cards)
1. **Analyse Deals Instantly** — Run R2SA deal analysis in seconds. Input the rent, estimate Airbnb revenue, and know your profit before signing a lease.
2. **Win Landlords with AI Pitches** — Generate professional guaranteed-rent proposals that make landlords say yes. Branded, data-backed, ready to send.
3. **Manage Your SA Portfolio** — Track bookings, occupancy, and revenue across Airbnb, Booking.com, and direct channels in one dashboard.

## 3. Social Proof Section
- 3 placeholder testimonial cards (avatar placeholder, name, role like "SA Operator, Manchester")
- Quotes will be replaced with real ones later
- Optional: "Trusted by 100+ SA operators across the UK" tagline

## 4. Pricing Section
- **Operator Plan — £29/month**: Up to 5 properties, deal analyser, landlord pitch generator, pipeline tracker, STR dashboard
- **Growth Plan — £49/month**: Unlimited properties, branded pitch documents, Airbnb Radar, priority support
- Both cards with "Start Free Trial" CTA → `/auth/signup`

## 5. Final CTA Banner
- "Ready to scale your SA portfolio?" with "Start Your Free Trial" button → `/auth/signup`

## Technical Notes
- Single file edit: `src/pages/Landing.tsx` (full rewrite)
- No new dependencies needed — uses existing shadcn components + Tailwind
- Mobile-responsive, mobile-first approach
- All colours via design tokens (no hardcoded colours)
- No out-of-scope features mentioned (no auctions, BTL, HMO, etc.)
