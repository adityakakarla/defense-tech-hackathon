import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data, model } = await req.json();

  messages[messages.length - 1].parts[0].text = (messages[messages.length - 1].content
  + '\n\ndata: ' + JSON.stringify(data));

  let sdkModel = openai('gpt-4o-mini');

  if (model === 'gpt-4o-mini') {
    sdkModel = openai('gpt-4o-mini');
  } else if (model === 'gpt-4o') {
    sdkModel = openai('gpt-4o');
  } else if (model === 'claude-3.5-sonnet') {
    sdkModel = anthropic('claude-3-5-sonnet-20241022');
  } else if (model === 'claude-3.7-sonnet') {
    sdkModel = anthropic('claude-3-7-sonnet-20250219');
  }

  const result = streamText({
    model: sdkModel,
    system: 'Data is provided. If the user needs to know more about the data, use the data to answer the question.',
    messages,
  });

  return result.toDataStreamResponse();
}