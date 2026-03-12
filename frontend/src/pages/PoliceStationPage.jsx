// PoliceStationPage.jsx — Nearest Police Stations + Google Maps Routing
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Search, Loader2, AlertTriangle, ExternalLink, Map } from 'lucide-react';
import { findPoliceStations } from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';


const G = '#c9a84c', MUTED = '#6b6880', TEXT = '#e8e4d8', DANGER = '#e85c5c', GREEN = '#4ade80';

export default function PoliceStationPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [searched, setSearched] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [mapStation, setMapStation] = useState(null);

  // Auto-get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const find = async (q) => {
    const query = q || input.trim();
    if (!query) { toast.error('Enter a pincode or area name'); return; }
    setLoading(true); setStations([]); setMapStation(null);
    try {
      const data = await findPoliceStations(query);
      setStations(data.stations || []);
      setSearched(query);
      if ((data.stations || []).length === 0) toast.error('No stations found. Try a different area.');
    } catch (e) {
      toast.error('Could not find stations. Please try again.');
    } finally { setLoading(false); }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast('Getting your location...', { icon: '📍' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        const loc = `${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`;
        setInput(loc);
        find(loc);
      },
      (err) => toast.error('Location denied. Please enter your area manually.')
    );
  };

  // Build Google Maps directions URL — uses real lat/lon if available
  const getDirectionsUrl = (station) => {
    const dest = station.lat && station.lon
      ? `${station.lat},${station.lon}`
      : encodeURIComponent((station.address || station.name) + ' police station India');
    if (userCoords) {
      return `https://www.google.com/maps/dir/${userCoords.lat},${userCoords.lng}/${dest}`;
    }
    return `https://www.google.com/maps/search/${dest}`;
  };

  // Build embedded map URL — uses real lat/lon if available
  const getMapEmbedUrl = (station) => {
    if (station.lat && station.lon) {
      return `https://maps.google.com/maps?q=${station.lat},${station.lon}&output=embed&z=16`;
    }
    const q = encodeURIComponent((station.address || station.name) + ' police station');
    return `https://maps.google.com/maps?q=${q}&output=embed&z=15`;
  };

  // Google Maps area search URL
  const getAreaMapUrl = () => {
    if (userCoords) return `https://www.google.com/maps/search/police+station/@${userCoords.lat},${userCoords.lng},14z`;
    return `https://www.google.com/maps/search/police+station+${encodeURIComponent(searched)}`;
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <PageHeader icon="🚔" title="Find Police Station" subtitle="Locate nearest stations by pincode or area with directions" />

      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
        🚔 Find Nearest Police Station
      </h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>
        Enter pincode or area — get stations with <strong style={{ color: G }}>route directions</strong> from your location
      </p>

      {/* Info Banner */}
      <div style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'rgba(232,228,216,0.8)', lineHeight: 1.65 }}>
        📍 Enter pincode (e.g. <strong>400001</strong>) or area (e.g. <strong>Koramangala Bangalore</strong>). Click <strong style={{ color: G }}>Get Route</strong> on any station for turn-by-turn directions.
        {userCoords && <span style={{ color: GREEN }}> ✓ Your location detected — routes will start from your current position.</span>}
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && find()}
          placeholder="e.g. 600001  or  Andheri Mumbai"
          style={{ flex: 1, minWidth: 200, background: '#111120', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: TEXT, fontFamily: 'DM Sans,sans-serif', fontSize: 14, padding: '11px 14px', outline: 'none' }}
        />
        <button onClick={() => find()} disabled={loading}
          style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0a0808', border: 'none', cursor: 'pointer', padding: '11px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 size={15} style={{ animation: 'spin .8s linear infinite' }} /> : <Search size={15} />}
          {loading ? 'Searching...' : 'Find Stations'}
        </button>
        <button onClick={useMyLocation}
          style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: TEXT, cursor: 'pointer', padding: '11px 16px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Navigation size={14} color={G} /> Use My Location
        </button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: MUTED }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: G, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
          Searching police stations near "{input}"...
        </div>
      )}

      {/* Results */}
      {stations.length > 0 && (
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 13, color: MUTED }}>
              <strong style={{ color: TEXT }}>{stations.length} stations</strong> near <strong style={{ color: G }}>{searched}</strong>
            </div>
            <a href={getAreaMapUrl()} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: G, textDecoration: 'none', border: '1px solid rgba(201,168,76,0.25)', padding: '5px 12px', borderRadius: 8 }}>
              <Map size={13} /> View All on Google Maps <ExternalLink size={11} />
            </a>
          </div>

          {stations.map((s, i) => (
            <div key={i} style={{ background: '#111120', border: `1px solid ${mapStation === i ? G : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '16px 18px', marginBottom: 10, transition: 'all .2s' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚔</div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 3 }}>
                    #{i + 1} {s.name || 'Police Station'}
                  </div>
                  <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 6, lineHeight: 1.6 }}>
                    <MapPin size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {s.address || 'Address not available'}
                  </div>
                  {s.jurisdiction && (
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>
                      Jurisdiction: {s.jurisdiction}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: GREEN, fontFamily: 'JetBrains Mono,monospace', background: 'rgba(74,222,128,0.08)', padding: '2px 8px', borderRadius: 6 }}>
                      ~{s.distance || 'nearby'}
                    </span>
                    {s.phone && s.phone !== 'unknown' && (
                      <a href={`tel:${s.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: G, textDecoration: 'none' }}>
                        <Phone size={11} /> {s.phone}
                      </a>
                    )}
                    {s.type && (
                      <span style={{ fontSize: 11, color: MUTED }}>{s.type}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
                  <a
                    href={getDirectionsUrl(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0a0808', padding: '8px 14px', borderRadius: 9, fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    <Navigation size={13} /> Get Route
                  </a>
                  <button
                    onClick={() => setMapStation(mapStation === i ? null : i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: TEXT, padding: '7px 14px', borderRadius: 9, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Map size={13} /> {mapStation === i ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>
              </div>

              {/* Embedded Map */}
              {mapStation === i && (
                <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <iframe
                    title={`Map - ${s.name}`}
                    src={getMapEmbedUrl(s)}
                    width="100%"
                    height="300"
                    style={{ display: 'block', border: 'none' }}
                    loading="lazy"
                    allowFullScreen
                  />
                  <div style={{ background: '#111120', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: MUTED }}>{s.address}</span>
                    <a href={getDirectionsUrl(s)} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: G, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ExternalLink size={11} /> Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Emergency Footer */}
          <div style={{ background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.2)', borderRadius: 10, padding: '13px 16px', marginTop: 6, fontSize: 13 }}>
            <AlertTriangle size={13} style={{ color: DANGER, marginRight: 6, verticalAlign: 'middle' }} />
            <strong style={{ color: DANGER }}>Emergency?</strong> Call{' '}
            <a href="tel:100" style={{ color: DANGER, fontWeight: 700, textDecoration: 'none' }}>100 (Police)</a> or{' '}
            <a href="tel:112" style={{ color: DANGER, fontWeight: 700, textDecoration: 'none' }}>112 (National Emergency)</a> immediately. Don't wait.
          </div>
        </div>
      )}
    </div>
  );
}
