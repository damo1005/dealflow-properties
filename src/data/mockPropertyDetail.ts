export interface PropertyDetail {
  id: string;
  address: string;
  postcode: string;
  price: number;
  originalPrice?: number;
  priceReduced: boolean;
  priceHistory: { date: string; price: number; event: string }[];
  
  // Basic Details
  bedrooms: number;
  bathrooms: number;
  receptionRooms: number;
  propertyType: string;
  tenure: 'Freehold' | 'Leasehold' | 'Share of Freehold';
  councilTaxBand: string;
  epcRating: string;
  epcScore: number;
  floorAreaSqft: number;
  
  // Images
  images: string[];
  floorPlan?: string;
  
  // Description
  description: string;
  keyFeatures: string[];
  aiSummary?: string;
  
  // Financial
  estimatedValueLow: number;
  estimatedValueHigh: number;
  pricePerSqft: number;
  stampDuty: number;
  
  // Investment Metrics
  estimatedRent: number;
  estimatedYield: number;
  cashFlow: number;
  roiPotential: number;
  capRate: number;
  
  // Location
  latitude: number;
  longitude: number;
  nearbyAmenities: {
    type: string;
    name: string;
    distance: string;
  }[];
  transportLinks: { name: string; type: string; distance: string }[];
  
  // Area Stats
  averageAreaPrice: number;
  areaDeprivationIndex: number;
  crimeRate: string;
  floodRisk: string;
  
  // Comparables
  comparables: {
    id: string;
    address: string;
    price: number;
    soldDate?: string;
    bedrooms: number;
    propertyType: string;
    status: 'sold' | 'listed';
  }[];
  
  // Planning
  planningApplications: {
    id: string;
    reference: string;
    description: string;
    status: string;
    decisionDate?: string;
    councilUrl?: string;
  }[];
  
  // Ownership
  previousSales: {
    date: string;
    price: number;
  }[];
  leaseInfo?: {
    yearsRemaining: number;
    groundRent: number;
    serviceCharge: number;
  };
  
  // EPC
  epcRecommendations: {
    improvement: string;
    typicalCost: string;
    potentialSaving: string;
  }[];
  
  // Meta
  daysOnMarket: number;
  listedDate: string;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export const mockPropertyDetail: PropertyDetail = {
  id: "1",
  address: "123 Oak Street, Didsbury, Manchester, M20 4WA",
  postcode: "M20 4WA",
  price: 425000,
  originalPrice: 450000,
  priceReduced: true,
  priceHistory: [
    { date: "2024-01-15", price: 450000, event: "Listed" },
    { date: "2024-02-01", price: 425000, event: "Price reduced" },
  ],
  
  bedrooms: 4,
  bathrooms: 2,
  receptionRooms: 2,
  propertyType: "Semi-detached",
  tenure: "Freehold",
  councilTaxBand: "D",
  epcRating: "C",
  epcScore: 72,
  floorAreaSqft: 1450,
  
  images: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
  ],
  
  description: `A beautifully presented four-bedroom semi-detached family home situated in the highly sought-after Didsbury village. The property has been thoughtfully extended and modernized throughout, offering spacious and versatile accommodation.

The ground floor comprises an entrance hallway, a generous living room with bay window, a modern fitted kitchen with integrated appliances, and a stunning open-plan dining room/family room with bi-fold doors leading to the landscaped rear garden.

The first floor offers four well-proportioned bedrooms, with the master bedroom benefiting from an en-suite shower room. A contemporary family bathroom completes the first floor accommodation.

Externally, the property boasts a driveway providing off-road parking for multiple vehicles, along with a beautifully landscaped rear garden featuring a patio area, lawn, and mature borders.`,
  
  keyFeatures: [
    "Extended and modernized throughout",
    "Four bedrooms, two bathrooms",
    "Open-plan kitchen/dining/family room",
    "Bi-fold doors to landscaped garden",
    "Driveway parking for multiple vehicles",
    "Close to Didsbury village amenities",
    "Excellent local schools",
    "Walking distance to transport links",
  ],
  
  aiSummary: "Prime Didsbury location with strong rental demand. Recent extension adds value. Good investment potential with 5.8% yield. Comparable sales suggest fair pricing after reduction.",
  
  estimatedValueLow: 410000,
  estimatedValueHigh: 440000,
  pricePerSqft: 293,
  stampDuty: 11250,
  
  estimatedRent: 1950,
  estimatedYield: 5.5,
  cashFlow: 450,
  roiPotential: 12.4,
  capRate: 5.2,
  
  latitude: 53.4084,
  longitude: -2.2276,
  
  nearbyAmenities: [
    { type: "school", name: "Didsbury CE Primary School", distance: "0.3 miles" },
    { type: "school", name: "Parrs Wood High School", distance: "0.8 miles" },
    { type: "transport", name: "East Didsbury Metrolink", distance: "0.4 miles" },
    { type: "shopping", name: "Didsbury Village", distance: "0.2 miles" },
    { type: "health", name: "Didsbury Medical Centre", distance: "0.3 miles" },
  ],
  
  transportLinks: [
    { name: "East Didsbury Metrolink", type: "tram", distance: "0.4 miles" },
    { name: "Didsbury Village (bus)", type: "bus", distance: "0.1 miles" },
    { name: "Manchester Airport", type: "airport", distance: "4.2 miles" },
  ],
  
  averageAreaPrice: 485000,
  areaDeprivationIndex: 2,
  crimeRate: "Low",
  floodRisk: "Very Low",
  
  comparables: [
    { id: "c1", address: "145 Oak Street, M20 4WA", price: 435000, soldDate: "2023-11-15", bedrooms: 4, propertyType: "Semi-detached", status: "sold" },
    { id: "c2", address: "87 Wilmslow Road, M20 3BW", price: 395000, soldDate: "2023-10-20", bedrooms: 3, propertyType: "Semi-detached", status: "sold" },
    { id: "c3", address: "22 Burton Road, M20 4QH", price: 475000, bedrooms: 4, propertyType: "Detached", status: "listed" },
    { id: "c4", address: "56 School Lane, M20 6PT", price: 415000, soldDate: "2024-01-08", bedrooms: 4, propertyType: "Semi-detached", status: "sold" },
  ],
  
  planningApplications: [
    { id: "p1", reference: "134567/FO/2023", description: "Single storey rear extension", status: "Approved", decisionDate: "2023-06-15", councilUrl: "https://manchester.gov.uk/planning" },
    { id: "p2", reference: "134568/FO/2022", description: "Loft conversion with rear dormer", status: "Approved", decisionDate: "2022-09-20" },
  ],
  
  previousSales: [
    { date: "2018-03-15", price: 345000 },
    { date: "2010-07-22", price: 275000 },
    { date: "2003-11-08", price: 185000 },
  ],
  
  epcRecommendations: [
    { improvement: "Floor insulation", typicalCost: "£800-1200", potentialSaving: "£45/year" },
    { improvement: "Solar water heating", typicalCost: "£4000-6000", potentialSaving: "£55/year" },
    { improvement: "Solar PV panels", typicalCost: "£5000-8000", potentialSaving: "£350/year" },
  ],
  
  daysOnMarket: 45,
  listedDate: "2024-01-15",
  agent: {
    name: "Thornley Groves",
    phone: "0161 998 1234",
    email: "didsbury@thornleygroves.co.uk",
  },
  
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-02-01T14:30:00Z",
};
