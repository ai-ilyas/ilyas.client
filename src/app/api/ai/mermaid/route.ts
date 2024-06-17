import { openai } from '@ai-sdk/openai';
import { StreamData, streamText, StreamingTextResponse } from 'ai';
import { buildMermaidDiagramPrompt } from './mermaid-prompt-builder'

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
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are an IT & Cloud architecture assistant.`,
    prompt: buildMermaidDiagramPrompt(prompt)
  });

  // Create a new StreamData
  const data = new StreamData();

  // Convert the response into a friendly text-stream
  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });

  // Respond with the stream and additional StreamData
  return new StreamingTextResponse(stream, {}, data);
}