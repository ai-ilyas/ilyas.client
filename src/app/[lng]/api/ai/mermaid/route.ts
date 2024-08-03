import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { buildMermaidDiagramPrompt } from './mermaid-prompt-builder';
import { z } from 'zod';

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
  const result = await generateObject({
    model: openai('gpt-4o'),
    prompt: buildMermaidDiagramPrompt(prompt),
    schema: z.object({
      generateMermaidDiagram: z.object({
        mermaidGraph: z.string().describe('mermaidGraph')
      })
    })
  });

  return Response.json(result.object.generateMermaidDiagram.mermaidGraph, {
    status: 200
  });
}
