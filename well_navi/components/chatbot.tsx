"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, RefreshCcw, Loader2 } from "lucide-react"

interface Message {
  role: 'user' | 'bot'
  content: string
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I can help you find scholarships. What would you like to know?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadingMessages = [
    "🔍 Searching through scholarships...",
    "📚 Finding relevant opportunities...",
    "⚡ Processing your request...",
    "🎯 Looking for the best matches..."
  ];

  const getTypingIndicator = () => {
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    return (
      <div className="flex justify-start">
        <div className="flex items-start gap-2 max-w-[80%]">
          <Bot className="h-6 w-6 text-blue-600" />
          <div className="bg-gray-100 text-gray-900 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-sm">{randomMessage}</div>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const resetChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/reset', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset chat');
      }

      setMessages([
        {
          role: 'bot',
          content: 'Hello! I can help you find scholarships. What would you like to know?'
        }
      ]);
      setInput('');
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error while resetting the chat. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const newMessage: Message = {
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/query?query=${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const botResponse: Message = {
        role: 'bot',
        content: data.response
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      const errorMessage: Message = {
        role: 'bot',
        content: '❌ Sorry, I encountered an error while processing your request. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          🎓 Scholarship Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 pr-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg break-words whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'user' ? `👤 ${message.content}` : `🤖 ${message.content}`}
                    </div>
                    {message.role === 'user' ? (
                      <User className="h-6 w-6 text-gray-500" />
                    ) : (
                      <Bot className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && getTypingIndicator()}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="🔍 Search for scholarships..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            className="bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          <Button 
            onClick={resetChat}
            variant="outline"
            disabled={isLoading}
            title="Reset Chat"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
