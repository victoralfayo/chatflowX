"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, Search, Filter, MoreVertical, MessageSquare, UserCheck, AlertCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for tickets
const initialTickets = [
    { id: 1, customer: 'Alice Johnson', subject: 'Payment Issue', status: 'Open', priority: 'High', assignedTo: 'John Doe', createdAt: '2023-06-01' },
    { id: 2, customer: 'Bob Smith', subject: 'Product Inquiry', status: 'In Progress', priority: 'Medium', assignedTo: 'Jane Smith', createdAt: '2023-06-02' },
    { id: 3, customer: 'Charlie Brown', subject: 'Refund Request', status: 'Closed', priority: 'Low', assignedTo: 'John Doe', createdAt: '2023-06-03' },
    // Add more mock tickets as needed
]

const agents = ['John Doe', 'Jane Smith', 'Mike Johnson']

export default function TicketsDashboard() {
    const [tickets, setTickets] = useState(initialTickets)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
    const [newTicket, setNewTicket] = useState({ customer: '', subject: '', priority: 'Medium', assignedTo: '' })

    const filteredTickets = tickets.filter(ticket =>
        (ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'All' || ticket.status === filterStatus)
    )

    const handleCreateTicket = () => {
        setTickets([...tickets, {
            ...newTicket,
            id: tickets.length + 1,
            status: 'Open',
            createdAt: new Date().toISOString().split('T')[0]
        }])
        setNewTicket({ customer: '', subject: '', priority: 'Medium', assignedTo: '' })
        setIsCreateTicketOpen(false)
    }

    const handleUpdateTicketStatus = (id: number, newStatus: string) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, status: newStatus } : ticket
        ))
    }

    const handleAssignTicket = (id: number, agent: string) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, assignedTo: agent } : ticket
        ))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-yellow-500'
            case 'In Progress': return 'bg-blue-500'
            case 'Closed': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-500'
            case 'Medium': return 'bg-yellow-500'
            case 'Low': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="p-8">
            <Tabs defaultValue="tickets">
                <TabsList>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="tickets">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Support Tickets</CardTitle>
                            <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Ticket
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Ticket</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input
                                            placeholder="Customer Name"
                                            value={newTicket.customer}
                                            onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Subject"
                                            value={newTicket.subject}
                                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                        />
                                        <Select
                                            value={newTicket.priority}
                                            onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={newTicket.assignedTo}
                                            onValueChange={(value) => setNewTicket({ ...newTicket, assignedTo: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Assign to" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleCreateTicket}>Create Ticket</Button>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Statuses</SelectItem>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTickets.map((ticket) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell>{ticket.id}</TableCell>
                                                <TableCell>{ticket.customer}</TableCell>
                                                <TableCell>{ticket.subject}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                                                        {ticket.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                                                        {ticket.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{ticket.assignedTo}</TableCell>
                                                <TableCell>{ticket.createdAt}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'In Progress')}>
                                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                                Start Working
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'Closed')}>
                                                                <AlertCircle className="mr-2 h-4 w-4" />
                                                                Close Ticket
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Reassign
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Open Tickets</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'Open').length}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Avg. Response Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">2.5 hours</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Customer Satisfaction</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">4.7/5</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}