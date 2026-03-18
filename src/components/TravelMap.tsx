import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix default marker icons in leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Simple geocoding lookup for demo purposes
const LOCATION_COORDS: Record<string, [number, number]> = {
  // Peru
  Cusco: [-13.53, -71.97],
  'Sacred Valley': [-13.33, -72.15],
  Ollantaytambo: [-13.26, -72.26],
  Chinchero: [-13.39, -72.05],
  Maras: [-13.36, -72.16],
  // Uzbekistan
  Tashkent: [41.3, 69.28],
  Samarkand: [39.65, 66.96],
  Bukhara: [39.77, 64.42],
  Khiva: [41.38, 60.36],
  // Spain
  'San Sebastián': [43.32, -1.98],
  Bilbao: [43.26, -2.93],
  Rioja: [42.29, -2.5],
  Pamplona: [42.81, -1.64],
  Burgos: [42.34, -3.7],
  // East Africa
  Nairobi: [-1.29, 36.82],
  'Lake Nakuru': [-0.37, 36.09],
  Serengeti: [-2.33, 34.83],
  Ngorongoro: [-3.24, 35.49],
  Arusha: [-3.39, 36.68],
  // Vietnam / Cambodia
  'Ho Chi Minh City': [10.82, 106.63],
  'Can Tho': [10.04, 105.77],
  'Chau Doc': [10.7, 105.12],
  'Phnom Penh': [11.56, 104.92],
  'Siem Reap': [13.36, 103.86],
  // Countries (for member maps)
  Peru: [-9.19, -75.02],
  Colombia: [4.57, -74.3],
  Ecuador: [-1.83, -78.18],
  Bolivia: [-16.29, -63.59],
  Thailand: [15.87, 100.99],
  Vietnam: [14.06, 108.28],
  Cambodia: [12.57, 104.99],
  Laos: [19.86, 102.5],
  Myanmar: [21.91, 95.96],
  Indonesia: [-0.79, 113.92],
  Georgia: [42.32, 43.36],
  Armenia: [40.07, 45.04],
  Azerbaijan: [40.14, 47.58],
  Uzbekistan: [41.38, 64.59],
  Kyrgyzstan: [41.2, 74.77],
  Kazakhstan: [48.02, 66.92],
  Tajikistan: [38.86, 71.28],
  Turkey: [38.96, 35.24],
  Iran: [32.43, 53.69],
  Japan: [36.2, 138.25],
  'South Korea': [35.91, 127.77],
  Taiwan: [23.7, 120.96],
  Italy: [41.87, 12.57],
  Spain: [40.46, -3.75],
  Greece: [39.07, 21.82],
  Morocco: [31.79, -7.09],
  Portugal: [39.4, -8.22],
  France: [46.23, 2.21],
  Kenya: [-0.02, 37.91],
  Tanzania: [-6.37, 34.89],
  Uganda: [1.37, 32.29],
  Rwanda: [-1.94, 29.87],
  Ethiopia: [9.15, 40.49],
  Malawi: [-13.25, 34.3],
  Mozambique: [-18.67, 35.53],
  Madagascar: [-18.77, 46.87],
};

function getCoords(location: string): [number, number] | null {
  return LOCATION_COORDS[location] || null;
}

interface TripRouteMapProps {
  locations: string[];
  height?: string;
}

export const TripRouteMap = ({
  locations,
  height = '280px',
}: TripRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const points = locations
    .map((loc) => ({ name: loc, coords: getCoords(loc) }))
    .filter((p) => p.coords !== null) as {
    name: string;
    coords: [number, number];
  }[];

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    });

    const bounds = L.latLngBounds(points.map((p) => p.coords));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    points.forEach((p) => {
      L.marker(p.coords)
        .addTo(map)
        .bindPopup(
          `<span style="font-size:12px;font-weight:500">${p.name}</span>`
        );
    });

    if (points.length > 1) {
      L.polyline(
        points.map((p) => p.coords),
        { color: 'hsl(38, 92%, 50%)', weight: 3, dashArray: '8, 6' }
      ).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations.join(',')]);

  if (points.length === 0) {
    return (
      <div
        className="bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        No geographic data available
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="rounded-md overflow-hidden border border-border"
    />
  );
};

interface MemberTravelMapProps {
  countries: string[];
  height?: string;
}

export const MemberTravelMap = ({
  countries,
  height = '300px',
}: MemberTravelMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const points = countries
    .map((c) => ({ name: c, coords: getCoords(c) }))
    .filter((p) => p.coords !== null) as {
    name: string;
    coords: [number, number];
  }[];

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if (points.length === 0) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    });

    const bounds = L.latLngBounds(points.map((p) => p.coords));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    points.forEach((p) => {
      L.marker(p.coords)
        .addTo(map)
        .bindPopup(
          `<span style="font-size:12px;font-weight:500">${p.name}</span>`
        );
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [countries.join(',')]);

  if (points.length === 0) {
    return (
      <div
        className="bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        No geographic data available
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="rounded-md overflow-hidden border border-border"
    />
  );
};
