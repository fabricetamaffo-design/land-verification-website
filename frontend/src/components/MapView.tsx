import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type LandStatus = 'VALID' | 'SUSPICIOUS' | 'DUPLICATE';

export interface MapViewProps {
  lat: number;
  lng: number;
  title: string;
  titleNumber?: string;
  ownerName?: string;
  quarter?: string;
  areaSqm?: number;
  status?: LandStatus;
}

const STREET_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

const SATELLITE_LAYER = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
};

function statusColor(status?: LandStatus) {
  if (status === 'SUSPICIOUS') return { pin: '#d97706', ring: 'rgba(217,119,6,0.2)', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
  if (status === 'DUPLICATE')  return { pin: '#dc2626', ring: 'rgba(220,38,38,0.2)',  badge: 'bg-red-50 text-red-700 border-red-200',     dot: 'bg-red-500' };
  return { pin: '#16a34a', ring: 'rgba(22,163,74,0.2)', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
}

function createMarkerIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;width:40px;">
        <div style="
          width:40px;height:40px;
          background:linear-gradient(145deg,${color},${color}dd);
          border-radius:50% 50% 50% 4px;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 6px 20px ${color}66, 0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
        ">
          <svg style="transform:rotate(45deg);width:18px;height:18px;" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="width:2px;height:6px;background:${color};opacity:0.7;margin-top:-1px;border-radius:0 0 2px 2px;"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -54],
  });
}

export default function MapView({ lat, lng, title, titleNumber, ownerName, quarter, areaSqm, status }: MapViewProps) {
  const [layer, setLayer] = useState<'street' | 'satellite'>('street');
  const [copied, setCopied] = useState(false);
  const colors = statusColor(status);
  const markerIcon = createMarkerIcon(colors.pin);
  const tileLayer = layer === 'street' ? STREET_LAYER : SATELLITE_LAYER;

  const copyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100">

      {/* ── Layer toggle ── */}
      <div className="absolute top-3 right-3 z-[1000] flex rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        <button
          onClick={() => setLayer('street')}
          className={`px-3 py-1.5 text-xs font-bold transition-colors ${layer === 'street' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Street
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={() => setLayer('satellite')}
          className={`px-3 py-1.5 text-xs font-bold transition-colors ${layer === 'satellite' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Satellite
        </button>
      </div>

      {/* ── Parcel info card ── */}
      {titleNumber && (
        <div className="absolute bottom-9 left-3 z-[1000] bg-white/96 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 px-3.5 py-3 max-w-[210px]">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Land Parcel</p>
          <p className="text-sm font-black text-gray-900 truncate leading-tight">{titleNumber}</p>
          {ownerName && <p className="text-xs text-gray-600 truncate mt-0.5">{ownerName}</p>}
          {quarter && <p className="text-xs text-gray-400 truncate">{quarter}</p>}
          {areaSqm != null && (
            <p className="text-xs font-semibold text-green-700 mt-1">{areaSqm.toLocaleString()} m²</p>
          )}
          {status && (
            <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              {status}
            </span>
          )}
        </div>
      )}

      {/* ── Coordinates copy button ── */}
      <div className="absolute bottom-9 right-3 z-[1000]">
        <button
          onClick={copyCoords}
          title="Copy coordinates"
          className="bg-white/96 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-green-700 hover:border-green-200 transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
            </>
          )}
        </button>
      </div>

      {/* ── Map ── */}
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        className="h-52 sm:h-80 md:h-[420px] w-full"
        scrollWheelZoom={false}
        zoomControl
      >
        <TileLayer
          key={layer}
          url={tileLayer.url}
          attribution={tileLayer.attribution}
          maxZoom={20}
        />

        {/* Accuracy ring */}
        <Circle
          center={[lat, lng]}
          radius={18}
          pathOptions={{
            color: colors.pin,
            fillColor: colors.pin,
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '4 3',
          }}
        />

        {/* Outer glow ring */}
        <Circle
          center={[lat, lng]}
          radius={40}
          pathOptions={{
            color: colors.pin,
            fillColor: colors.pin,
            fillOpacity: 0.05,
            weight: 1,
          }}
        />

        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup maxWidth={240}>
            <div style={{ fontFamily: 'inherit', padding: '4px 2px' }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: '#111827', marginBottom: 4, lineHeight: 1.3 }}>{title}</p>
              {quarter && <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>{quarter}</p>}
              {areaSqm != null && (
                <p style={{ fontSize: 11, fontWeight: 600, color: '#16a34a' }}>{areaSqm.toLocaleString()} m²</p>
              )}
              <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 6, fontFamily: 'monospace' }}>
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>

        <ScaleControl position="bottomleft" imperial={false} />
      </MapContainer>
    </div>
  );
}
