import { NextRequest } from "next/server";
import OpenAI from "openai";
import { writeFileSync } from "fs";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    let text = "";

    for (const message of messages) {
        text += message.role + ": " + message.parts[0].text + "\n";
    }

    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
    model: "gpt-4o-audio-preview",
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    messages: [
        {
        role: "user",
        content: `based on the message, generate a course of action recommendation.
        
speak fast, frantically, worried, urgent. very urgent. should sound like an emergency radio message.

follow this format with your response:
1. who you're trying to reach
2. who you are
3. what the messsage is
4. an end of message (contains request for acknowledgement)

example: Calling Patrol, this is Base. Caller 3 has fifteen minutes until the water level reaches them. Prioritize pulling them out. Over.

text:` + text
        }
    ],
    store: true,
    });

    return new Response(Buffer.from(response.choices[0].message!.audio!.data!, 'base64'));
}