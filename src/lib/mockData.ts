export interface TripClassification {
  label: string;
  value: string;
}

export const TRIP_CLASSIFICATIONS: TripClassification[] = [
  { label: 'Community-based Tourism', value: 'community' },
  { label: 'Ecotourism', value: 'eco' },
  { label: 'Adventure Tourism', value: 'adventure' },
  { label: 'Cultural Tourism', value: 'cultural' },
  { label: 'Sustainable Tourism', value: 'sustainable' },
  { label: 'Heritage Tourism', value: 'heritage' },
  { label: 'Gastronomy Tourism', value: 'gastronomy' },
  { label: 'Wellness Tourism', value: 'wellness' },
  { label: 'Educational Tourism', value: 'educational' },
  { label: 'Rural Tourism', value: 'rural' },
  { label: 'Agritourism', value: 'agri' },
  { label: 'Archaeological Tourism', value: 'archaeological' },
  { label: 'Art Tourism', value: 'art' },
  { label: 'Astronomy Tourism', value: 'astronomy' },
  { label: 'Bicycle Tourism', value: 'bicycle' },
  { label: 'Bird Watching Tourism', value: 'birdwatching' },
  { label: 'Business Tourism', value: 'business' },
  { label: 'Cave Tourism', value: 'cave' },
  { label: 'Charity Tourism', value: 'charity' },
  { label: 'Coastal Tourism', value: 'coastal' },
  { label: 'Creative Tourism', value: 'creative' },
  { label: 'Cruise Tourism', value: 'cruise' },
  { label: 'Dark Tourism', value: 'dark' },
  { label: 'Desert Tourism', value: 'desert' },
  { label: 'Diaspora Tourism', value: 'diaspora' },
  { label: 'Disaster Tourism', value: 'disaster' },
  { label: 'Diving Tourism', value: 'diving' },
  { label: 'Extreme Tourism', value: 'extreme' },
  { label: 'Faith Tourism', value: 'faith' },
  { label: 'Film Tourism', value: 'film' },
  { label: 'Fishing Tourism', value: 'fishing' },
  { label: 'Geo Tourism', value: 'geo' },
  { label: 'Glamping Tourism', value: 'glamping' },
  { label: 'Golf Tourism', value: 'golf' },
  { label: 'Health Tourism', value: 'health' },
  { label: 'Hiking Tourism', value: 'hiking' },
  { label: 'Historical Tourism', value: 'historical' },
  { label: 'Hunting Tourism', value: 'hunting' },
  { label: 'Indigenous Tourism', value: 'indigenous' },
  { label: 'Island Tourism', value: 'island' },
  { label: 'Jungle Tourism', value: 'jungle' },
  { label: 'Luxury Tourism', value: 'luxury' },
  { label: 'Maritime Tourism', value: 'maritime' },
  { label: 'Medical Tourism', value: 'medical' },
  { label: 'Military Tourism', value: 'military' },
  { label: 'Mountain Tourism', value: 'mountain' },
  { label: 'Music Tourism', value: 'music' },
  { label: 'Nautical Tourism', value: 'nautical' },
  { label: 'Nomadic Tourism', value: 'nomadic' },
  { label: 'Overland Tourism', value: 'overland' },
  { label: 'Photography Tourism', value: 'photography' },
  { label: 'Pilgrimage Tourism', value: 'pilgrimage' },
  { label: 'Polar Tourism', value: 'polar' },
  { label: 'Railway Tourism', value: 'railway' },
  { label: 'Regenerative Tourism', value: 'regenerative' },
  { label: 'Religious Tourism', value: 'religious' },
  { label: 'River Tourism', value: 'river' },
  { label: 'Safari Tourism', value: 'safari' },
  { label: 'Slow Tourism', value: 'slow' },
  { label: 'Space Tourism', value: 'space' },
  { label: 'Sports Tourism', value: 'sports' },
  { label: 'Urban Tourism', value: 'urban' },
  { label: 'Volunteer Tourism', value: 'volunteer' },
  { label: 'War Tourism', value: 'war' },
  { label: 'Wildlife Tourism', value: 'wildlife' },
  { label: 'Wine Tourism', value: 'wine' },
  { label: 'Winter Tourism', value: 'winter' },
];

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  locations: string[];
  attractions: string[];
  activities: string[];
  notes: string;
}

export interface Accommodation {
  name: string;
  location: string;
  nights: number;
  url?: string;
}

export interface ExternalReference {
  label: string;
  url: string;
  category: 'attraction' | 'accommodation' | 'transportation' | 'resource';
}

export interface Trip {
  id: string;
  title: string;
  memberId: string;
  memberName: string;
  countries: string[];
  locations: string[];
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  currency: string;
  classifications: string[];
  transport: string[];
  description: string;
  itinerary: ItineraryDay[];
  accommodations: Accommodation[];
  references: ExternalReference[];
  views: number;
  source?: 'user' | 'ai';
}

export interface Member {
  id: string;
  fullName: string;
  description: string;
  countriesVisited: string[];
  classifications: string[]; // up to 6
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tripCount: number;
  joinedDate: string;
  consultancyAvailable: boolean;
  consultancyType: 'free' | 'paid' | 'both';
  consultancyRate?: number;
  consultancyCurrency: string;
  consultancyDescription?: string;
  avatarUrl?: string;
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'm1',
    fullName: 'Dr. Helena Vasquez',
    description:
      'Independent travel researcher with over 15 years of experience documenting sustainable tourism practices across South America and Southeast Asia. Specializes in community-based tourism assessment and ecotourism development frameworks.',
    countriesVisited: [
      'Peru',
      'Colombia',
      'Ecuador',
      'Bolivia',
      'Thailand',
      'Vietnam',
      'Cambodia',
      'Laos',
      'Myanmar',
      'Indonesia',
    ],
    classifications: [
      'community',
      'sustainable',
      'eco',
      'cultural',
      'educational',
      'rural',
    ],
    contactEmail: 'h.vasquez@travelresearch.org',
    tripCount: 24,
    joinedDate: '2023-03-15',
    consultancyAvailable: true,
    consultancyType: 'both',
    consultancyRate: 45,
    consultancyCurrency: 'USD',
    consultancyDescription:
      'Available for consultations on community-based tourism planning and sustainable travel itineraries in South America and Southeast Asia.',
  },
  {
    id: 'm2',
    fullName: 'James Worthington',
    description:
      'Former diplomatic attaché and cultural heritage consultant. Extensive travel documentation across Central Asia and the Caucasus region, with a focus on Silk Road heritage sites and traditional craftsmanship.',
    countriesVisited: [
      'Georgia',
      'Armenia',
      'Azerbaijan',
      'Uzbekistan',
      'Kyrgyzstan',
      'Kazakhstan',
      'Tajikistan',
      'Turkey',
      'Iran',
    ],
    classifications: ['heritage', 'cultural', 'educational'],
    contactEmail: 'j.worthington@heritage.net',
    tripCount: 18,
    joinedDate: '2023-06-22',
    consultancyAvailable: true,
    consultancyType: 'paid',
    consultancyRate: 80,
    consultancyCurrency: 'EUR',
    consultancyDescription:
      'Expert guidance on heritage site itineraries along the Silk Road and Caucasus regions. Available for detailed trip planning sessions.',
  },
  {
    id: 'm3',
    fullName: 'Akiko Tanaka',
    description:
      'Gastronomy tourism specialist and culinary anthropologist. Documents food traditions, local markets, and culinary heritage across East Asia and the Mediterranean. Published author on sustainable food tourism.',
    countriesVisited: [
      'Japan',
      'South Korea',
      'Taiwan',
      'Italy',
      'Spain',
      'Greece',
      'Morocco',
      'Portugal',
      'France',
    ],
    classifications: ['gastronomy', 'cultural', 'sustainable', 'heritage'],
    contactEmail: 'a.tanaka@culinaryheritage.jp',
    tripCount: 31,
    joinedDate: '2022-11-08',
    consultancyAvailable: true,
    consultancyType: 'free',
    consultancyCurrency: 'USD',
    consultancyDescription:
      'Happy to share recommendations on culinary travel planning across East Asia and the Mediterranean at no charge.',
  },
  {
    id: 'm4',
    fullName: 'Marcus Okafor',
    description:
      'Adventure tourism planner and wilderness guide with certifications in mountaineering and river navigation. Focuses on documenting off-grid travel routes and adventure logistics across East Africa.',
    countriesVisited: [
      'Kenya',
      'Tanzania',
      'Uganda',
      'Rwanda',
      'Ethiopia',
      'Malawi',
      'Mozambique',
      'Madagascar',
    ],
    classifications: ['adventure', 'eco', 'sustainable', 'rural'],
    contactEmail: 'm.okafor@adventureplanning.co',
    tripCount: 15,
    joinedDate: '2024-01-10',
    consultancyAvailable: false,
    consultancyType: 'free',
    consultancyCurrency: 'USD',
  },
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    title: 'Sustainable Communities of the Peruvian Highlands',
    memberId: 'm1',
    memberName: 'Dr. Helena Vasquez',
    countries: ['Peru'],
    locations: [
      'Cusco',
      'Sacred Valley',
      'Ollantaytambo',
      'Chinchero',
      'Maras',
    ],
    startDate: '2025-04-12',
    endDate: '2025-04-26',
    totalDays: 14,
    totalCost: 2800,
    currency: 'USD',
    classifications: ['community', 'sustainable', 'cultural'],
    transport: ['Bus/Coach', 'Walking', 'Local Community Transport'],
    description:
      'A structured exploration of community-based tourism initiatives across the Peruvian highlands. This trip documented cooperative tourism models in Quechua-speaking communities near Cusco, examining how traditional weaving cooperatives, agricultural demonstrations, and homestay programs generate sustainable income while preserving cultural identity. Field assessments were conducted across five communities, evaluating visitor impact, revenue distribution models, and cultural preservation outcomes.',
    itinerary: [
      {
        dayNumber: 1,
        date: '2025-04-12',
        locations: ['Cusco'],
        attractions: ['Plaza de Armas', 'San Pedro Market'],
        activities: ['Arrival and acclimatization', 'Initial market survey'],
        notes: 'Altitude adjustment required.',
      },
      {
        dayNumber: 2,
        date: '2025-04-13',
        locations: ['Cusco'],
        attractions: ['Sacsayhuaman', 'Qenqo'],
        activities: [
          'Archaeological site documentation',
          'Community leader interviews',
        ],
        notes: 'Met with local tourism cooperative director.',
      },
      {
        dayNumber: 3,
        date: '2025-04-14',
        locations: ['Chinchero'],
        attractions: ['Chinchero Weaving Cooperative'],
        activities: [
          'Textile workshop observation',
          'Economic impact assessment',
        ],
        notes: 'Cooperative serves 45 families.',
      },
    ],
    accommodations: [
      {
        name: 'Hotel Monasterio',
        location: 'Cusco',
        nights: 3,
        url: 'https://example.com/monasterio',
      },
      {
        name: 'Community Homestay Chinchero',
        location: 'Chinchero',
        nights: 2,
      },
      {
        name: 'Sonesta Posada del Inca',
        location: 'Sacred Valley',
        nights: 4,
        url: 'https://example.com/sonesta',
      },
    ],
    references: [
      {
        label: 'Chinchero Weaving Cooperative',
        url: 'https://example.com/chinchero',
        category: 'attraction',
      },
      {
        label: 'Sacred Valley Transport Guide',
        url: 'https://example.com/transport',
        category: 'transportation',
      },
    ],
    views: 1842,
  },
  {
    id: 't2',
    title: 'Silk Road Heritage: Uzbekistan Corridor',
    memberId: 'm2',
    memberName: 'James Worthington',
    countries: ['Uzbekistan'],
    locations: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    startDate: '2025-09-01',
    endDate: '2025-09-18',
    totalDays: 17,
    totalCost: 3400,
    currency: 'USD',
    classifications: ['heritage', 'cultural', 'educational'],
    transport: ['Plane', 'Train', 'Car'],
    description:
      "Comprehensive documentation of UNESCO World Heritage sites along the Uzbekistan segment of the ancient Silk Road. This expedition assessed the current state of preservation efforts, recorded architectural details of Islamic golden age structures, and interviewed local historians about ongoing restoration projects. Special attention was given to the madrasas of Samarkand's Registan and the intact medieval trading city of Khiva.",
    itinerary: [
      {
        dayNumber: 1,
        date: '2025-09-01',
        locations: ['Tashkent'],
        attractions: ['Chorsu Bazaar', 'Khast Imam Complex'],
        activities: ['Orientation', 'Market documentation'],
        notes: 'High-speed rail to Samarkand available.',
      },
      {
        dayNumber: 2,
        date: '2025-09-02',
        locations: ['Tashkent'],
        attractions: ['Museum of Applied Arts', 'Amir Timur Museum'],
        activities: ['Museum assessment', 'Historical research'],
        notes: '',
      },
    ],
    accommodations: [
      {
        name: 'Hyatt Regency Tashkent',
        location: 'Tashkent',
        nights: 3,
        url: 'https://example.com/hyatt-tashkent',
      },
      { name: 'Hotel Registan', location: 'Samarkand', nights: 5 },
    ],
    references: [
      {
        label: 'UNESCO Samarkand Heritage',
        url: 'https://example.com/unesco-samarkand',
        category: 'attraction',
      },
    ],
    views: 2310,
  },
  {
    id: 't3',
    title: 'Culinary Heritage Trail: Northern Spain',
    memberId: 'm3',
    memberName: 'Akiko Tanaka',
    countries: ['Spain'],
    locations: ['San Sebastián', 'Bilbao', 'Rioja', 'Pamplona', 'Burgos'],
    startDate: '2025-06-05',
    endDate: '2025-06-16',
    totalDays: 11,
    totalCost: 4200,
    currency: 'USD',
    classifications: ['gastronomy', 'cultural'],
    transport: ['Car', 'Train', 'Walking'],
    description:
      'A structured gastronomy research trip documenting the culinary traditions and modern innovations of the Basque Country, La Rioja, and Navarra regions. Research included pintxos bar mapping in San Sebastián, vineyard documentation in Rioja, and interviews with three Michelin-starred chefs about the relationship between terroir and culinary identity.',
    itinerary: [
      {
        dayNumber: 1,
        date: '2025-06-05',
        locations: ['San Sebastián'],
        attractions: ['La Bretxa Market', 'Old Town Pintxos Route'],
        activities: ['Market survey', 'Pintxos documentation'],
        notes: 'Over 120 pintxos bars in the old town alone.',
      },
    ],
    accommodations: [
      {
        name: 'Hotel Maria Cristina',
        location: 'San Sebastián',
        nights: 4,
        url: 'https://example.com/maria-cristina',
      },
    ],
    references: [],
    views: 3175,
  },
  {
    id: 't4',
    title: 'East African Rift Valley Expedition',
    memberId: 'm4',
    memberName: 'Marcus Okafor',
    countries: ['Kenya', 'Tanzania'],
    locations: ['Nairobi', 'Lake Nakuru', 'Serengeti', 'Ngorongoro', 'Arusha'],
    startDate: '2025-07-10',
    endDate: '2025-07-28',
    totalDays: 18,
    totalCost: 5600,
    currency: 'USD',
    classifications: ['adventure', 'eco', 'sustainable'],
    transport: ['Car', 'Plane', 'Walking'],
    description:
      'A comprehensive adventure logistics documentation covering overland routes through the East African Rift Valley. This expedition mapped practical travel routes between major wildlife conservation areas, assessed camp infrastructure, and documented sustainable safari operator practices across Kenya and Tanzania.',
    itinerary: [
      {
        dayNumber: 1,
        date: '2025-07-10',
        locations: ['Nairobi'],
        attractions: ['Nairobi National Museum'],
        activities: ['Briefing and equipment check'],
        notes: 'Overland departure next morning.',
      },
    ],
    accommodations: [
      {
        name: 'Sarova Stanley',
        location: 'Nairobi',
        nights: 2,
        url: 'https://example.com/sarova',
      },
    ],
    references: [],
    views: 2654,
  },
  {
    id: 't5',
    title: 'Mekong Delta Community Tourism Assessment',
    memberId: 'm1',
    memberName: 'Dr. Helena Vasquez',
    countries: ['Vietnam', 'Cambodia'],
    locations: [
      'Ho Chi Minh City',
      'Can Tho',
      'Chau Doc',
      'Phnom Penh',
      'Siem Reap',
    ],
    startDate: '2025-11-01',
    endDate: '2025-11-20',
    totalDays: 19,
    totalCost: 2100,
    currency: 'USD',
    classifications: ['community', 'eco', 'cultural'],
    transport: ['Boat/Ship', 'Bus/Coach', 'Motorbike'],
    description:
      'Field assessment of community-based tourism programs along the Mekong Delta, evaluating the economic and environmental sustainability of floating market tourism, homestay networks, and cross-border river travel between Vietnam and Cambodia.',
    itinerary: [],
    accommodations: [],
    references: [],
    views: 1520,
  },
];

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCostRange(cost: number): string {
  if (cost < 1000) return 'Under $1,000';
  if (cost < 2500) return '$1,000 – $2,500';
  if (cost < 5000) return '$2,500 – $5,000';
  return '$5,000+';
}

export function getClassificationLabel(value: string): string {
  return TRIP_CLASSIFICATIONS.find((c) => c.value === value)?.label ?? value;
}
