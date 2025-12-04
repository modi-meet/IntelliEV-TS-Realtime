import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Route {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

// Component to handle routing
const RoutingControl = ({ route }: { route: Route | null }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!route) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(route.start.lat, route.start.lng),
        L.latLng(route.end.lat, route.end.lng)
      ],
      createMarker: () => null,
      lineOptions: { styles: [{ color: 'blue', opacity: 0.7, weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, route]);

  return null;
};

const MapFocus = ({ selectedSosAlert }: { selectedSosAlert: any }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedSosAlert && selectedSosAlert.location) {
      map.flyTo([selectedSosAlert.location.lat, selectedSosAlert.location.lng], 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedSosAlert, map]);

  return null;
};

interface EmergencyMapComponentProps {
  sosAlerts: any[];
  ambulances: any[];
  activeRoute: Route | null;
  selectedSosAlert: any;
}

const EmergencyMapComponent = ({ sosAlerts, ambulances, activeRoute, selectedSosAlert }: EmergencyMapComponentProps) => {
  const mapRef = useRef(null);

  // Custom Icons
  const createPulseIcon = (severity: string) => {
    const color = severity === 'High' ? 'bg-red-600' : severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500';
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class='p-2 rounded-full ${color} border-2 border-white shadow-lg animate-pulse flex items-center justify-center w-8 h-8'>
               <svg class='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                 <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'></path>
               </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  const ambulanceIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class='p-2 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center w-8 h-8'>
             <svg class='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
               <path d='M19 13v-2c0-2.21-1.79-4-4-4h-2V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H5c-2.21 0-4 1.79-4 4v2c0 1.66 1.34 3 3 3h1v2c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-2h4v2c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-2h1c1.66 0 3-1.34 3-3zM7 7h6v2H7V7zm1 12H7v-2h2v2zm8 0h-2v-2h2v2z'/>
             </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });



  return (
    <div className='h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0'>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <RoutingControl route={activeRoute} />
        <MapFocus selectedSosAlert={selectedSosAlert} />

        {sosAlerts.map(alert => (
          alert.location ? (
            <Marker
              key={alert.id}
              position={[alert.location.lat, alert.location.lng]}
              icon={createPulseIcon(alert.severity)}
            >
              <Popup>
                <div className='p-2'>
                  <h3 className='font-bold text-red-600'>SOS Alert</h3>
                  <p className='text-sm'><strong>From:</strong> {alert.senderInfo.username}</p>
                  <p className='text-sm'><strong>Severity:</strong> {alert.severity}</p>
                  <p className='text-sm'><strong>Time:</strong> {alert.timestamp ? new Date(alert.timestamp.seconds * 1000).toLocaleTimeString() : 'Just now'}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}

        {ambulances.map(amb => (
          amb.location ? (
            <Marker
              key={amb.id}
              position={[amb.location.lat, amb.location.lng]}
              icon={ambulanceIcon}
            >
              <Popup>
                <div className='p-2'>
                  <h3 className='font-bold text-blue-600'>Ambulance {amb.id}</h3>
                  <p className='text-sm'><strong>Status:</strong> {amb.status}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default EmergencyMapComponent;
