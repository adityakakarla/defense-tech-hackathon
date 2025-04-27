import { useEffect, useState } from "react"

export default function Stats() {
    const [weatherData, setWeatherData] = useState<any>(null)

    const [loaded, setLoaded] = useState<boolean>(false)
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('/api/weather?lat=37.8&lon=-122.4')
            const json = await data.json()
            console.log(json)
            setWeatherData(json)
            setLoaded(true)
        }
        fetchData()
    }, [])
    return (
        <div className='absolute left-4 bottom-16 p-2 bg-white w-fit h-fit rounded-lg'>
            {loaded && (
                <>
                    <h1><b>PM10:</b> {weatherData.pm10} μg/m³</h1>
                    <h1><b>PM2.5:</b> {weatherData.pm2_5} μg/m³</h1>
                </>
            )}
        </div>
    )
}