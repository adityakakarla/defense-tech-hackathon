"use client"

import { 
  AlertCircle, 
  MapPin, 
  Radio, 
  Wind, 
  Thermometer,
  Navigation,
  Compass,
  Wifi,
  Droplets,
  Phone,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

type SensorData = {
  id: string
  latitude: number
  longitude: number
  name: string
  type: string
  data: any
  color: string
}

export default function DataViewer({
  sensorBeingViewed,
  markerData,
}: {
  sensorBeingViewed: number
  markerData: SensorData[]
}) {
  // Show empty state when no sensor is selected
  if (sensorBeingViewed === -1) {
    return (
      <Card className="absolute left-4 top-4 w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">No Sensor Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a sensor on the map to view its data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const sensor = markerData[sensorBeingViewed]

  // Render different visualizations based on sensor type
  const renderVisualization = () => {
    switch (sensor.type) {
      case "Phone Call":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="text-red-600" size={20} />
              <h3 className="font-medium text-red-600">Call Transcript</h3>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-red-100 flex-1">
                    {sensor.data.transcript ? (
                      <p className="text-gray-700">{sensor.data.transcript}</p>
                    ) : (
                      <p className="text-gray-500 italic">No transcript available</p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">Call ID: {sensor.id}</div>
              </div>
            </div>
          </div>
        )

        case "Police Call":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="text-red-600" size={20} />
              <h3 className="font-medium text-red-600">Call Transcript</h3>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-red-100 flex-1">
                    {sensor.data.issue ? (
                      <p className="text-gray-700">{sensor.data.issue}</p>
                    ) : (
                      <p className="text-gray-500 italic">No transcript available</p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">Call ID: {sensor.id}</div>
              </div>
            </div>
          </div>
        )

        case "Sensor":
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-blue-600" size={20} />
        <h3 className="font-medium text-blue-700">Sensor Data</h3>
      </div>
      
      {/* Tabs Component */}
      {(() => {
        const [activeTab, setActiveTab] = useState(1);
        const { data } = sensor;
        
        // Tab content definitions
        const tabContents = {
          1: (
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-green-600" size={18} />
                <h4 className="font-medium text-gray-700">Location</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Compass size={14} /> 
                    <p>Latitude</p>
                  </div>
                  <p className="font-medium text-green-700">{sensor.latitude.toFixed(4)}°</p>
                </div>
                <div className="bg-gray-50 p-3 rounded hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Compass size={14} /> 
                    <p>Longitude</p>
                  </div>
                  <p className="font-medium text-green-700">{sensor.longitude.toFixed(4)}°</p>
                </div>
              </div>
            </div>
          ),
          2: (
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="text-purple-600" size={18} />
                <h4 className="font-medium text-gray-700">Frequency</h4>
              </div>
              <div className="bg-gray-50 p-3 rounded hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Wifi size={14} /> 
                  <p>Signal Frequency</p>
                </div>
                <p className="font-medium text-purple-700">{data.frequency} MHz</p>
              </div>
            </div>
          ),
          3: (
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="text-blue-600" size={18} />
                <h4 className="font-medium text-gray-700">Wind Data</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Wind size={14} /> 
                    <p>Wind Speed</p>
                  </div>
                  <p className="font-medium text-blue-700">{data.windSpeed.toFixed(2)} mph</p>
                </div>
                <div className="bg-gray-50 p-3 rounded hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Navigation size={14} /> 
                    <p>Direction</p>
                  </div>
                  <p className="font-medium text-blue-700">{data.direction.toFixed(2)}°</p>
                </div>
              </div>
            </div>
          ),
          4: (
            <div className="bg-white rounded-lg p-4 shadow border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="text-amber-600" size={18} />
                <h4 className="font-medium text-gray-700">Atmospheric Data</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Thermometer size={14} /> 
                    <p>Temperature</p>
                  </div>
                  <p className="font-medium text-amber-700">{data.temperature.toFixed(2)}°C</p>
                </div>
                <div className="bg-gray-50 p-3 rounded hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Droplets size={14} /> 
                    <p>Humidity</p>
                  </div>
                  <p className="font-medium text-amber-700">{data.humidity.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )
        };
        
        return (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 border-b">
              <button 
                className={`flex items-center gap-1 p-1 text-sm font-medium ${activeTab === 1 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`} 
                onClick={() => setActiveTab(1)}
              >
                <MapPin size={16} />
                Location
              </button>
              <button 
                className={`flex items-center gap-1 p-1 text-sm font-medium ${activeTab === 2 ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(2)}
              >
                <Radio size={16} />
                Frequency
              </button>
              <button 
                className={`flex items-center gap-1 p-1 text-sm font-medium ${activeTab === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(3)}
              >
                <Wind size={16} />
                Wind
              </button>
              <button 
                className={`flex items-center gap-1 p-1 text-sm font-medium ${activeTab === 4 ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(4)}
              >
                <Thermometer size={16} />
                Weather
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="pt-2">
              {tabContents[activeTab as keyof typeof tabContents]}
            </div>
          </>
        );
      })()}
    </div>
  );

      case "Earthquake":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-600" size={20} />
              <h3 className="font-medium text-yellow-700">Earthquake Details</h3>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium">{sensor.data.date}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="font-medium">{sensor.data.time}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-yellow-100 p-3 rounded-lg mb-3">
                <span className="text-sm font-medium">Magnitude</span>
                <span className="text-xl font-bold text-yellow-700">
                  {sensor.data.magnitude.toFixed(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Latitude</div>
                  <div className="font-medium">{sensor.data.latitude.toFixed(4)}°</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Longitude</div>
                  <div className="font-medium">{sensor.data.longitude.toFixed(4)}°</div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Location</div>
                <div className="text-sm">{sensor.data.location}</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-gray-600" size={20} />
              <h3 className="font-medium text-gray-600">Unknown Sensor Type</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-sm">
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">
                {JSON.stringify(sensor.data, null, 2)}
              </pre>
            </div>
            <div className="text-xs text-gray-500 text-right mt-3">Sensor ID: {sensor.id}</div>
          </div>
        )
    }
  }

  return (
    <Card className="absolute left-4 top-4 w-[400px] max-h-[500px] overflow-auto shadow-lg">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-xl">{sensor.name}</CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center gap-1.5">
              {sensor.type === "Phone Call" ? (
                <Phone className="h-3.5 w-3.5" />
              ) : sensor.type === "Sensor" ? (
                <Radio className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              <span>{sensor.type}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {sensor.latitude?.toFixed(4)}, {sensor.longitude?.toFixed(4)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderVisualization()}</CardContent>
    </Card>
  )
}
