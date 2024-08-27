"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PaperclipIcon, Send, TicketIcon, Tag, CheckIcon, Edit2Icon, Trash2Icon, SmileIcon, ImageIcon, FileIcon, XIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock data for chats
const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Thanks for your help!', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'When will my order arrive?', unread: 0 },
    { id: 3, name: 'Charlie Brown', lastMessage: 'I have a question about...', unread: 1 },
]

// Mock data for messages (extended for scrolling demonstration)
const initialMessages = [
    { id: 1, sender: 'Alice Johnson', content: 'Hi, I have a question about my recent order.', time: '10:30 AM', status: 'read' },
    { id: 2, sender: 'Agent', content: 'Hello Alice, I\'d be happy to help. What\'s your order number?', time: '10:32 AM', status: 'read' },
    { id: 3, sender: 'Alice Johnson', content: 'It\'s ORDER123456', time: '10:33 AM', status: 'read' },
    { id: 4, sender: 'Agent', content: 'Thank you. I can see that your order has been shipped and should arrive within 2-3 business days.', time: '10:35 AM', status: 'received' },
    { id: 5, sender: 'Alice Johnson', content: 'Great, thank you so much for your help!', time: '10:36 AM', status: 'sent' },
    { id: 6, sender: 'Agent', content: 'You\'re welcome! Is there anything else I can assist you with today?', time: '10:38 AM', status: 'sent' },
    { id: 7, sender: 'Alice Johnson', content: 'Actually, yes. I was wondering if you could tell me more about your return policy?', time: '10:40 AM', status: 'read' },
    { id: 8, sender: 'Agent', content: 'Our return policy allows you to return any unused item within 30 days of purchase for a full refund. Would you like me to send you a link with more detailed information?', time: '10:42 AM', status: 'received' },
    { id: 9, sender: 'Alice Johnson', content: 'Yes, that would be very helpful. Thank you!', time: '10:43 AM', status: 'read' },
    { id: 10, sender: 'Agent', content: 'Here\'s the link to our return policy: [Return Policy Link]. Let me know if you have any questions after reviewing it.', time: '10:45 AM', status: 'sent' },
    { id: 11, sender: 'Alice Johnson', content: 'Thank you, I\'ll take a look at it now.', time: '10:46 AM', status: 'read' },
    { id: 12, sender: 'Agent', content: 'You\'re welcome. I\'ll be here if you need any clarification or have additional questions.', time: '10:47 AM', status: 'received' },
    { id: 13, sender: 'Alice Johnson', content: 'I\'ve read through it, and it seems clear. Thanks for your assistance today!', time: '10:55 AM', status: 'read' },
    { id: 14, sender: 'Agent', content: 'I\'m glad I could help! If you need anything else in the future, don\'t hesitate to reach out. Have a great day, Alice!', time: '10:57 AM', status: 'sent' },
    { id: 15, sender: 'Alice Johnson', content: 'You too, goodbye!', time: '10:58 AM', status: 'read' },
]

// Quick reply templates
const quickReplyTemplates = [
    { id: 1, title: 'Greeting', content: 'Hello! How may I assist you today?' },
    { id: 2, title: 'Thank You', content: 'Thank you for your patience. Is there anything else I can help you with?' },
    { id: 3, title: 'Closing', content: 'If you have any more questions, please don\'t hesitate to ask. Have a great day!' },
]

export default function MessagingDashboard() {
    const [selectedChat, setSelectedChat] = useState(chats[0])
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    const chatEndRef = useRef(null)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'Agent',
                content: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent'
            }
            setMessages([...messages, newMsg])
            setNewMessage('')
        }
    }

    const handleRaiseTicket = () => {
        console.log('Raising ticket for chat:', selectedChat.id)
    }

    const handleEditMessage = (messageId) => {
        const messageToEdit = messages.find(msg => msg.id === messageId)
        if (messageToEdit) {
            setEditingMessageId(messageId)
            setEditedContent(messageToEdit.content)
        }
    }

    const handleSaveEdit = (messageId) => {
        setMessages(messages.map(msg =>
            msg.id === messageId ? { ...msg, content: editedContent } : msg
        ))
        setEditingMessageId(null)
        setEditedContent('')
    }

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter(msg => msg.id !== messageId))
    }

    const renderMessageStatus = (status) => {
        switch (status) {
            case 'sent':
                return <CheckIcon className="h-4 w-4 text-gray-400" />
            case 'received':
                return <CheckIcon className="h-4 w-4 text-blue-500" />
            case 'read':
                return (
                    <div className="flex">
                        <CheckIcon className="h-4 w-4 text-blue-500" />
                        <CheckIcon className="h-4 w-4 text-blue-500 -ml-2" />
                    </div>
                )
            default:
                return null
        }
    }

    const handleAttachment = (type) => {
        if (type === 'image') {
            setIsImageModalOpen(true)
        } else if (type === 'file') {
            setIsDocumentModalOpen(true)
        }
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleFileUpload = () => {
        if (selectedFile) {
            // Here you would typically upload the file to your server
            console.log(`Uploading file: ${selectedFile.name}`)
            // After upload, you might want to add a message to the chat
            const newMsg = {
                id: messages.length + 1,
                sender: 'Agent',
                content: `File attached: ${selectedFile.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent'
            }
            setMessages([...messages, newMsg])
            setSelectedFile(null)
            setIsImageModalOpen(false)
            setIsDocumentModalOpen(false)
        }
    }

    const handleEmojiClick = (emoji) => {
        setNewMessage(newMessage + emoji)
        setIsEmojiPickerOpen(false)
    }

    const insertTemplate = (template) => {
        setNewMessage(newMessage + template.content)
    }

    return (
        <div className="flex h-[90vh] overflow-hidden gap-4 p-4">
            {/* Chat List */}
            <div className="w-1/4">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-auto">
                        <ScrollArea className="h-full">
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
            <div className="flex-1">
                <Card className="flex flex-col h-full">
                    <CardHeader className="flex flex-row items-center bg-white z-10 border-b">
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
                    <CardContent className="flex-1 overflow-clip p-0">
                        <ScrollArea className="h-[calc(90vh-13rem)]" style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#888 #f1f1f1'
                        }}>
                            <div className="px-4 py-6">
                                <div  className="h-8"/>
                                {messages.map((message, index) => (
                                    <div key={message.id}
                                         className={`flex flex-col mb-4 ${message.sender === 'Agent' ? 'items-end' : 'items-start'} ${index === 0 ? 'mt-4' : ''}`}>
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'Agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {editingMessageId === message.id ? (
                                                <Input
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    onBlur={() => handleSaveEdit(message.id)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(message.id)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p className="text-sm">{message.content}</p>
                                            )}
                                        </div>
                                        <div className="h-8"/>
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                                            {renderMessageStatus(message.status)}
                                            {message.sender === 'Agent' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditMessage(message.id)}
                                                        className="ml-2"
                                                    >
                                                        <Edit2Icon className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteMessage(message.id)}
                                                    >
                                                        <Trash2Icon className="h-4 w-4"/>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} className="h-8"/>
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t bg-white">
                        <div className="w-full space-y-4">
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleAttachment('image')}>
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleAttachment('file')}>
                                    <FileIcon className="h-4 w-4" />
                                </Button>
                                <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <SmileIcon className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64">
                                        <div className="grid grid-cols-8 gap-2">
                                            {['😀', '😂', '😊', '😍', '🤔', '😎', '👍', '❤️'].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    className="text-2xl hover:bg-gray-100 rounded p-1"
                                                    onClick={() => handleEmojiClick(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">Templates</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Quick Reply Templates</DialogTitle>
                                            <DialogDescription>
                                                Select a template to insert into your message.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            {quickReplyTemplates.map(template => (
                                                <Button
                                                    key={template.id}
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() => insertTemplate(template)}
                                                >
                                                    {template.title}
                                                </Button>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex space-x-2">
                                <Textarea
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                    className="flex-grow"
                                    rows={3}
                                />
                                <Button size="icon" onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Sidebar for Contact Info and Analytics */}
            <div className="w-1/4">
                <Card className="h-full">
                    <Tabs defaultValue="contact" className="w-full h-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>
                        <TabsContent value="contact" className="h-[calc(90vh-7rem)] overflow-auto">
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
                        </TabsContent>
                        <TabsContent value="analytics" className="h-[calc(90vh-7rem)] overflow-auto">
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
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            {/* Image Upload Modal */}
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Image</DialogTitle>
                        <DialogDescription>
                            Select an image to upload to the conversation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        {selectedFile && (
                            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-sm truncate">{selectedFile.name}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <Button onClick={handleFileUpload} disabled={!selectedFile}>
                            Upload Image
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document Upload Modal */}
            <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription>
                            Select a document to upload to the conversation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            type="file"
                            onChange={handleFileSelect}
                        />
                        {selectedFile && (
                            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-sm truncate">{selectedFile.name}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <Button onClick={handleFileUpload} disabled={!selectedFile}>
                            Upload Document
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}