'use client';

import { useState } from 'react';
import { Message, continueConversation, continueConversationWithStreamedObject } from './actions';
import { readStreamableValue } from 'ai/rsc';
import { Button } from '@/src/lib/presenter/components/ui/button';
import { Textarea } from '@/src/lib/presenter/components/ui/textarea';
import { Badge } from '@/src/lib/presenter/components/ui/badge';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/lib/presenter/components/ui/alert"


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
            const { messages, newMessage } = await continueConversationWithStreamedObject
            (conversation, input);

            let textContent = '';

            for await (const delta of readStreamableValue(newMessage)){
              console.log(delta)

              if(typeof delta == "object"){
                setConversation([
                  ...messages,
                  { role: 'assistant', content: JSON.stringify(delta.notifications, null, 2)},
                ]);
              }else{
                textContent = `${textContent}${delta}`;
                setConversation([
                  ...messages,
                  { role: 'assistant', content: textContent },
                ]);
              }
            }
          }}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}