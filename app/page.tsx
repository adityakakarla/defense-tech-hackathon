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
  const [sensorBeingViewed, setSensorBeingViewed] = useState<number>(-1);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const initialMarkers = [
    {
      id: "marker-1",
      latitude: 37.8,
      longitude: -122.4,
      type: "Phone Call",
    },
    {
      id: "marker-2",
      type: "Sensor",
      latitude: 37.8248,
      longitude: -122.37,
    },
    {
      id: "marker-3",
      latitude: 37.79,
      longitude: -122.4,
      type: "Phone Call",
    },
    {
      id: "marker-4",
      latitude: 37.805,
      longitude: -122.405,
      type: "Phone Call",
    },
    {
      id: "marker-5",
      latitude: 37.775,
      longitude: -122.419,
      type: "Phone Call",
    },
    {
      id: "marker-6",
      latitude: 37.783,
      longitude: -122.408,
      type: "Phone Call",
    },
    {
      id: "marker-7",
      latitude: 37.794,
      longitude: -122.394,
      type: "Phone Call",
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
      data: { transcript: "Building damage noted, please send help."},
      color: "#FFFFFF"
    },
    {
      id: "marker-2",
      latitude: 37.8248,
      longitude: -122.37,
      name: "Yerba Buena Island",
      type: "Sensor",
      data: { frequency: 900,
        windSpeed: 15,
        direction: 100,
        temperature: 20,
        humidity: 50
      },
      color: "#FFFFFF"
    },
    {
      id: "marker-3",
      type: "Phone Call",
      latitude: 37.79,
      longitude: -122.4,
      name: "Emergency Call",
      data: { transcript: "Multiple buildings shaking, possible earthquake" },
      color: "#FFFFFF"
    },
    {
      id: "marker-4",
      type: "Phone Call",
      latitude: 37.805,
      longitude: -122.405,
      name: "Emergency Call",
      data: { transcript: "Reports of structural damage in downtown area" },
      color: "#FFFFFF"
    },
    {
      id: "marker-5",
      type: "Phone Call",
      latitude: 37.775,
      longitude: -122.419,
      name: "Emergency Call",
      data: { transcript: "Power lines down after earthquake, sparks visible" },
      color: "#FFFFFF"
    },
    {
      id: "marker-6",
      type: "Phone Call",
      latitude: 37.783,
      longitude: -122.408,
      name: "Emergency Call",
      data: { transcript: "Water main break reported after ground shaking" },
      color: "#FFFFFF"
    },
    {
      id: "marker-7",
      type: "Phone Call",
      latitude: 37.794,
      longitude: -122.394,
      name: "Emergency Call",
      data: { transcript: "Multiple people trapped in collapsed building" },
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

    // Fetch earthquake data
    const fetchEarthquakeData = async () => {
      try {
        const response = await fetch('/api/earthquakes')
        const earthquakes = await response.json()
        
        // Create marker data for each earthquake
        const earthquakeMarkers = earthquakes.map((quake: any, index: number) => {
          const id = `earthquake-${index}`
          return {
            id,
            latitude: quake.latitude,
            longitude: quake.longitude,
            name: `M${quake.magnitude.toFixed(1)} Earthquake`,
            type: "Earthquake",
            data: {
              ...quake,
              eventType: "Earthquake"
            },
            color: "#FFD700" // Yellow color for earthquakes
          }
        })
        
        // Add earthquake markers to existing markers
        setMarkerData(prevData => [...prevData, ...earthquakeMarkers])
        
        // Add basic marker info for the map
        const earthquakeMapMarkers = earthquakes.map((quake: any, index: number) => {
          return {
            id: `earthquake-${index}`,
            latitude: quake.latitude,
            longitude: quake.longitude,
            type: "Earthquake"
          }
        })
        
        setMarkerInfo(prevInfo => [...prevInfo, ...earthquakeMapMarkers])
      } catch (error) {
        console.error('Error fetching earthquake data:', error)
      }
    }
    fetchEarthquakeData()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ws = new WebSocket('ws://10.1.63.75:8766');
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnected(true);
        setSocket(ws);
      };
      
      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data)
          console.log('Received data:', receivedData);
          updateMarkerData(receivedData.id, receivedData)
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
      
      return () => {
        ws.close();
      };
    }
  }, []);

  const updateMarkerData = (id: string, data: any) => {
    if(id === 'marker-2'){
      setMarkerData(prevData => {
        return prevData.map(marker => {
          if (marker.id === id) {
            return {
              'id': marker.id,
              'latitude': data.lat,
              'longitude': data.long,
              'name': marker.name,
              'type': marker.type,
              'data': {
                'frequency': data.radio,
                'windSpeed': data.wind,
                'direction': data.direction,
                'temperature': data.temperature,
                'humidity': data.humidity
              }
            }
          }
          return marker;
        });
      });

      setMarkerInfo(prevInfo => {
        return prevInfo.map(marker => {
          if (marker.id === id) {
            return {
              'id': marker.id,
              'latitude': data.lat,
              'longitude': data.long,
              'type': marker.type
            }
          }
          return marker;
        });
      });
    }
  };

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