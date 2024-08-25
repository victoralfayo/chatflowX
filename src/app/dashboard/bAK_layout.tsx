"use client"

import {
    BellIcon,
    LogOutIcon,
    MessageCircle,
    MessageSquareIcon,
    PencilIcon,
    PlusIcon,
    Radio,
    Ticket, TrashIcon,
    Users
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useState} from "react";

const steps = [
    { path: '/onboarding', label: 'Welcome' },
    { path: '/onboarding/organization', label: 'Organization' },
    { path: '/onboarding/plan', label: 'Plan' },
    { path: '/onboarding/success', label: 'Success' },
]

export default function OnboardingLayout({ children,}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const currentStepIndex = steps.findIndex(step => step.path === pathname)

    const [activeTab, setActiveTab] = useState("dashboard")

    const [agents, setAgents] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Agent" },
    ])
    const [editingAgent, setEditingAgent] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddAgent = (newAgent) => {
        setAgents([...agents, { ...newAgent, id: agents.length + 1 }])
        setIsDialogOpen(false)
    }

    const handleEditAgent = (agent) => {
        setEditingAgent(agent)
        setIsDialogOpen(true)
    }

    const handleUpdateAgent = (updatedAgent) => {
        setAgents(agents.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent))
        setIsDialogOpen(false)
        setEditingAgent(null)
    }

    const handleDeleteAgent = (id) => {
        setAgents(agents.filter(agent => agent.id !== id))
    }
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
            <main className="flex-grow flex items-center justify-center px-2 py-2 flex-col">
                <div className="bg-white p-4 rounded-lg shadow-lg w-full">
                    <div className="flex flex-col min-h-screen bg-gray-100">
                        {/* Top Navigation */}
                        <nav className="bg-white shadow-sm">
                            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center h-16">
                                    <div className="flex">
                                        <div className="flex-shrink-0 flex items-center">
                                            <MessageSquareIcon className="h-8 w-8"/>
                                            <span
                                                className="ml-2 text-2xl font-bold text-gradient-to-br from-green-400 to-blue-500">ChatCRM</span>
                                        </div>
                                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                            <Button
                                                variant="ghost"
                                                className={activeTab === "dashboard" ? "border-green-500 text-gray-900" : "text-gray-500"}
                                                onClick={() => setActiveTab("dashboard")}
                                            >
                                                Dashboard
                                            </Button>
                                            {/* Add more navigation items here */}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="relative">
                                                    <BellIcon className="h-5 w-5"/>
                                                    <span
                                                        className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem>New message received</DropdownMenuItem>
                                                <DropdownMenuItem>Ticket updated</DropdownMenuItem>
                                                <DropdownMenuItem>Broadcast approved</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="ml-3">
                                                    <Image className="h-8 w-8 rounded-full" src="/placeholder.svg"
                                                           alt="User avatar" width={24} height={24}/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem>
                                                    <LogOutIcon className="mr-2 h-4 w-4"/>
                                                    <span>Log out</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto p-4">
                            <Tabs defaultValue="dashboard" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                                    <TabsTrigger value="organization">Organization & Agents</TabsTrigger>
                                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                                    <TabsTrigger value="customers">Customers</TabsTrigger>
                                    <TabsTrigger value="chats">Chats</TabsTrigger>
                                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                                    <TabsTrigger value="menu-apps">Menu Apps</TabsTrigger>
                                    <TabsTrigger value="templates">Templates</TabsTrigger>
                                    <TabsTrigger value="schedules">Schedules</TabsTrigger>
                                </TabsList>

                                <TabsContent value="dashboard" className="space-y-4">
                                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card>
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">18,549</div>
                                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                                                <MessageCircle className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">423</div>
                                                <p className="text-xs text-muted-foreground">+180 since last hour</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                                                <Ticket className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">129</div>
                                                <p className="text-xs text-muted-foreground">+19% from last week</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader
                                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Pending
                                                    Broadcasts</CardTitle>
                                                <Radio className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">9</div>
                                                <p className="text-xs text-muted-foreground">3 require immediate
                                                    review</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Traffic Statistics</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[200px]">
                                                    {/* Add a chart component here */}
                                                    <p className="text-muted-foreground">Traffic chart for messages,
                                                        broadcasts, and menu apps</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Upcoming Broadcasts</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span>Weekly Newsletter</span>
                                                        <span className="text-muted-foreground">Tomorrow, 9:00 AM</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>Product Launch</span>
                                                        <span className="text-muted-foreground">Jul 15, 2:00 PM</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>Customer Survey</span>
                                                        <span className="text-muted-foreground">Jul 20, 10:00 AM</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="organization" className="space-y-4">
                                    <h2 className="text-2xl font-bold mb-4">Organization & Agents</h2>
                                    {/* Add organization and agent management content here */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Organization Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="org-name">Organization Name</Label>
                                                    <Input id="org-name" placeholder="Enter organization name"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="org-email">Organization Email</Label>
                                                    <Input id="org-email" type="email"
                                                           placeholder="Enter organization email"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="org-timezone">Timezone</Label>
                                                    <Input id="org-timezone" placeholder="Select timezone"/>
                                                </div>
                                                <Button type="submit">Save Changes</Button>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    {/* Agent Management */}
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle>Agent Management</CardTitle>
                                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button onClick={() => setEditingAgent(null)}>
                                                        <PlusIcon className="mr-2 h-4 w-4"/>
                                                        Add Agent
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
                                                        <DialogDescription>
                                                            {editingAgent ? 'Edit the agent details below.' : 'Enter the details for the new agent.'}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault()
                                                        const formData = new FormData(e.target)
                                                        const agentData = {
                                                            name: formData.get('name'),
                                                            email: formData.get('email'),
                                                            role: formData.get('role'),
                                                        }
                                                        if (editingAgent) {
                                                            handleUpdateAgent({...agentData, id: editingAgent.id})
                                                        } else {
                                                            handleAddAgent(agentData)
                                                        }
                                                    }}>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="name">Name</Label>
                                                                <Input id="name" name="name"
                                                                       defaultValue={editingAgent?.name} required/>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="email">Email</Label>
                                                                <Input id="email" name="email" type="email"
                                                                       defaultValue={editingAgent?.email} required/>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="role">Role</Label>
                                                                <Input id="role" name="role"
                                                                       defaultValue={editingAgent?.role} required/>
                                                            </div>
                                                        </div>
                                                        <DialogFooter className="mt-4">
                                                            <Button
                                                                type="submit">{editingAgent ? 'Update Agent' : 'Add Agent'}</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Role</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {agents.map((agent) => (
                                                        <TableRow key={agent.id}>
                                                            <TableCell>{agent.name}</TableCell>
                                                            <TableCell>{agent.email}</TableCell>
                                                            <TableCell>{agent.role}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button variant="outline" size="sm"
                                                                            onClick={() => handleEditAgent(agent)}>
                                                                        <PencilIcon className="h-4 w-4"/>
                                                                    </Button>
                                                                    <Button variant="outline" size="sm"
                                                                            onClick={() => handleDeleteAgent(agent.id)}>
                                                                        <TrashIcon className="h-4 w-4"/>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="integrations">
                                    <h2 className="text-2xl font-bold mb-4">Integrations</h2>
                                    {/* Add integrations management content here */}
                                </TabsContent>

                                <TabsContent value="customers">
                                    <h2 className="text-2xl font-bold mb-4">Customers Database</h2>
                                    {/* Add customer database and group management content here */}
                                </TabsContent>

                                <TabsContent value="chats">
                                    <h2 className="text-2xl font-bold mb-4">Chats</h2>
                                    {/* Add chat management content here */}
                                </TabsContent>

                                <TabsContent value="tickets">
                                    <h2 className="text-2xl font-bold mb-4">Tickets</h2>
                                    {/* Add ticket management content here */}
                                </TabsContent>

                                <TabsContent value="menu-apps">
                                    <h2 className="text-2xl font-bold mb-4">Menu Apps</h2>
                                    {/* Add menu app design content here */}
                                </TabsContent>

                                <TabsContent value="templates">
                                    <h2 className="text-2xl font-bold mb-4">Templates</h2>
                                    {/* Add template design content here */}
                                </TabsContent>

                                <TabsContent value="schedules">
                                    <h2 className="text-2xl font-bold mb-4">Schedules</h2>
                                    {/* Add schedule creation content here */}
                                </TabsContent>
                            </Tabs>
                        </main>
                    </div>
                </div>
            </main>
        </div>
    )
}