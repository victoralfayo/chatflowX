"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PaperclipIcon, Send, TicketIcon, Tag } from 'lucide-react'

// Mock data for chats
const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Thanks for your help!', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'When will my order arrive?', unread: 0 },
    { id: 3, name: 'Charlie Brown', lastMessage: 'I have a question about...', unread: 1 },
]

// Mock data for messages
const messages = [
    { id: 1, sender: 'Alice Johnson', content: 'Hi, I have a question about my recent order.', time: '10:30 AM' },
    { id: 2, sender: 'Agent', content: 'Hello Alice, I\'d be happy to help. What\'s your order number?', time: '10:32 AM' },
    { id: 3, sender: 'Alice Johnson', content: 'It\'s ORDER123456', time: '10:33 AM' },
    { id: 4, sender: 'Agent', content: 'Thank you. I can see that your order has been shipped and should arrive within 2-3 business days.', time: '10:35 AM' },
    { id: 5, sender: 'Alice Johnson', content: 'Great, thank you so much for your help!', time: '10:36 AM' },
]

export default function MessagingDashboard() {
    const [selectedChat, setSelectedChat] = useState(chats[0])
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Here you would typically send the message to your backend
            console.log('Sending message:', newMessage)
            setNewMessage('')
        }
    }

    const handleRaiseTicket = () => {
        // Here you would typically create a new ticket in your system
        console.log('Raising ticket for chat:', selectedChat.id)
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Chat List */}
            <div className="w-1/4 border-r">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-8rem)]">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer ${
                                        selectedChat.id === chat.id ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <Avatar>
                                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unread > 0 && (
                                        <Badge variant="destructive">{chat.unread}</Badge>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="ml-3">{selectedChat.name}</CardTitle>
                        <div className="ml-auto space-x-2">
                            <Button variant="outline" size="sm" onClick={handleRaiseTicket}>
                                <TicketIcon className="h-4 w-4 mr-2" />
                                Raise Ticket
                            </Button>
                            <Button variant="outline" size="sm">
                                <Tag className="h-4 w-4 mr-2" />
                                Add Tag
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex flex-col mb-4 ${message.sender === 'Agent' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'Agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{message.time}</span>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                    <div className="p-4 border-t">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button size="icon" onClick={handleSendMessage}>
                                <Send className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline">
                                <PaperclipIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Sidebar for Contact Info and Analytics */}
            <div className="w-1/4 border-l">
                <Tabs defaultValue="contact" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="contact">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {selectedChat.name}</p>
                                    <p><strong>Email:</strong> {selectedChat.name.toLowerCase().replace(' ', '.')}@example.com</p>
                                    <p><strong>Phone:</strong> +1 234 567 8900</p>
                                    <Separator className="my-2" />
                                    <p><strong>Tags:</strong></p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge>VIP Customer</Badge>
                                        <Badge>Product Inquiry</Badge>
                                    </div>
                                    <Separator className="my-2" />
                                    <p><strong>Notes:</strong></p>
                                    <p className="text-sm text-gray-500">Interested in new product line. Follow up next week.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chat Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Total Messages:</strong> 27</p>
                                    <p><strong>Average Response Time:</strong> 5 minutes</p>
                                    <p><strong>Satisfaction Score:</strong> 4.8/5</p>
                                    <p><strong>Last Interaction:</strong> 2 hours ago</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}