export interface TemplateItem {
  id: string;
  label: string;
  keywords: string[];
}

export interface ViewingTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  checklist: TemplateItem[];
}

export const viewingTemplates: ViewingTemplate[] = [
  {
    id: "btl",
    name: "Quick BTL Assessment",
    description: "Essential checks for buy-to-let properties",
    icon: "Home",
    checklist: [
      {
        id: "kitchen",
        label: "Kitchen condition and age",
        keywords: ["kitchen", "cupboard", "appliance", "oven", "hob", "worktop"],
      },
      {
        id: "bathroom",
        label: "Bathroom quality",
        keywords: ["bathroom", "toilet", "shower", "bath", "tiles", "sink"],
      },
      {
        id: "tenant-appeal",
        label: "Tenant appeal (neutral decor, practical layout)",
        keywords: ["tenant", "neutral", "decor", "layout", "modern", "appeal"],
      },
      {
        id: "parking",
        label: "Parking and transport links",
        keywords: ["parking", "car", "bus", "train", "station", "transport"],
      },
      {
        id: "repairs",
        label: "Any immediate repairs needed",
        keywords: ["repair", "fix", "broken", "damage", "crack", "leak"],
      },
      {
        id: "rental",
        label: "Estimated rental value",
        keywords: ["rent", "rental", "month", "pcm", "yield", "income"],
      },
    ],
  },
  {
    id: "hmo",
    name: "HMO Deep Dive",
    description: "Comprehensive checks for HMO conversion potential",
    icon: "Users",
    checklist: [
      {
        id: "bedrooms",
        label: "Number of potential bedrooms",
        keywords: ["bedroom", "room", "bed", "double", "single", "ensuite"],
      },
      {
        id: "bathrooms",
        label: "Bathroom count and locations",
        keywords: ["bathroom", "toilet", "shower", "ensuite", "shared"],
      },
      {
        id: "kitchen-size",
        label: "Kitchen size (can accommodate multiple tenants?)",
        keywords: ["kitchen", "large", "communal", "shared", "space"],
      },
      {
        id: "fire-safety",
        label: "Fire safety compliance potential",
        keywords: ["fire", "alarm", "door", "escape", "extinguisher", "safety"],
      },
      {
        id: "licensing",
        label: "Licensing requirements in area",
        keywords: ["license", "council", "hmo", "mandatory", "selective"],
      },
      {
        id: "lockable",
        label: "Individual room lockability",
        keywords: ["lock", "door", "privacy", "secure", "key"],
      },
      {
        id: "communal",
        label: "Communal space adequacy",
        keywords: ["lounge", "living", "communal", "shared", "common"],
      },
    ],
  },
  {
    id: "flip",
    name: "Flip Property Assessment",
    description: "Key checks for renovation and resale projects",
    icon: "Hammer",
    checklist: [
      {
        id: "structural",
        label: "Structural issues (cracks, subsidence, roof)",
        keywords: ["structural", "crack", "subsidence", "foundation", "wall", "roof"],
      },
      {
        id: "damp",
        label: "Damp or water damage",
        keywords: ["damp", "mould", "mold", "water", "leak", "wet", "condensation"],
      },
      {
        id: "electrics",
        label: "Electrics and plumbing age",
        keywords: ["electric", "wiring", "plumbing", "pipes", "boiler", "fuse"],
      },
      {
        id: "windows",
        label: "Windows and doors condition",
        keywords: ["window", "door", "double glazing", "frame", "draft"],
      },
      {
        id: "layout",
        label: "Layout - can it be improved?",
        keywords: ["layout", "open plan", "knock through", "wall", "reconfigure"],
      },
      {
        id: "extension",
        label: "Extension or conversion potential",
        keywords: ["extension", "loft", "basement", "conversion", "garden", "build"],
      },
      {
        id: "kerb-appeal",
        label: "Street appeal and kerb impact",
        keywords: ["kerb", "curb", "street", "front", "garden", "exterior"],
      },
    ],
  },
  {
    id: "commercial",
    name: "Commercial Property Check",
    description: "Essential due diligence for commercial investments",
    icon: "Building",
    checklist: [
      {
        id: "rates",
        label: "Business rates and tenure",
        keywords: ["rates", "business", "freehold", "leasehold", "tenure"],
      },
      {
        id: "access",
        label: "Access and loading facilities",
        keywords: ["access", "loading", "delivery", "entrance", "ramp"],
      },
      {
        id: "parking",
        label: "Parking provision",
        keywords: ["parking", "car park", "spaces", "vehicle"],
      },
      {
        id: "visibility",
        label: "Visibility and footfall",
        keywords: ["footfall", "visibility", "traffic", "passing", "high street"],
      },
      {
        id: "neighbors",
        label: "Neighboring businesses",
        keywords: ["neighbor", "next door", "adjacent", "retail", "shop"],
      },
      {
        id: "planning",
        label: "Planning use class",
        keywords: ["planning", "use class", "permitted", "change of use"],
      },
      {
        id: "lease",
        label: "Lease terms and covenants",
        keywords: ["lease", "covenant", "term", "break clause", "rent review"],
      },
    ],
  },
  {
    id: "newbuild",
    name: "New Build Snagging",
    description: "Quality check for new build purchases",
    icon: "CheckSquare",
    checklist: [
      {
        id: "warranty",
        label: "NHBC certificate and warranties",
        keywords: ["nhbc", "warranty", "certificate", "guarantee", "cover"],
      },
      {
        id: "finish",
        label: "Finish quality (paintwork, tiling)",
        keywords: ["paint", "tile", "finish", "quality", "shoddy", "poor"],
      },
      {
        id: "doors-windows",
        label: "Door and window operation",
        keywords: ["door", "window", "open", "close", "stuck", "stiff"],
      },
      {
        id: "heating",
        label: "Heating system functionality",
        keywords: ["heating", "boiler", "radiator", "thermostat", "warm"],
      },
      {
        id: "defects",
        label: "Any visible defects",
        keywords: ["defect", "damage", "scratch", "chip", "crack", "issue"],
      },
      {
        id: "outdoor",
        label: "Outdoor space and boundaries",
        keywords: ["garden", "fence", "boundary", "patio", "turf", "outdoor"],
      },
      {
        id: "developer",
        label: "Developer reputation",
        keywords: ["developer", "builder", "reputation", "reviews", "quality"],
      },
    ],
  },
];

export function detectCheckedItems(
  transcript: string,
  template: ViewingTemplate
): string[] {
  const lowerTranscript = transcript.toLowerCase();
  const checkedItems: string[] = [];

  template.checklist.forEach((item) => {
    const hasMatch = item.keywords.some((keyword) =>
      lowerTranscript.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      checkedItems.push(item.id);
    }
  });

  return checkedItems;
}
