
export interface TideEvent {
  type: 'High' | 'Low';
  time: string;
  height: string;
}

export interface WeatherData {
  locationName: string;
  temperature: number; // in Fahrenheit
  humidity: number; // percentage
  pressure: number; // in inHg (inches of mercury)
  pressureTrend: 'rising' | 'falling' | 'steady';
  condition: string;
  timestamp: string;
  moonData: {
    phase: string;
    illumination: number; // percentage
    azimuth: number; // degrees
    altitude: number; // degrees
    moonrise: string;
    moonset: string;
  };
  windData: {
    speed: number; // mph
    gust: number; // mph
    direction: number; // degrees
    cardinal: string; // e.g., "NNE"
  };
  fishingTimes: {
    majors: string[]; // List of major activity periods
    minors: string[]; // List of minor activity periods
    rating: string; // Excellent, Good, Fair, Poor
  };
  tideData?: {
    station: string;
    events: TideEvent[];
  };
  sources: Array<{ title: string; uri: string }>;
}

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  zip: string | null;
  error: string | null;
  loading: boolean;
}
