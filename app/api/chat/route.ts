import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data, model } = await req.json();

  messages[messages.length - 1].parts[0].text = (messages[messages.length - 1].content
    + '\n\nOptional data: ' + JSON.stringify(data));

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
    system: `Data is provided. If the user needs to know more about the data, use the data to answer the question. Do not respond in Markdown, only text. use newline characters freely.
    You must reply concisely and you must not respond in Markdown, otherwise you will be punished. Please respond very concisely. You do not need to use all of the data.
    please utilize tools as needed to answer the user question`,
    messages
  });

  return result.toDataStreamResponse();
}