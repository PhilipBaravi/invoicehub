import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X } from 'lucide-react'
import { Rnd } from 'react-rnd'
import HeaderAvatar from '../layout/header/HeaderAvatar'
import { useMediaQuery } from 'react-responsive'

type Message = {
  id: number
  type: 'user' | 'bot'
  content: string
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-center ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
      {message.type === 'user' ? (
        <HeaderAvatar />
      ) : (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      )}
      <div className={`mx-2 p-3 rounded-lg ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <p>{message.content}</p>
      </div>
    </div>
  </div>
)

const ChatInput: React.FC<{ onSendMessage: (message: string) => void }> = ({ onSendMessage }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'bot', content: "Hello! I'm your AI assistant. How can I help you today with invoices, products, customers, or team management?" }
  ])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Detect screen size
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = { id: messages.length + 1, type: 'user', content }
    setMessages([...messages, newUserMessage])
  
    try {
      const response = await fetch(`http://localhost:1010/assistant?q=${encodeURIComponent(content)}`)
      if (response.ok) {
        const data = await response.json()
        console.log(data);
        console.log(data.data);
        const botResponse: Message = { 
          id: messages.length + 2, 
          type: 'bot', 
          content: data.data.reply || "I'm sorry, I didn't understand that."
        }
        setMessages(prev => [...prev, botResponse])
      } 
      // else {
      //   const errorText = await response.text()
      //   console.error('Server responded with an error:', errorText)
      //   const errorResponse: Message = {
      //     id: messages.length + 2,
      //     type: 'bot',
      //     content: 'Sorry, there was an error processing your request.',
      //   }
      //   setMessages(prev => [...prev, errorResponse])
      // }
    } catch (error) {
      console.error('Fetch error:', error)
      const errorResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Sorry, there was an error connecting to the assistant.',
      }
      setMessages(prev => [...prev, errorResponse])
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <>
          {isLargeScreen ? (
            <Rnd
              default={{
                x: 200,
                y: 100,
                width: 400,
                height: 500,
              }}
              minWidth={300}
              minHeight={300}
              bounds="window"
              dragHandleClassName="drag-handle"
            >
              <div className="bg-background flex flex-col w-full h-full rounded-lg shadow-lg border-2 border-blue-700">
                <div className="flex items-center justify-between p-4 border-b drag-handle cursor-move">
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </ScrollArea>
                <div className="p-4 border-t">
                  <ChatInput onSendMessage={handleSendMessage} />
                </div>
              </div>
            </Rnd>
          ) : (
            <div className="fixed bottom-4 right-4 w-80 h-96 bg-background rounded-lg shadow-lg border-2 border-blue-700 z-50">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </ScrollArea>
              <div className="p-4 border-t">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
