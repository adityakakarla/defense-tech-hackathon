import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const temperatureUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`
    const temperatureResponse = await fetch(temperatureUrl)
    const airQualityResponse = await fetch(airQualityUrl)
    const temperatureData = await temperatureResponse.json()
    const airQualityData = await airQualityResponse.json()
    console.log(airQualityData)
    const temperature = (temperatureData.current.temperature_2m * 9/5) + 32
    const pm10 = airQualityData.current.pm10
    const pm2_5 = airQualityData.current.pm2_5
    return NextResponse.json({temperature, pm10, pm2_5})
}