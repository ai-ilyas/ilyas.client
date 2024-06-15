'use server';

import { streamObject } from 'ai';
import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { createStreamableValue } from 'ai/rsc';
import { PromptTemplate } from './prompt-template';
import { z } from 'zod';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}


function preparePromptContent(userInput: string, promptInstance: PromptTemplate = PromptTemplate.createDiagramPromptTemplate()){
  return promptInstance.getFormattedPrompt(userInput);
}

export async function continueConversation(history: Message[], input : string) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: mistral('mistral-large-latest'),
      system: `You are an IT & Cloud architecture assistant.`,
      messages: [...history, { role: 'user', content: preparePromptContent(input,PromptTemplate.createDiagramPromptTemplate()) }]
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: [...history, { role: 'user', content: input } as Message] ,
    newMessage: stream.value,
  };
}

export async function continueConversationWithStreamedObject(history: Message[], input : string) {
  'use server';

  const stream = createStreamableValue();
  console.log(preparePromptContent(input));
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: mistral('mistral-large-latest'),
      system: `You are an IT & Cloud architecture assistant.`,
      schema: z.object({
        components: z.array(z.string()).describe('List of components'),
        mermaid: z.string().describe('Mermaid diagram'),
      }),
      mode: 'auto',
      messages: [...history, { role: 'user', content: preparePromptContent(input,PromptTemplate.createDiagramPromptTemplate()) }]
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
      console.log("partial object:", partialObject);
    }
    stream.done();
  })();

  return {
    messages: [...history, { role: 'user', content: input } as Message] ,
    newMessage: stream.value,
  };
}

