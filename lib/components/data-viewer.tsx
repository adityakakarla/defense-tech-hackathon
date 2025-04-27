"use client"

import { Wind, Phone, Radio, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
              <Phone className="text-blue-600" size={20} />
              <h3 className="font-medium text-blue-600">Call Transcript</h3>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100 flex-1">
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

      case "SDR Sensor":
        const frequency = sensor.data.frequency || 0
        // Calculate a normalized value for visualization
        const normalizedFreq = Math.min(100, (frequency / 1000) * 100)

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="text-purple-600" size={20} />
              <h3 className="font-medium text-purple-600">Radio Frequency</h3>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-purple-700">Current Frequency</span>
                  <span className="text-2xl font-bold text-purple-700">
                    {frequency} <span className="text-sm font-normal">MHz</span>
                  </span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs text-purple-600 mb-1">
                    <span>0 MHz</span>
                    <span>1000 MHz</span>
                  </div>
                  <div className="h-3 w-full bg-purple-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${normalizedFreq}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="bg-white text-purple-700 border-purple-200">
                    {frequency < 300 ? "Low Band" : frequency < 700 ? "Mid Band" : "High Band"}
                  </Badge>
                  <span className="text-xs text-purple-600">Sensor ID: {sensor.id}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "Ultrasonic Wind Sensor":
        const windSpeed = sensor.data.windSpeed || 0
        // Calculate a normalized value for visualization
        const normalizedWind = Math.min(100, (windSpeed / 30) * 100)

        // Determine wind category and color
        let windCategory, windColorClass
        if (windSpeed < 5) {
          windCategory = "Calm"
          windColorClass = "text-green-600"
        } else if (windSpeed < 15) {
          windCategory = "Moderate"
          windColorClass = "text-amber-600"
        } else if (windSpeed < 25) {
          windCategory = "Strong"
          windColorClass = "text-orange-600"
        } else {
          windCategory = "Severe"
          windColorClass = "text-red-600"
        }

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="text-teal-600" size={20} />
              <h3 className="font-medium text-teal-600">Wind Speed</h3>
            </div>
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-5">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-teal-700">Current Speed</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-teal-700">{windSpeed}</span>
                    <span className="text-sm font-normal text-teal-600">mph</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#99e6e6" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="10"
                        strokeDasharray={`${normalizedWind * 2.83} 283`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wind className={`h-8 w-8 ${windColorClass}`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-1">
                      <Badge
                        className={`self-start ${
                          windSpeed < 5
                            ? "bg-green-100 text-green-700"
                            : windSpeed < 15
                              ? "bg-amber-100 text-amber-700"
                              : windSpeed < 25
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {windCategory}
                      </Badge>
                      <div className="text-sm text-teal-700 mt-1">
                        {windSpeed < 5
                          ? "Light breeze, minimal impact"
                          : windSpeed < 15
                            ? "Moderate wind, noticeable movement"
                            : windSpeed < 25
                              ? "Strong wind, significant movement"
                              : "Severe wind, potential hazard"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-teal-600 text-right mt-1">Sensor ID: {sensor.id}</div>
              </div>
            </div>
          </div>
        )

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
              ) : sensor.type === "SDR Sensor" ? (
                <Radio className="h-3.5 w-3.5" />
              ) : sensor.type === "Ultrasonic Wind Sensor" ? (
                <Wind className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              <span>{sensor.type}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderVisualization()}</CardContent>
    </Card>
  )
}
