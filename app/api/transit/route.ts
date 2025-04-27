import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = 'http://api.511.org/transit/servicealerts?api_key=' + process.env.TRANSIT_API_KEY;
    const response = await fetch(url);
    const data = await response.text()
    console.log(data)
    return NextResponse.json(data);
}   