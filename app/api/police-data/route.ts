import { NextResponse } from "next/server";

export async function GET(request: Request) {
    let policeData: any[] = []
    let cleanedData: any[] = []
    for(let i = 0; i < 5; i++){
        const data = await fetch(`https://data.sfgov.org/resource/gnap-fj3t.json?$offset=${i * 1000}`)
        const json = await data.json()
        policeData.push(...json)
    }

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().replace('Z', '.000');
    
    policeData = policeData.filter((item) => 
        ['AUDIBLE ALARM', 'TRAFFIC HAZARD', 'FIRE'].includes(item.call_type_original_desc)
     && item.intersection_point != null
     && item.dispatch_datetime > twelveHoursAgo
    )

    cleanedData = policeData.map((item) => {
        return {
            id: item.incident_number,
            latitude: item.intersection_point.coordinates[1],
            longitude: item.intersection_point.coordinates[0],
            name: 'Police Call',
            type: 'Police Call',
            data: {issue: item.call_type_original_desc},
            color: '#FFFFFF'
        }
    })
    
    return NextResponse.json(cleanedData)
}