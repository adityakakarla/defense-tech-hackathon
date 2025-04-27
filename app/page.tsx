"use client"
import Image from "next/image";
import MapboxMap from "@/lib/components/map";
import Sidebar from "@/lib/components/sidebar";
import { useState, useEffect } from "react";
import DataViewer from "@/lib/components/data-viewer";
import Stats from "@/lib/components/stats";
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
  const [policeData, setPoliceData] = useState<any[]>([])
  const [sensorBeingViewed, setSensorBeingViewed] = useState<number>(-1);
  const initialMarkers = [
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
      type: "Phone Call",
    },
    {
      id: "marker-2",
      type: "SDR Sensor",
      latitude: 37.8248,
      longitude: -122.37,
    },
    {
      id: "marker-3",
      type: "Ultrasonic Wind Sensor",
      latitude: 37.81,
      longitude: -122.39,
    }
  ];
  
  const [markerInfo, setMarkerInfo] = useState(initialMarkers);
  
  const [markerData, setMarkerData] = useState<any[]>([
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
      name: "Emergency Call",
      type: "Phone Call",
      data: { transcript: "There's a weird ship coming towards us, it's not a cruise ship."},
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/police-data')
      const json = await data.json()
      setMarkerData(prevData => [...prevData, ...json])
      setMarkerInfo(prevInfo => [...prevInfo, ...json])
    }
    fetchData()
  }, [])

  // Update wind speed data every 500ms (half a second)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMarkerData(prevData => {
        return prevData.map(marker => {
          // Only update the wind speed sensor (marker-3)
          if (marker.id === "marker-3") {
            // Generate random wind speed between 0 and 30
            const randomWindSpeed = Math.round(Math.random() * 30);
            return {
              ...marker,
              data: { 
                ...marker.data,
                windSpeed: randomWindSpeed
              }
            };
          }
          return marker;
        });
      });
    }, 500); // 500ms = half a second

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen w-full flex relative">
      <MapboxMap
        markerInfo={markerInfo}
        setSensorBeingViewed={setSensorBeingViewed}
      />
      <Sidebar data={markerData}/>
      <DataViewer sensorBeingViewed={sensorBeingViewed} markerData={markerData}/>
      <Stats />
    </div>
  );
}