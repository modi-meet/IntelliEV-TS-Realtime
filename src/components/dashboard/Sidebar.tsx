import React from 'react';
import { FaTriangleExclamation, FaRoadBarrier, FaChargingStation, FaTrafficLight } from 'react-icons/fa6';
import Card from '../ui/Card';

interface VehicleStatus {
  battery: number;
  range: number;
  speed?: number;
  temp?: number;
  status: string;
}

interface SidebarProps {
  onEmergencyClick: () => void;
  onHazardClick: () => void;
  onChargingClick: () => void;
  onToggleTraffic: () => void;
  vehicleStatus: VehicleStatus;
}

const Sidebar = ({ onEmergencyClick, onHazardClick, onChargingClick, onToggleTraffic, vehicleStatus }: SidebarProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Card className="bg-white p-3 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-2 text-gray-800 border-b pb-1">
          Network Alerts
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onEmergencyClick}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-medium flex flex-col items-center justify-center gap-1 h-16"
          >
            <FaTriangleExclamation className="text-lg" />
            <span className="text-xs">SOS</span>
          </button>
          <button
            onClick={onHazardClick}
            className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-lg font-medium flex flex-col items-center justify-center gap-1 h-16"
          >
            <FaRoadBarrier className="text-lg" />
            <span className="text-xs">Hazard</span>
          </button>
          <button
            onClick={onChargingClick}
            className="bg-sky-400 hover:bg-sky-500 text-white p-2 rounded-lg font-medium flex flex-col items-center justify-center gap-1 h-16"
          >
            <FaChargingStation className="text-lg" />
            <span className="text-xs">Charging</span>
          </button>
          <button
            onClick={onToggleTraffic}
            className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg font-medium flex flex-col items-center justify-center gap-1 h-16"
          >
            <FaTrafficLight className="text-lg" />
            <span className="text-xs">Toggle Traffic</span>
          </button>
        </div>
      </Card>

      <Card className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-2 text-gray-800 border-b pb-1">
          Vehicle Status
        </h3>
        <div className="space-y-1 mt-2 text-gray-700 text-sm">
          <p>
            <strong>Battery:</strong>{' '}
            <span className="text-green-600 font-semibold">{vehicleStatus.battery}%</span>
          </p>
          <p>
            <strong>Range:</strong> <span className="font-semibold">{vehicleStatus.range} km</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className="text-blue-600 font-semibold">{vehicleStatus.status}</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;
