export async function GET(req: Request) {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=text&starttime=2025-04-26&endtime=2025-04-27'
        + '&minlatitude=36.5&maxlatitude=38.5&minlongitude=-123.5&maxlongitude=-121.5'
    )
    const data = await response.text()
    
    // Parse the text data into JSON
    const parsedData = parseEarthquakeData(data)
    console.log(parsedData)

    return new Response(JSON.stringify(parsedData), {
        headers: { 'Content-Type': 'application/json' },
    })
}

function parseEarthquakeData(data: string) {
    // Split the data into lines
    const lines = data.trim().split('\n')
    
    // Skip the header line (starts with #)
    const dataLines = lines.filter(line => !line.startsWith('#'))
    
    // Parse each line into a JSON object
    return dataLines.map(line => {
        const [
            eventId, 
            dateTime, 
            latitude, 
            longitude, 
            depth, 
            author, 
            catalog, 
            contributor, 
            contributorId, 
            magType, 
            magnitude, 
            magAuthor, 
            location
        ] = line.split('|')
        
        // Split dateTime into date and time
        const [date, time] = dateTime.split('T')
        
        return {
            date,
            time: time.replace(/\.\d+$/, ''), // Remove milliseconds
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            magnitude: parseFloat(magnitude),
            location
        }
    })
}
