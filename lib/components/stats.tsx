import { useEffect, useState } from "react"

export default function Stats() {
    const [weatherData, setWeatherData] = useState<any>(null)
    const [earthquakes, setEarthquakes] = useState<any>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('/api/weather?lat=37.8&lon=-122.4')
            const json = await data.json()
            console.log(json)
            setWeatherData(json)
            setLoaded(true)
            const earthquakes = await fetch('/api/earthquakes')
            const earthquakesJson = await earthquakes.json()
            setEarthquakes(earthquakesJson)
        }
        fetchData()
    }, [])
    return (
        <>
        <div className='absolute left-96 bottom-16 p-2 bg-white w-fit h-fit rounded-lg'>
            {loaded && (
                <>
                    <h1><b>PM10:</b> {weatherData.pm10} μg/m³</h1>
                    <h1><b>PM2.5:</b> {weatherData.pm2_5} μg/m³</h1>
                </>
            )}
        </div>
        <div className='absolute left-4 bottom-16 p-4 bg-white w-80 max-h-64 overflow-y-auto rounded-lg shadow-lg'>
            {earthquakes ? (
                <>
                    <h1 className="text-lg font-bold mb-2">Recent Earthquakes</h1>
                    <div className="space-y-3">
                        {earthquakes.slice(0, 5).map((quake: any, index: number) => (
                            <div key={index} className="border-l-4 pl-2" style={{ borderColor: getMagnitudeColor(quake.magnitude) }}>
                                <div className="flex justify-between">
                                    <span className="font-medium">{quake.date}</span>
                                    <span className="font-bold" style={{ color: getMagnitudeColor(quake.magnitude) }}>
                                        M{quake.magnitude.toFixed(1)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{quake.time}</div>
                                <div className="text-sm truncate">{quake.location}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 text-right">
                        Total: {earthquakes.length} earthquakes
                    </div>
                </>
            ) : (
                <p>Loading earthquake data...</p>
            )}
        </div>
        </>
    )
}

// Function to determine color based on earthquake magnitude
function getMagnitudeColor(magnitude: number): string {
    if (magnitude < 1) return "#2563eb"; // blue
    if (magnitude < 2) return "#16a34a"; // green
    if (magnitude < 3) return "#ca8a04"; // yellow
    if (magnitude < 4) return "#ea580c"; // orange
    return "#dc2626"; // red
}