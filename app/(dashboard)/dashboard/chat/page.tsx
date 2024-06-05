'use client';

import { useState } from 'react';
import { Message, continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


export default function Chat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <Alert key={index} >
            <div className="flex flex-row" ><Badge ><AlertTitle>{message.role}:</AlertTitle></Badge><AlertDescription className="basis-auto">{message.content}</AlertDescription></div>
          </Alert>
        ))}
      </div>

      <div>
        <Textarea
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <Button
          onClick={async () => {
            setInput('');
            const { messages, newMessage } = await continueConversation([
              ...conversation,
              { role: 'user', content: input },
            ]);

            let textContent = '';

            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;

              setConversation([
                ...messages,
                { role: 'assistant', content: textContent },
              ]);
            }
          }}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}