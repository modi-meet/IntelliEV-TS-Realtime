import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Coords {
  lat: number;
  lng: number;
}

interface RecenterAutomaticallyProps {
  lat: number;
  lng: number;
}

const RecenterAutomatically = ({ lat, lng }: RecenterAutomaticallyProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  
  return null;
};

interface RoutingControlProps {
  start: Coords;
  end: Coords;
}

const RoutingControl = ({ start, end }: RoutingControlProps) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!start || !end) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", opacity: 0.6, weight: 4 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);

  return null;
};

// Custom marker icons
const createChargingIcon = () => L.divIcon({
  className: 'custom-charging-marker',
  html: `<div style="background-color: #22c55e; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">⚡</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const createUserIcon = () => L.divIcon({
  className: 'custom-user-marker',
  html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(239,68,68,0.5); animation: pulse 2s infinite;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const createNearbyEVIcon = () => L.divIcon({
  className: 'custom-ev-marker',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(59,130,246,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  description: string;
}

interface EVData {
  lat: number;
  lng: number;
  regNumber: string;
  battery: number;
}

interface TrafficSignal {
  name: string;
  coords: Coords;
  state: string;
}

interface AmbulanceStatus {
  id: string;
  status: string;
  eta: number;
}

interface MapComponentProps {
  userLocation: Coords | null;
  markers: MarkerData[];
  nearbyEVs: EVData[];
  trafficSignals: TrafficSignal[];
  destination: Coords | null;
  onCloseNavigation: () => void;
  ambulanceStatus: AmbulanceStatus | null;
}

const MapComponent = ({ userLocation, markers, nearbyEVs, trafficSignals, destination, onCloseNavigation, ambulanceStatus }: MapComponentProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (userLocation) {
      setPosition([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  if (!position) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 relative z-0">
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={position[0]} lng={position[1]} />
        
        {/* User Marker (Red) */}
        <Marker position={position} icon={createUserIcon()}>
          <Popup>
            <strong>You are here</strong><br/>
            Your current location
          </Popup>
        </Marker>

        {/* Charging Stations (Green) */}
        {markers && markers.filter(m => m.title.toLowerCase().includes('charging')).map((marker, idx) => (
          <Marker key={`charging-${idx}`} position={[marker.lat, marker.lng]} icon={createChargingIcon()}>
            <Popup>
              <strong>{marker.title}</strong>
              <div dangerouslySetInnerHTML={{ __html: marker.description }} />
            </Popup>
          </Marker>
        ))}

        {/* Other Markers (Hospitals, etc.) */}
        {markers && markers.filter(m => !m.title.toLowerCase().includes('charging')).map((marker, idx) => (
          <Marker key={`other-${idx}`} position={[marker.lat, marker.lng]} icon={DefaultIcon}>
            <Popup>
              <strong>{marker.title}</strong>
              <div dangerouslySetInnerHTML={{ __html: marker.description }} />
            </Popup>
          </Marker>
        ))}

        {/* Nearby EVs (Blue markers) */}
        {nearbyEVs && nearbyEVs.map((ev, idx) => (
          <Marker key={`ev-${idx}`} position={[ev.lat, ev.lng]} icon={createNearbyEVIcon()}>
            <Popup>
              <strong>EV: {ev.regNumber}</strong><br/>
              Battery: {ev.battery}%
            </Popup>
          </Marker>
        ))}

        {/* Traffic Signals */}
        {trafficSignals && trafficSignals.map((signal, idx) => (
            <Marker 
                key={`signal-${idx}`} 
                position={[signal.coords.lat, signal.coords.lng]}
                icon={L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-color: ${signal.state === 'red' ? '#ef4444' : signal.state === 'yellow' ? '#f59e0b' : '#22c55e'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`
                })}
            >
                <Popup>
                    <strong>{signal.name}</strong><br/>
                    Status: {signal.state.toUpperCase()}
                </Popup>
            </Marker>
        ))}

        {/* Routing */}
        {destination && userLocation && (
            <RoutingControl start={userLocation} end={destination} />
        )}

      </MapContainer>

      {/* Close Navigation Button Overlay */}
      {destination && (
        <button
            onClick={onCloseNavigation}
            className="absolute top-4 right-4 z-[1000] bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-lg"
        >
            Close Navigation
        </button>
      )}

      {/* Ambulance Tracking Card Overlay */}
      {ambulanceStatus && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl z-[1000] w-64 border-2 border-blue-500">
            <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <i className="fas fa-truck-medical"></i>Ambulance Dispatched!
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              ID: <span className="font-semibold">{ambulanceStatus.id}</span>
            </p>
            <p className="text-sm text-gray-700">
              Status: <span className="font-semibold">{ambulanceStatus.status}</span>
            </p>
            <p className="text-sm text-gray-700">
              ETA: <span className="font-semibold">{ambulanceStatus.eta} min</span>
            </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
