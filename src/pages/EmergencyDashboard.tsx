import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, onValue, update, set } from 'firebase/database';
import { auth, db, rtdb } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import EmergencyMapComponent from '../components/dashboard/EmergencyMapComponent';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FaTruckMedical, FaTriangleExclamation, FaCarBurst , FaBrain, FaCommentDots } from 'react-icons/fa6';
import L from 'leaflet';

interface VehicleData {
  g_force: number;
  delta_v: number;
  airbags_deployed: boolean;
  rollover_detected: boolean;
}

interface Alert {
  id: string;
  location: { lat: number; lng: number };
  severity: string;
  [key: string]: any;
}

interface Ambulance {
  id: string;
  location: { lat: number; lng: number };
  [key: string]: any;
}

interface PriorityAlert {
  show: boolean;
  message: string;
  type: string;
}

const EmergencyDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeEVsCount, setActiveEVsCount] = useState(0);
  const [activeAmbulanceCount, setActiveAmbulanceCount] = useState(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [alertsFeed, setAlertsFeed] = useState<any[]>([]);
  const [sosAlerts, setSosAlerts] = useState<Alert[]>([]);
  const [ambulanceFleet, setAmbulanceFleet] = useState<Ambulance[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSosAlert, setSelectedSosAlert] = useState<Alert | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [priorityAlert, setPriorityAlert] = useState<PriorityAlert>({ show: false, message: '', type: '' });

  // --- Helpers ---
  const getAccidentSeverityJS = (vehicleData: VehicleData) => {
    if (!vehicleData) return "Medium";
    const { g_force, delta_v, airbags_deployed, rollover_detected } = vehicleData;
    let score = 0;
    if (g_force > 4.5) score += 4;
    else if (g_force > 2.5) score += 2;
    if (delta_v > 40) score += 3;
    else if (delta_v > 20) score += 1;
    if (airbags_deployed) score += 3;
    if (rollover_detected) score += 5;
    if (score >= 7) return "High";
    if (score >= 4) return "Medium";
    return "Low";
  };

  const compareSeverity = (a: Alert, b: Alert) => {
    const severities: { [key: string]: number } = { High: 3, Medium: 2, Low: 1 };
    return (severities[b.severity] || 0) - (severities[a.severity] || 0);
  };

  const findClosestAmbulance = (alert: Alert, ambulances: Ambulance[]) => {
    if (ambulances.length === 0) return null;
    return ambulances
      .map((amb) => ({
        ...amb,
        distance: L.latLng(alert.location.lat, alert.location.lng).distanceTo(L.latLng(amb.location.lat, amb.location.lng)),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
  };

  const showPriorityAlert = (message: string, type: string) => {
    setPriorityAlert({ show: true, message, type });
    setTimeout(() => setPriorityAlert({ show: false, message: '', type: '' }), 4000);
  };

  // --- Effects ---
  useEffect(() => {
    // 1. Active EVs Count
    const evQuery = query(collection(db, "users"), where("userType", "==", "ev"));
    const unsubEVs = onSnapshot(evQuery, (snapshot) => {
      setActiveEVsCount(snapshot.size);
    });

    // 2. Live Alerts Feed
    const msgQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubMsgs = onSnapshot(msgQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlertsFeed(msgs);
    });

    // 3. Active SOS Alerts
    const sosQuery = query(collection(db, "sos_alerts"), where("status", "==", "active"));
    const unsubSOS = onSnapshot(sosQuery, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        location: doc.data().location,
        severity: getAccidentSeverityJS(doc.data().vehicleData),
        ...doc.data()
      })) as Alert[];
      setSosAlerts(alerts);
      setActiveAlertsCount(alerts.length);
    });

    // 4. Ambulances (RTDB)
    const ambulancesRef = ref(rtdb, "ambulances");
    const unsubAmbulances = onValue(ambulancesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const fleet = Object.values(data) as Ambulance[];
      setAmbulanceFleet(fleet);
      setActiveAmbulanceCount(fleet.length);
    });

    return () => {
      unsubEVs();
      unsubMsgs();
      unsubSOS();
      unsubAmbulances();
    };
  }, []);

  // Logic to handle alerts update (Suggestions)
  useEffect(() => {
    if (sosAlerts.length > 1) {
      let availableAmbulances = ambulanceFleet.filter(a => a.status === "available");
      let unassignedAlerts = [...sosAlerts].sort(compareSeverity);
      const newSuggestions = [];

      for (const alert of unassignedAlerts) {
        if (availableAmbulances.length === 0) break;
        const closestAmbulance = findClosestAmbulance(alert, availableAmbulances);
        if (closestAmbulance) {
          newSuggestions.push({
            alert,
            ambulance: closestAmbulance,
            distance: (closestAmbulance.distance / 1000).toFixed(2),
          });
          availableAmbulances = availableAmbulances.filter(a => a.id !== closestAmbulance.id);
        }
      }
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [sosAlerts, ambulanceFleet]);

  // Logic to handle Selection & Alerts
  useEffect(() => {
    if (sosAlerts.length === 0) {
      setSelectedSosAlert(null);
    } else if (!isDispatchModalOpen) {
      // Only auto-select if modal is NOT open
      const sortedAlerts = [...sosAlerts].sort(compareSeverity);
      setSelectedSosAlert(sortedAlerts[0]);

      if (sosAlerts.length === 1) {
        showPriorityAlert("Single incident detected. Manual dispatch.", "bg-blue-600");
      } else {
        showPriorityAlert(`Multiple incidents (${sosAlerts.length})! AI suggestions generated.`, "bg-orange-500");
      }
    }
  }, [sosAlerts, isDispatchModalOpen]);


  // --- Actions ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleSimulateAmbulance = () => {
    const ambulanceId = `AMB-${Math.floor(Math.random() * 900) + 100}`;
    set(ref(rtdb, `ambulances/${ambulanceId}`), {
      id: ambulanceId,
      location: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.1,
        lng: 77.5946 + (Math.random() - 0.5) * 0.1,
      },
      status: "available",
      type: "Advanced Life Support",
    });
    showPriorityAlert(`Ambulance ${ambulanceId} added to simulation`, "bg-blue-600");
  };

  const handleSimulateSOS = async () => {
    try {
      await addDoc(collection(db, "sos_alerts"), {
        status: 'active',
        timestamp: serverTimestamp(),
        senderInfo: {
            username: `Simulated User ${Math.floor(Math.random() * 100)}`,
            regNumber: `KA-01-SIM-${Math.floor(Math.random() * 9000) + 1000}`,
            uid: `sim-${Date.now()}`
        },
        location: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.05,
            lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        },
        triggerMethod: 'Simulation',
        vehicleData: {
            g_force: 3 + Math.random() * 4, // Random severity
            delta_v: 20 + Math.random() * 40,
            airbags_deployed: Math.random() > 0.5,
            rollover_detected: Math.random() > 0.8
        }
      });
    } catch (error) {
      console.error("Error simulating SOS:", error);
    }
  };

  const handleDispatch = async (sosId: string, ambulanceId: string) => {
    // Update Firestore
    const sosRef = doc(db, "sos_alerts", sosId);
    await updateDoc(sosRef, {
      status: "dispatched",
      dispatchedAmbulanceId: ambulanceId,
    });

    // Update RTDB
    const updates: any = {};
    const alert = sosAlerts.find(a => a.id === sosId);
    updates[`/ambulances/${ambulanceId}/status`] = "en-route";
    if (alert) {
      updates[`/ambulances/${ambulanceId}/destination`] = alert.location;
    }
    await update(ref(rtdb), updates);

    // Draw Route
    const ambulance = ambulanceFleet.find(a => a.id === ambulanceId);
    if (alert && ambulance) {
      setActiveRoute({
        start: ambulance.location,
        end: alert.location
      });
    }
    
    setIsDispatchModalOpen(false);
    setSelectedSosAlert(null);
  };

  const handleClearSOS = async (sosId: string) => {
    await updateDoc(doc(db, "sos_alerts", sosId), { status: "resolved" });
    setSelectedSosAlert(null);
    setActiveRoute(null);
  };

  const openDispatchModal = (alert: Alert) => {
    setSelectedSosAlert(alert);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <FaTruckMedical className="text-4xl text-red-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Emergency Responder Dashboard</h1>
            <p className="text-sm text-gray-500">Real-time Green Corridor Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleSimulateSOS} className="bg-red-600 text-white hover:bg-red-700">
            Simulate SOS
          </Button>
          <Button onClick={handleSimulateAmbulance} className="bg-blue-600 text-white hover:bg-blue-700">
            Simulate Ambulance
          </Button>
          <Button onClick={handleLogout} className="bg-gray-700 text-white hover:bg-gray-800">
            Logout
          </Button>
        </div>
      </header>

      {/* Priority Alert Toast */}
      {priorityAlert.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg text-white font-bold shadow-lg ${priorityAlert.type}`}>
          {priorityAlert.message}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          
          {/* SOS Card */}
          {selectedSosAlert && !isDispatchModalOpen && (
            <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg animate-pulse-border border-2 border-red-400">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 animate-pulse">
                <FaTriangleExclamation /> ACTIVE SOS
              </h2>
              <div className="space-y-1">
                <p><strong>From:</strong> {selectedSosAlert.senderInfo.username}</p>
                <p><strong>Vehicle:</strong> {selectedSosAlert.senderInfo.regNumber}</p>
                <p><strong>Severity:</strong> <span className="font-bold">{selectedSosAlert.severity}</span></p>
                <p><strong>Trigger:</strong> {selectedSosAlert.triggerMethod}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onClick={() => openDispatchModal(selectedSosAlert)}
                  className="w-full bg-white/30 text-white font-bold hover:bg-white/50 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Dispatch Nearest Unit
                </button>
                <button 
                  onClick={() => handleClearSOS(selectedSosAlert.id)}
                  className="w-full bg-white/30 text-white font-bold hover:bg-white/50 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <Card className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">System Status</h2>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-4xl font-bold text-blue-600">{activeEVsCount}</p>
                <p className="text-sm text-gray-500">Active EVs</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-600">{activeAmbulanceCount}</p>
                <p className="text-sm text-gray-500">Ambulances</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-orange-600">{activeAlertsCount}</p>
                <p className="text-sm text-gray-500">SOS Alerts</p>
              </div>
            </div>
          </Card>

          {/* Live Alerts Feed */}
          <Card className="bg-white p-4 rounded-xl shadow-lg flex-grow flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Live Alerts Feed</h2>
            <div className="overflow-y-auto flex-grow space-y-3 pr-2 no-scrollbar">
              {alertsFeed.map(msg => (
                <div key={msg.id} className="flex items-start gap-3 p-2 border-b last:border-0">
                  <div><FaCommentDots className="text-purple-500 text-2xl" /></div>
                  <div>
                    <p className="font-semibold text-gray-800">{msg.senderInfo?.username || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{msg.payload?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden relative">
          <EmergencyMapComponent 
            sosAlerts={sosAlerts} 
            ambulances={ambulanceFleet} 
            activeRoute={activeRoute}
            selectedSosAlert={selectedSosAlert}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          
          {/* Vehicle Controls */}
          <Card className="bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Vehicle Controls</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {ambulanceFleet.length === 0 ? (
                <p className="text-gray-500">No active ambulances.</p>
              ) : (
                ambulanceFleet.map(amb => (
                  <div key={amb.id} className="p-2 border rounded-lg bg-gray-50">
                    <p className="font-semibold text-gray-800">Ambulance {amb.id}</p>
                    <p className="text-sm text-gray-600">Status: {amb.status}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-white p-4 rounded-xl shadow-lg flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
              <FaBrain className="text-blue-500" /> AI Dispatch Suggestions
            </h2>
            <div className="overflow-y-auto flex-grow space-y-3 pr-2 no-scrollbar">
              {suggestions.length === 0 ? (
                <p className="text-gray-500">No suggestions available.</p>
              ) : (
                suggestions.map((sug, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                    <p className="font-bold text-blue-700">Dispatch <span className="text-black">{sug.ambulance.id}</span></p>
                    <p>to <span className="font-semibold">{sug.alert.senderInfo.username}</span></p>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>Severity: {sug.alert.severity}</span> | 
                      <span>Dist: {sug.distance} km</span>
                    </div>
                    <Button 
                      onClick={() => handleDispatch(sug.alert.id, sug.ambulance.id)}
                      className="w-full mt-2 bg-green-600 text-white font-semibold py-1 rounded hover:bg-green-700"
                    >
                      Confirm & Dispatch
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && selectedSosAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Dispatch Confirmation</h2>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {ambulanceFleet.filter(a => a.status === 'available').length === 0 ? (
                <p>No available ambulances.</p>
              ) : (
                ambulanceFleet
                  .filter(a => a.status === 'available')
                  .map(amb => {
                    const dist = (L.latLng(selectedSosAlert.location.lat, selectedSosAlert.location.lng)
                      .distanceTo(L.latLng(amb.location.lat, amb.location.lng)) / 1000).toFixed(2);
                    return { ...amb, dist: parseFloat(dist) };
                  })
                  .sort((a, b) => a.dist - b.dist)
                  .map((amb, i) => (
                    <label key={amb.id} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="ambulance" 
                        value={amb.id} 
                        className="mr-3" 
                        defaultChecked={i === 0}
                        id={`radio-${amb.id}`}
                      />
                      <span>{amb.id} ({amb.dist} km away)</span>
                    </label>
                  ))
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsDispatchModalOpen(false)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const selectedRadio = document.querySelector('input[name="ambulance"]:checked') as HTMLInputElement;
                  if (selectedRadio) {
                    handleDispatch(selectedSosAlert.id, selectedRadio.value);
                  }
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyDashboard;
