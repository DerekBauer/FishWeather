
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherAndMoonData } from './services/geminiService';
import { WeatherData, GeolocationState } from './types';
import { MetricCard } from './components/MetricCard';
import { MoonVisual } from './components/MoonVisual';
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
  Waves
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
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-slate-400 animate-pulse">Syncing with atmospheric sensors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={handleGetCurrentLocation}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">{data.locationName}</span>
                </div>
                <h2 className="text-5xl font-bold tracking-tight text-white mb-2">
                  {data.temperature}°<span className="text-3xl text-slate-500">F</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-white/10">{data.condition}</span>
                  <span className="text-slate-500 text-sm">Last updated: {data.timestamp}</span>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <MoonVisual phase={data.moonData.phase} illumination={data.moonData.illumination} />
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                label="Pressure" 
                value={data.pressure} 
                unit="inHg" 
                trend={data.pressureTrend}
                icon={<Wind className="w-5 h-5" />} 
                description="Atmospheric weight (inches of mercury)."
              />
              <MetricCard 
                label="Humidity" 
                value={data.humidity} 
                unit="%" 
                icon={<Droplets className="w-5 h-5" />} 
                description="Concentration of water vapor."
              />
              <MetricCard 
                label="Moon Azimuth" 
                value={data.moonData.azimuth} 
                unit="°" 
                icon={<Compass className="w-5 h-5" />} 
                description="Horizontal angular distance."
              />
              <MetricCard 
                label="Moon Altitude" 
                value={data.moonData.altitude} 
                unit="°" 
                icon={<Navigation className="w-5 h-5" />} 
                description="Vertical angle above horizon."
              />
            </section>

            {/* Solunar / Fishing Activity Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Fish className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Solunar Fishing Activity</h3>
                </div>
                <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${getRatingColor(data.fishingTimes.rating)}`}>
                  {data.fishingTimes.rating} Rating
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4" /> Major Periods
                  </h4>
                  <div className="space-y-2">
                    {data.fishingTimes.majors.map((time, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm">Period {i + 1}</span>
                        <span className="text-white font-mono font-bold">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4 opacity-70" /> Minor Periods
                  </h4>
                  <div className="space-y-2">
                    {data.fishingTimes.minors.map((time, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm">Period {i + 1}</span>
                        <span className="text-white font-mono font-bold">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Moonrise</h4>
                    <p className="text-2xl font-bold text-white">{data.moonData.moonrise}</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Moonset</h4>
                    <p className="text-2xl font-bold text-white">{data.moonData.moonset}</p>
                  </div>
                </div>
              </div>
            </section>

            {data.sources && data.sources.length > 0 && (
              <section className="pt-8 border-t border-white/5">
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Verify Search Sources
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center gap-2"
                    >
                      {source.title.slice(0, 30)}...
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 py-4 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
          Powered by Gemini 3 Flash & Search Grounding
        </p>
      </footer>
    </div>
  );
};

export default App;
