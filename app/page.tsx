"use client"

import Image from "next/image";
import MapboxMap from "@/lib/components/map";
import Sidebar from "@/lib/components/sidebar";
import { useState } from "react";

interface MarkerData {
  id?: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  data: any;
  color?: string;
}

export default function Home() {
  const [mapCenter, setMapCenter] = useState([1, 2, 9]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [sensorBeingViewed, setSensorBeingViewed] = useState(-1);
  
  const [markerData, setMarkerData] = useState<MarkerData[]>([
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
      name: "Call #107",
      type: "Phone Call",
      data: { transcript: "hi"},
      color: "#FFFFFF"
    },
    {
      id: "marker-2",
      latitude: 37.8248,
      longitude: -122.37,
      name: "Yerba Buena Island",
      type: "SDR Sensor",
      data: { frequency: 900},
      color: "#FFFFFF"
    },
    {
      id: "marker-3",
      latitude: 37.81,
      longitude: -122.39,
      name: "San Francisco Bay Sensor 3",
      type: "Ultrasonic Wind Sensor",
      data: { windSpeed: 15},
      color: "#FFFFFF"
    }
  ]);
  
  // Handle viewing marker data
  const handleViewMarkerData = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setShowDataModal(true);
  };
  
  // Close the data modal
  const closeDataModal = () => {
    setShowDataModal(false);
    setSelectedMarker(null);
  };
  
  return (
    <div className="h-screen w-full flex relative">
      <MapboxMap 
        markerData={markerData}
        onViewData={handleViewMarkerData}
        setSensorBeingViewed={setSensorBeingViewed}
      />
      <Sidebar data={markerData}/>
      
      {/* Modal for viewing marker data */}
      {showDataModal && selectedMarker && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-70" onClick={closeDataModal}></div>
          <div className="bg-white p-6 rounded-lg border-2 border-black shadow-lg z-10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h2 className="text-2xl font-bold">{selectedMarker.name}</h2>
              <button 
                onClick={closeDataModal}
                className="text-black hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-900 mb-2"><span className="font-semibold">Type:</span> {selectedMarker.type}</p>
              <p className="text-gray-900"><span className="font-semibold">Location:</span> {selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}</p>
            </div>
            
            <div className="border-t border-gray-300 pt-4 mb-6">
              <h3 className="text-xl font-semibold mb-3">Details</h3>
              <div className="bg-gray-100 p-3 rounded">
                {Object.entries(selectedMarker.data).map(([key, value]) => (
                  <p key={key} className="mb-2 flex justify-between">
                    <span className="font-medium capitalize">{key}:</span> 
                    <span className="text-gray-800">{String(value)}</span>
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={closeDataModal}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
