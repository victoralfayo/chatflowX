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
import { PaperclipIcon, Send, TicketIcon, Tag, CheckIcon, Edit2Icon, Trash2Icon, SmileIcon, ImageIcon, FileIcon, XIcon, CornerUpLeftIcon } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Thanks for your help!', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'When will my order arrive?', unread: 0 },
    { id: 3, name: 'Charlie Brown', lastMessage: 'I have a question about...', unread: 1 },
]

const initialMessages = [
    { id: 1, sender: 'Alice Johnson', content: 'Hi, I have a question about my recent order.', time: '10:30 AM', status: 'read', reactions: [] },
    { id: 2, sender: 'Agent', content: 'Hello Alice, I\'d be happy to help. What\'s your order number?', time: '10:32 AM', status: 'read', reactions: [] },
    { id: 3, sender: 'Alice Johnson', content: 'It\'s ORDER123456', time: '10:33 AM', status: 'read', reactions: [] },
    { id: 4, sender: 'Agent', content: 'Thank you. I can see that your order has been shipped and should arrive within 2-3 business days.', time: '10:35 AM', status: 'received', reactions: [], replyTo: { id: 3, sender: 'Alice Johnson', content: 'It\'s ORDER123456' } },
    { id: 5, sender: 'Alice Johnson', content: 'Great, thank you so much for your help!', time: '10:36 AM', status: 'sent', reactions: [] },
]

const quickReplyTemplates = [
    { id: 1, title: 'Greeting', content: 'Hello! How may I assist you today?' },
    { id: 2, title: 'Thank You', content: 'Thank you for your patience. Is there anything else I can help you with?' },
    { id: 3, title: 'Closing', content: 'If you have any more questions, please don\'t hesitate to ask. Have a great day!' },
]

const availableReactions = ['👍', '👎', '😊', '😂', '😍', '🎉', '🤔', '👏']

export default function MessagingDashboard() {
    const [selectedChat, setSelectedChat] = useState(chats[0])
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const chatEndRef = useRef(null)
    const messageRefs = useRef({})
    const textareaRef = useRef(null)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false)
    const [reactionPickerMessageId, setReactionPickerMessageId] = useState(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'Agent',
                content: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
                reactions: [],
                replyTo: replyingTo
            }
            setMessages([...messages, newMsg])
            setNewMessage('')
            setReplyingTo(null)
            textareaRef.current?.focus()
        }
    }

    const handleRaiseTicket = (messageId) => {
        const message = messages.find(msg => msg.id === messageId)
        console.log('Raising ticket for message:', message)
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
        setMessages(messages.map(msg =>
            msg.id === messageId ? { ...msg, content: 'This message has been deleted', isDeleted: true } : msg
        ))
    }

    const handleReplyToMessage = (messageId) => {
        const messageToReply = messages.find(msg => msg.id === messageId)
        if (messageToReply) {
            setReplyingTo(messageToReply)
            textareaRef.current?.focus()
        }
    }

    const handleReaction = (messageId, reaction) => {
        setMessages(messages.map(msg =>
            msg.id === messageId
                ? { ...msg, reactions: msg.reactions.includes(reaction)
                        ? msg.reactions.filter(r => r !== reaction)
                        : [...msg.reactions, reaction] }
                : msg
        ))
        setIsReactionPickerOpen(false)
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
            console.log(`Uploading file: ${selectedFile.name}`)
            const newMsg = {
                id: messages.length + 1,
                sender: 'Agent',
                content: `File attached: ${selectedFile.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
                reactions: []
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
        textareaRef.current?.focus()
    }

    const insertTemplate = (template) => {
        setNewMessage(newMessage + template.content)
        textareaRef.current?.focus()
    }

    const scrollToMessage = (messageId) => {
        messageRefs.current[messageId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return (
        <div className="flex h-[90vh] overflow-hidden gap-4 p-4">
            <div className="w-1/4">
                <Card className="h-full flex flex-col rounded-lg">
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

            <div className="flex-1">
                <Card className="flex flex-col h-full rounded-lg">
                    <CardHeader className="flex flex-row items-center bg-white z-10 border-b">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="ml-3">{selectedChat.name}</CardTitle>
                        <div className="ml-auto space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleRaiseTicket(null)}>
                                <TicketIcon className="h-4 w-4 mr-2" />
                                Raise Ticket
                            </Button>
                            <Button variant="outline" size="sm">
                                <Tag className="h-4 w-4 mr-2" />
                                Add Tag
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-[calc(90vh-13rem)]">
                            <div className="px-4 py-6">
                                {messages.map((message, index) => (
                                    <div
                                        key={message.id}
                                        ref={el => messageRefs.current[message.id] = el}
                                        className={`flex flex-col mb-4 ${message.sender === 'Agent' ? 'items-end' : 'items-start'} ${index === 0 ? 'mt-4' : ''}`}
                                    >
                                        <div className={`max-w-[70%] rounded-lg p-3 ${message.isDeleted ? 'bg-gray-200 text-gray-500 italic' : message.sender === 'Agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {message.replyTo && !message.isDeleted && (
                                                <div
                                                    className={`${message.sender === 'Agent' ? 'bg-primary-foreground text-primary' : 'bg-background text-foreground'} bg-opacity-10 p-2 rounded-md mb-2 text-sm cursor-pointer`}
                                                    onClick={() => scrollToMessage(message.replyTo.id)}
                                                >
                                                    <p className="font-semibold">{message.replyTo.sender}</p>
                                                    <p className="truncate">{message.replyTo.content}</p>
                                                </div>
                                            )}
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
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                                            {renderMessageStatus(message.status)}
                                            {!message.isDeleted && (
                                                <div className="flex space-x-1 ml-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleReplyToMessage(message.id)}
                                                                >
                                                                    <CornerUpLeftIcon className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Reply to this message</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <Popover
                                                        open={isReactionPickerOpen && reactionPickerMessageId === message.id}
                                                        onOpenChange={(open) => {
                                                            setIsReactionPickerOpen(open)
                                                            setReactionPickerMessageId(open ? message.id : null)
                                                        }}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <SmileIcon className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-64">
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {availableReactions.map(reaction => (
                                                                    <button
                                                                        key={reaction}
                                                                        className="text-2xl hover:bg-gray-100 rounded p-1"
                                                                        onClick={() => handleReaction(message.id, reaction)}
                                                                    >
                                                                        {reaction}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            )}
                                            {message.sender === 'Agent' && !message.isDeleted && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditMessage(message.id)}
                                                        className="ml-2"
                                                    >
                                                        <Edit2Icon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteMessage(message.id)}
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {!message.isDeleted && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRaiseTicket(message.id)}
                                                            >
                                                                <TicketIcon className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Raise a ticket for this message</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                        {message.reactions.length > 0 && (
                                            <div className="flex mt-1 space-x-1">
                                                {message.reactions.map((reaction, index) => (
                                                    <span key={index} className="text-sm">{reaction}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatEndRef} className="h-8" />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t bg-white">
                        <div className="w-full space-y-4">
                            {replyingTo && (
                                <div className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Replying to {replyingTo.sender}</p>
                                        <p className="text-sm truncate">{replyingTo.content}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
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
                                    ref={textareaRef}
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

            <div className="w-1/4">
                <Card className="h-full rounded-lg">
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