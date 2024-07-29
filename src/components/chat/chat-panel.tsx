import * as React from 'react'
import { useState} from 'react'

import { shareChat } from '@/src/app/[lng]/(dashboard)/dashboard/chat/actions'
import { Button } from '@/src/components/ui/button'
import { PromptForm } from '@/src/components/chat/prompt-form'
import { ButtonScrollToBottom } from '@/src/components/chat/button-scroll-to-bottom'
import { IconShare } from '@/src/components/ui/icons'
import { FooterText } from '@/src/components/chat/footer'
import { ChatShareDialog } from '@/src/components/chat/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { Chat } from '@/src/components/chat/types'

import type { AI } from '@/src/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from '@/src/components/stocks/message'

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/src/components/ui/alert-dialog"
import { BugPlay } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const { retrieveAIState } = useActions()
  const [currentAIState, setcurrentAIState] = useState< Chat>();

  const exampleMessages = [
    {
      heading: 'What are the',
      subheading: 'trending memecoins today?',
      message: `What are the trending memecoins today?`
    },
    {
      heading: 'What is the price of',
      subheading: '$DOGE right now?',
      message: 'What is the price of $DOGE right now?'
    },
    {
      heading: 'I would like to buy',
      subheading: '42 $DOGE',
      message: `I would like to buy 42 $DOGE`
    },
    {
      heading: 'What are some',
      subheading: `recent events about $DOGE?`,
      message: `What are some recent events about $DOGE?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
<div >

<AlertDialog >
      <AlertDialogTrigger asChild>
      <Button
    variant="secondary"
        size="icon"
        className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
        onClick={async () => {
          setcurrentAIState(await retrieveAIState())
        }}
      >
        <BugPlay />
        <span className="sr-only">Debug</span>
      </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>AI Message Trace</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="max-h-[300px] overflow-auto">
          <div className="prose">
          {currentAIState?.messages.map((message, index) => (
        <div key={message.id}>
           <h3>{message.role}</h3>
            <p> 
              {JSON.stringify( message.content, null, 2)}
            </p>
          {<Separator className="my-4" />}
        </div>
      ))}
            
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


      </div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
