import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, generateText } from 'ai';
import { buildMermaidDiagramPrompt } from './mermaid-prompt-builder'
import { NextResponse } from 'next/server';
import { isReturnStatement } from 'typescript';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/*
  http request to test the route
  fetch("http://localhost:3000/api/ai/mermaid", { method: 'POST',
    body: JSON.stringify({
      prompt: "architecture web AWS"
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
*/
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { prompt } = await req.json();

  // Call the language model
  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: buildMermaidDiagramPrompt(prompt),
  });

  const startChar = "```mermaid";
  const endChar = "```";

  const startIndex = result.text.indexOf(startChar) + 9;
  const endIndex = result.text.indexOf(endChar, startIndex + 1);
  
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return new Response("Error during Mermaid Creation process.", { status: 500 });
  }
  
    return new Response(result.text.substring(startIndex + 1, endIndex).trim(), { status: 200 });
}