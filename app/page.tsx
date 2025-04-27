"use client"
import Image from "next/image";
import MapboxMap from "@/lib/components/map";
import Sidebar from "@/lib/components/sidebar";
import { useState, useEffect } from "react";
import DataViewer from "@/lib/components/data-viewer";

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
  const [sensorBeingViewed, setSensorBeingViewed] = useState<number>(-1);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const markerInfo = [
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
    },
    {
      id: "marker-2",
      latitude: 37.8248,
      longitude: -122.37,
    },
    {
      id: "marker-3",
      latitude: 37.81,
      longitude: -122.39,
    }
  ];
 
  const [markerData, setMarkerData] = useState<MarkerData[]>([
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
      name: "Emergency Call",
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

  // Initialize WebSocket connection
  useEffect(() => {
    // Only create the websocket client-side
    if (typeof window !== 'undefined') {
      const ws = new WebSocket('ws://localhost:8766');
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnected(true);
        setSocket(ws);
      };
      
      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          console.log('Received data:', receivedData);
          
          // Check if the received data contains marker updates
          if (receivedData.type === 'markerUpdate' && receivedData.data) {
            updateMarkerData(receivedData.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setConnected(false);
      };
      
      // Clean up the websocket on unmount
      return () => {
        ws.close();
      };
    }
  }, []);

  // Update marker data when receiving updates from WebSocket
  const updateMarkerData = (updatedMarkerData: any) => {
    setMarkerData(prevData => {
      return prevData.map(marker => {
        // If this marker is being updated
        if (updatedMarkerData.id === marker.id) {
          return {
            ...marker,
            ...updatedMarkerData
          };
        }
        return marker;
      });
    });
  };

  // The existing effect for random wind speed updates
  // You might want to disable this once the WebSocket is connected
  // useEffect(() => {
  //   if (!connected) {
  //     const intervalId = setInterval(() => {
  //       setMarkerData(prevData => {
  //         return prevData.map(marker => {
  //           // Only update the wind speed sensor (marker-3)
  //           if (marker.id === "marker-3") {
  //             // Generate random wind speed between 0 and 30
  //             const randomWindSpeed = Math.round(Math.random() * 30);
  //             return {
  //               ...marker,
  //               data: {
  //                 ...marker.data,
  //                 windSpeed: randomWindSpeed
  //               }
  //             };
  //           }
  //           return marker;
  //         });
  //       });
  //     }, 500); // 500ms = half a second
      
  //     // Clean up interval on component unmount
  //     return () => clearInterval(intervalId);
  //   }
  // }, [connected]);

  return (
    <div className="h-screen w-full flex relative">
      <MapboxMap
        markerInfo={markerInfo}
        setSensorBeingViewed={setSensorBeingViewed}
      />
      <Sidebar data={markerData}/>
      <DataViewer 
        sensorBeingViewed={sensorBeingViewed} 
        markerData={markerData}
        connectionStatus={connected ? "Connected" : "Disconnected"}
      />
      {!connected && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm">
          WebSocket Disconnected
        </div>
      )}
    </div>
  );
}