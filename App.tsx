
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherAndMoonData } from './services/geminiService';
import { WeatherData, GeolocationState } from './types';
import { MetricCard } from './components/MetricCard';
import { MoonVisual } from './components/MoonVisual';
import { WindCompass } from './components/WindCompass';
import { TideDisplay } from './components/TideDisplay';
import { MoonSkyLocation } from './components/MoonSkyLocation';
import { PressureHistory } from './components/PressureHistory';
import { 
  Wind, 
  Droplets, 
  Compass, 
  Navigation, 
  Moon, 
  Sun, 
  MapPin, 
  Search, 
  Loader2,
  RefreshCcw,
  ExternalLink,
  Fish,
  Waves,
  Zap,
  Waves as TidesIcon,
  Activity,
  Sunrise,
  Sunset
} from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipInput, setZipInput] = useState('');
  
  const [geo, setGeo] = useState<GeolocationState>({
    lat: null,
    lng: null,
    zip: null,
    error: null,
    loading: false
  });

  const loadData = useCallback(async (location: { lat?: number; lng?: number; zip?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await fetchWeatherAndMoonData(location);
      setData(weather);
    } catch (err: any) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetCurrentLocation = () => {
    setGeo(prev => ({ ...prev, loading: true, error: null }));
    if (!navigator.geolocation) {
      setGeo(prev => ({ ...prev, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeo({ lat: latitude, lng: longitude, zip: null, error: null, loading: false });
        loadData({ lat: latitude, lng: longitude });
      },
      (err) => {
        setGeo(prev => ({ ...prev, loading: false, error: "Location access denied" }));
      }
    );
  };

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim().length >= 5) {
      loadData({ zip: zipInput.trim() });
    }
  };

  useEffect(() => {
    handleGetCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRatingColor = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('excellent')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (r.includes('good')) return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    if (r.includes('fair')) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Lunar Insights
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Weather & Astronomy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleZipSearch} className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Enter Zip Code..." 
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="w-full md:w-48 bg-slate-900/50 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <button 
            onClick={handleGetCurrentLocation}
            className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-full transition-colors border border-indigo-500/20"
            title="Use My Location"
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button 
            onClick={() => data && loadData({ lat: geo.lat || undefined, lng: geo.lng || undefined, zip: geo.zip || undefined })}
            className={`p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-all ${loading ? 'animate-spin' : ''}`}
            disabled={loading}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="relative">
               <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-indigo-400 animate-pulse" />
               </div>
            </div>
            <p className="text-slate-400 animate-pulse font-medium tracking-wide">Calibrating with the cosmos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
            <p className="text-red-400 mb-4 font-medium">{error}</p>
            <button 
              onClick={handleGetCurrentLocation}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-lg shadow-red-500/20"
            >
              Try Again
            </button>
          </div>
        ) : data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Info Section */}
            <section className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch gap-8">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">{data.locationName}</span>
                </div>
                <h2 className="text-6xl font-bold tracking-tight text-white mb-2">
                  {data.temperature}°<span className="text-4xl text-slate-500 font-light">F</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-indigo-500/10 rounded-full text-sm border border-indigo-500/20 text-indigo-200 font-bold">
                    {data.condition}
                  </span>
                  <span className="text-slate-500 text-sm font-mono tracking-tighter">Update: {data.timestamp}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <MoonVisual phase={data.moonData.phase} illumination={data.moonData.illumination} />
                <MoonSkyLocation azimuth={data.moonData.azimuth} altitude={data.moonData.altitude} />
                <WindCompass 
                  direction={data.windData.direction} 
                  cardinal={data.windData.cardinal} 
                  speed={data.windData.speed} 
                  gust={data.windData.gust} 
                />
              </div>
            </section>

            {/* Coastal Tides Section */}
            {data.tideData && (
              <section className="animate-in fade-in duration-1000">
                <TideDisplay station={data.tideData.station} events={data.tideData.events} />
              </section>
            )}

            {/* Pressure History & Core Metrics Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard 
                  label="Barometric Pressure" 
                  value={data.pressure} 
                  unit="inHg" 
                  trend={data.pressureTrend}
                  icon={<Activity className="w-5 h-5" />} 
                  description="Weight of atmospheric column."
                />
                <MetricCard 
                  label="Humidity" 
                  value={data.humidity} 
                  unit="%" 
                  icon={<Droplets className="w-5 h-5" />} 
                  description="Air water vapor concentration."
                />
                <MetricCard 
                  label="Wind Gusts" 
                  value={data.windData.gust} 
                  unit="mph" 
                  icon={<Zap className="w-5 h-5" />} 
                  description="Peak short-duration wind speed."
                />
                <MetricCard 
                  label="Moon Illumination" 
                  value={data.moonData.illumination} 
                  unit="%" 
                  icon={<Moon className="w-5 h-5" />} 
                  description="Percentage of moon visible."
                />
              </div>
              <div>
                <PressureHistory current={data.pressure} history={data.pressureHistory} />
              </div>
            </section>

            {/* Solunar Activity Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Fish className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Solunar Fishing Forecast</h3>
                </div>
                <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${getRatingColor(data.fishingTimes.rating)}`}>
                  {data.fishingTimes.rating}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4" /> Major Feed Periods
                  </h4>
                  <div className="space-y-2">
                    {data.fishingTimes.majors.map((time, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm font-medium">Window {i + 1}</span>
                        <span className="text-white font-mono font-bold tracking-wider">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4 opacity-70" /> Minor Feed Periods
                  </h4>
                  <div className="space-y-2">
                    {data.fishingTimes.minors.map((time, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm font-medium">Window {i + 1}</span>
                        <span className="text-white font-mono font-bold tracking-wider">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Astronomical Events Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Lunar & Solar Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lunar Events */}
                <div className="grid grid-cols-1 gap-4">
                   <div className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-all border-l-4 border-l-indigo-500/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.1)]">
                        <Moon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Moonrise</h4>
                        <p className="text-2xl font-bold text-white tracking-tight">{data.moonData.moonrise}</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-all border-l-4 border-l-indigo-500/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.1)] opacity-70">
                        <Moon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Moonset</h4>
                        <p className="text-2xl font-bold text-white tracking-tight">{data.moonData.moonset}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solar Events */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-all border-l-4 border-l-amber-500/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <Sunrise className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Sunrise</h4>
                        <p className="text-2xl font-bold text-white tracking-tight">{data.sunrise}</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-all border-l-4 border-l-orange-600/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        <Sunset className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Sunset</h4>
                        <p className="text-2xl font-bold text-white tracking-tight">{data.sunset}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sources section */}
            {data.sources && data.sources.length > 0 && (
              <section className="pt-8 border-t border-white/5">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
                  <ExternalLink className="w-3 h-3" /> Data Verification Grounding
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center gap-2 font-bold tracking-tight"
                    >
                      {source.title.length > 30 ? source.title.slice(0, 30) + '...' : source.title}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 py-4 text-center z-50">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
          Precision Weather Analysis • Powered by Gemini 3 Flash
        </p>
      </footer>
    </div>
  );
};

export default App;
