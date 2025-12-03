import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/dashboard/Sidebar';
import MapComponent from '../components/dashboard/MapComponent';
import LiveFeed from '../components/dashboard/LiveFeed';
import HazardSelectionModal from '../components/dashboard/HazardSelectionModal';
import AIAnalysisModal from '../components/dashboard/AIAnalysisModal';
import SOSModal from '../components/dashboard/SOSModal';
import EmergencyDashboard from './EmergencyDashboard';
import { auth, db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [nearbyEVs, setNearbyEVs] = useState([]);
  const [trafficSignals, setTrafficSignals] = useState([]);
  const [destination, setDestination] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState({ battery: 88, range: 280, status: 'Online' });
  
  // Modal States
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosType, setSosType] = useState('Manual');

  const navigate = useNavigate();

  // If user is Emergency Responder, render that dashboard instead
  if (currentUser?.userType === 'emergency') {
    return <EmergencyDashboard />;
  }

  // Real-time messages listener
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, []);

  // Mock data for now
  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Bengaluru if permission denied
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }

    // Mock markers (e.g., charging stations)
    setMarkers([
      { lat: 13.0359, lng: 77.5970, title: 'Hebbal Charging Hub', description: 'Type: Fast Charger<br>Working Ports: 5/5<br>Vehicles: 2<br>Predicted Wait: 0 min<br>Crowd: Low' },
      { lat: 12.9352, lng: 77.6245, title: 'Koramangala EV Station', description: 'Type: Fast Charger<br>Working Ports: 4/6<br>Vehicles: 3<br>Predicted Wait: 5 min<br>Crowd: Medium' },
      { lat: 12.9784, lng: 77.6408, title: 'Indiranagar Charging Point', description: 'Type: Standard<br>Working Ports: 3/4<br>Vehicles: 1<br>Predicted Wait: 0 min<br>Crowd: Low' },
      { lat: 12.9698, lng: 77.7500, title: 'Whitefield Power Station', description: 'Type: Ultra-Fast<br>Working Ports: 8/10<br>Vehicles: 5<br>Predicted Wait: 10 min<br>Crowd: High' },
      { lat: 12.9716, lng: 77.5946, title: 'City Hospital', description: 'Emergency Services' }
    ]);

    // Mock nearby EVs within 5km range
    setNearbyEVs([
      { lat: 12.9750, lng: 77.6000, regNumber: 'KA01EV1234', battery: 65 },
      { lat: 12.9680, lng: 77.5900, regNumber: 'KA02EV5678', battery: 42 },
      { lat: 12.9800, lng: 77.5850, regNumber: 'KA03EV9012', battery: 88 },
      { lat: 12.9650, lng: 77.6050, regNumber: 'KA04EV3456', battery: 23 }
    ]);

  }, []);

  const handleEmergencyClick = () => {
    setSosType('Manual');
    setIsSOSModalOpen(true);
  };

  const handleHazardClick = () => {
    setIsHazardModalOpen(true);
  };

  const handleChargingClick = () => {
    // In a real app, this would fetch charging stations from Firebase
    if (markers.length > 0) {
        setDestination(markers[0]);
        const newMsg = {
            type: 'info',
            senderInfo: { username: 'System' },
            timestamp: { seconds: Date.now() / 1000 },
            payload: { message: 'Navigating to nearest charging station...' }
        };
        setMessages(prev => [newMsg, ...prev]);
    }
  };

  const handleToggleTraffic = () => {
    if (trafficSignals.length > 0) {
        setTrafficSignals([]);
    } else {
        // Mock traffic signals
        setTrafficSignals([
            { name: 'MG Road Junction', coords: { lat: 12.9756, lng: 77.6066 }, state: 'green' },
            { name: 'Indiranagar 100ft', coords: { lat: 12.9784, lng: 77.6408 }, state: 'red' },
            { name: 'Koramangala Sony Signal', coords: { lat: 12.9352, lng: 77.6245 }, state: 'yellow' }
        ]);
    }
  };

  const handleHazardSelect = async (hazardId) => {
    setIsHazardModalOpen(false);
    if (hazardId === 'accident') {
      setIsAIModalOpen(true);
    } else {
      // Report other hazards directly
      try {
        await addDoc(collection(db, "messages"), {
          type: 'hazard',
          senderInfo: { username: currentUser?.username || 'test user' },
          timestamp: serverTimestamp(),
          payload: { message: `${hazardId} reported at current location.` }
        });
      } catch (error) {
        console.error("Error sending hazard:", error);
      }
    }
  };

  const handleAIReport = async (reportData) => {
    console.log("AI Report:", reportData);
    if (reportData.severity > 6) {
        setSosType(`AI Analysis (Severity: ${reportData.severity}/10)`);
        setIsSOSModalOpen(true);
    } else {
        try {
          await addDoc(collection(db, "messages"), {
            type: 'hazard',
            senderInfo: { username: currentUser?.username || 'You' },
            timestamp: serverTimestamp(),
            payload: { message: `AI Detected Hazard. Severity: ${reportData.severity}/10` }
          });
        } catch (error) {
          console.error("Error sending AI report:", error);
        }
    }
  };

  const handleConfirmSOS = async () => {
    console.log("SOS Triggered!", sosType);
    try {
      // 1. Send to Messages (for Chat Feed)
      await addDoc(collection(db, "messages"), {
        type: 'hazard',
        senderInfo: { username: currentUser?.username || 'You' },
        timestamp: serverTimestamp(),
        payload: { message: `SOS Alert Triggered! Type: ${sosType}` }
      });

      // 2. Create Actual SOS Alert (for Emergency Dashboard)
      await addDoc(collection(db, "sos_alerts"), {
        status: 'active',
        timestamp: serverTimestamp(),
        senderInfo: {
            username: currentUser?.username || 'EV User',
            regNumber: currentUser?.regNumber || 'KA-05-EV-2024',
            uid: currentUser?.uid || 'anonymous'
        },
        location: userLocation || { lat: 12.9716, lng: 77.5946 },
        triggerMethod: sosType,
        vehicleData: {
            // Simulating severe accident data for demonstration
            g_force: sosType.includes('AI') ? 5.2 : 1.5, 
            delta_v: sosType.includes('AI') ? 45 : 10,
            airbags_deployed: sosType.includes('AI'),
            rollover_detected: false
        }
      });

    } catch (error) {
      console.error("Error sending SOS:", error);
    }
    setIsSOSModalOpen(false);
  };

  const handleSendMessage = async (text) => {
    try {
      await addDoc(collection(db, "messages"), {
        type: 'info',
        senderInfo: { username: currentUser?.username || 'You' },
        timestamp: serverTimestamp(),
        payload: { message: text }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCloseNavigation = () => {
    setDestination(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header user={currentUser} />

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-3 p-2 overflow-hidden">
        {/* Left Column: Network Alerts & Vehicle Status */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <Sidebar 
            onEmergencyClick={handleEmergencyClick}
            onHazardClick={handleHazardClick}
            onChargingClick={handleChargingClick}
            onToggleTraffic={handleToggleTraffic}
            vehicleStatus={vehicleStatus}
          />
        </div>

        {/* Center Column: Map */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden relative h-full">
          <MapComponent 
            userLocation={userLocation} 
            markers={markers}
            nearbyEVs={nearbyEVs}
            trafficSignals={trafficSignals}
            destination={destination}
            onCloseNavigation={handleCloseNavigation}
          />
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-1 flex flex-col h-full overflow-hidden">
            <LiveFeed messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Modals */}
      <HazardSelectionModal 
        isOpen={isHazardModalOpen} 
        onClose={() => setIsHazardModalOpen(false)} 
        onSelect={handleHazardSelect} 
      />
      
      <AIAnalysisModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onReport={handleAIReport} 
      />

      <SOSModal 
        isOpen={isSOSModalOpen} 
        onClose={() => setIsSOSModalOpen(false)} 
        onConfirm={handleConfirmSOS} 
        type={sosType}
      />
    </div>
  );
};

export default Dashboard;
