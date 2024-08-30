"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {PlusIcon, Search, Edit, Trash2, UserPlus, Settings, BarChart, Phone, TrashIcon, PencilIcon} from 'lucide-react'
import {ButtonIconDelete, ButtonIconEdit, ButtonSubmit} from "@/components/customButtons";

// Mock data for WhatsApp integrations
const initialWhatsAppIntegrations = [
    {
        id: 1,
        name: 'WhatsApp Business API 1',
        phoneNumberId: '1234567890',
        apiKey: 'whatsapp_api_key_123',
        status: 'Active',
    },
    {
        id: 2,
        name: 'WhatsApp Business API 2',
        phoneNumberId: '0987654321',
        apiKey: 'whatsapp_api_key_456',
        status: 'Inactive',
    },
]

// Mock data for other integrations
const initialOtherIntegrations = [
    {
        id: 1,
        name: 'Salesforce CRM',
        type: 'CRM',
        apiKey: 'salesforce_api_key_456',
        status: 'Active',
    },
    {
        id: 2,
        name: 'HubSpot CRM',
        type: 'CRM',
        apiKey: 'hubspot_api_key_789',
        status: 'Inactive',
    },
]

// Mock data for testing groups
const initialTestingGroups = [
    {
        id: 1,
        name: 'Beta Testers',
        whatsAppIds: [1],
    },
    {
        id: 2,
        name: 'VIP Customers',
        whatsAppIds: [1, 2],
    },
]

// Mock data for testing numbers
const initialTestingNumbers = [
    {
        id: 1,
        number: '+1234567890',
        name: 'John Doe',
        group: 'Beta Testers',
    },
    {
        id: 2,
        number: '+9876543210',
        name: 'Jane Smith',
        group: 'VIP Customers',
    },
]

const integrationTypes = ['CRM', 'Email Marketing', 'Payment Gateway']

export default function IntegrationsManagement() {
    const [whatsAppIntegrations, setWhatsAppIntegrations] = useState(initialWhatsAppIntegrations)
    const [otherIntegrations, setOtherIntegrations] = useState(initialOtherIntegrations)
    const [testingGroups, setTestingGroups] = useState(initialTestingGroups)
    const [testingNumbers, setTestingNumbers] = useState(initialTestingNumbers)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateWhatsAppIntegrationOpen, setIsCreateWhatsAppIntegrationOpen] = useState(false)
    const [isCreateOtherIntegrationOpen, setIsCreateOtherIntegrationOpen] = useState(false)
    const [isCreateTestingGroupOpen, setIsCreateTestingGroupOpen] = useState(false)
    const [isCreateTestingNumberOpen, setIsCreateTestingNumberOpen] = useState(false)
    const [newWhatsAppIntegration, setNewWhatsAppIntegration] = useState({ name: '', phoneNumberId: '', apiKey: '' })
    const [newOtherIntegration, setNewOtherIntegration] = useState({ name: '', type: '', apiKey: '' })
    const [newTestingGroup, setNewTestingGroup] = useState({ name: '', whatsAppIds: [] })
    const [newTestingNumber, setNewTestingNumber] = useState({ number: '', name: '', group: '' })
    const [editingWhatsAppIntegration, setEditingWhatsAppIntegration] = useState(null)
    const [editingOtherIntegration, setEditingOtherIntegration] = useState(null)
    const [editingTestingGroup, setEditingTestingGroup] = useState(null)
    const [editingTestingNumber, setEditingTestingNumber] = useState(null)

    const filteredWhatsAppIntegrations = whatsAppIntegrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredOtherIntegrations = otherIntegrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateWhatsAppIntegration = () => {
        setWhatsAppIntegrations([...whatsAppIntegrations, {
            ...newWhatsAppIntegration,
            id: whatsAppIntegrations.length + 1,
            status: 'Active'
        }])
        setNewWhatsAppIntegration({ name: '', phoneNumberId: '', apiKey: '' })
        setIsCreateWhatsAppIntegrationOpen(false)
    }

    const handleCreateOtherIntegration = () => {
        setOtherIntegrations([...otherIntegrations, {
            ...newOtherIntegration,
            id: otherIntegrations.length + 1,
            status: 'Active'
        }])
        setNewOtherIntegration({ name: '', type: '', apiKey: '' })
        setIsCreateOtherIntegrationOpen(false)
    }

    const handleCreateTestingGroup = () => {
        setTestingGroups([...testingGroups, {
            ...newTestingGroup,
            id: testingGroups.length + 1,
        }])
        setNewTestingGroup({ name: '', whatsAppIds: [] })
        setIsCreateTestingGroupOpen(false)
    }

    const handleCreateTestingNumber = () => {
        setTestingNumbers([...testingNumbers, {
            ...newTestingNumber,
            id: testingNumbers.length + 1,
        }])
        setNewTestingNumber({ number: '', name: '', group: '' })
        setIsCreateTestingNumberOpen(false)
    }

    const handleDeleteWhatsAppIntegration = (id: number) => {
        setWhatsAppIntegrations(whatsAppIntegrations.filter(integration => integration.id !== id))
    }

    const handleDeleteOtherIntegration = (id: number) => {
        setOtherIntegrations(otherIntegrations.filter(integration => integration.id !== id))
    }

    const handleDeleteTestingGroup = (id: number) => {
        setTestingGroups(testingGroups.filter(group => group.id !== id))
    }

    const handleDeleteTestingNumber = (id: number) => {
        setTestingNumbers(testingNumbers.filter(number => number.id !== id))
    }

    const handleEditWhatsAppIntegration = () => {
        setWhatsAppIntegrations(whatsAppIntegrations.map(integration =>
            integration.id === editingWhatsAppIntegration.id ? editingWhatsAppIntegration : integration
        ))
        setEditingWhatsAppIntegration(null)
    }

    const handleEditOtherIntegration = () => {
        setOtherIntegrations(otherIntegrations.map(integration =>
            integration.id === editingOtherIntegration.id ? editingOtherIntegration : integration
        ))
        setEditingOtherIntegration(null)
    }

    const handleEditTestingGroup = () => {
        setTestingGroups(testingGroups.map(group =>
            group.id === editingTestingGroup.id ? editingTestingGroup : group
        ))
        setEditingTestingGroup(null)
    }

    const handleEditTestingNumber = () => {
        setTestingNumbers(testingNumbers.map(number =>
            number.id === editingTestingNumber.id ? editingTestingNumber : number
        ))
        setEditingTestingNumber(null)
    }

    return (
        <div className="container mx-auto p-8">
            <Tabs defaultValue="whatsapp">
                <TabsList>
                    <TabsTrigger value="whatsapp">WhatsApp Integrations</TabsTrigger>
                    <TabsTrigger value="other">Other Integrations</TabsTrigger>
                    <TabsTrigger value="testing-groups">Testing Groups</TabsTrigger>
                    <TabsTrigger value="testing-numbers">Testing Numbers</TabsTrigger>
                </TabsList>
                <TabsContent value="whatsapp">
                    <Card
                        className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className={"text-jade-950"}>WhatsApp Integrations</CardTitle>
                            <Dialog open={isCreateWhatsAppIntegrationOpen} onOpenChange={setIsCreateWhatsAppIntegrationOpen}>
                                <DialogTrigger asChild>
                                    <ButtonSubmit>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add WhatsApp Integration
                                    </ButtonSubmit>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New WhatsApp Integration</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name:</Label>
                                            <Input
                                                id="name"
                                                placeholder="WhatsApp Integration Name"
                                                className="col-span-3"
                                                value={newWhatsAppIntegration.name}
                                                onChange={(e) => setNewWhatsAppIntegration({ ...newWhatsAppIntegration, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="phoneNumberId" className="text-right">Phone Number ID:</Label>
                                            <Input
                                                id="phoneNumberId"
                                                placeholder="Phone Number ID"
                                                className="col-span-3"
                                                value={newWhatsAppIntegration.phoneNumberId}
                                                onChange={(e) => setNewWhatsAppIntegration({ ...newWhatsAppIntegration, phoneNumberId: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="apiKey" className="text-right">API Key:</Label>
                                            <Input
                                                id="apiKey"
                                                placeholder="API Key"
                                                className="col-span-3"
                                                value={newWhatsAppIntegration.apiKey}
                                                onChange={(e) => setNewWhatsAppIntegration({ ...newWhatsAppIntegration, apiKey: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleCreateWhatsAppIntegration}>Add WhatsApp Integration</Button>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search WhatsApp integrations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64"
                                    />
                                </div>
                            </div>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Phone Number ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredWhatsAppIntegrations.map((integration) => (
                                            <TableRow key={integration.id}>
                                                <TableCell>{integration.name}</TableCell>
                                                <TableCell>{integration.phoneNumberId}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={integration.status === 'Active' ? 'default' : 'secondary'}
                                                        className={`${integration.status === 'Active'? "text-jade-950 bg-jade-500 hover:bg-jade-600 hover:text-jade-950": ""}`}
                                                    >
                                                        {integration.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <ButtonIconEdit  onClick={() => setEditingWhatsAppIntegration(integration)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </ButtonIconEdit>
                                                        <ButtonIconDelete onClick={() => handleDeleteWhatsAppIntegration(integration.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </ButtonIconDelete>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="other">
                    <Card
                        className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className={"text-jade-950"}>Other Integrations</CardTitle>
                            <Dialog open={isCreateOtherIntegrationOpen} onOpenChange={setIsCreateOtherIntegrationOpen}>
                                <DialogTrigger asChild>
                                    <ButtonSubmit>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add Integration
                                    </ButtonSubmit>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className={"text-jade-950"}>Add New Integration</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right text-jade-950">Name:</Label>
                                            <Input
                                                id="name"
                                                placeholder="Integration Name"
                                                className="col-span-3"
                                                value={newOtherIntegration.name}
                                                onChange={(e) => setNewOtherIntegration({ ...newOtherIntegration, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="type" className="text-right text-jade-950">Type:</Label>
                                            <Select
                                                value={newOtherIntegration.type}
                                                onValueChange={(value) => setNewOtherIntegration({ ...newOtherIntegration, type: value })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select integration type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {integrationTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="apiKey" className="text-right text-jade-950">API Key:</Label>
                                            <Input
                                                id="apiKey"
                                                placeholder="API Key"
                                                className="col-span-3"
                                                value={newOtherIntegration.apiKey}
                                                onChange={(e) => setNewOtherIntegration({ ...newOtherIntegration, apiKey: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <ButtonSubmit onClick={handleCreateOtherIntegration}>Add Integration</ButtonSubmit>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search integrations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64"
                                    />
                                </div>
                            </div>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOtherIntegrations.map((integration) => (
                                            <TableRow key={integration.id}>
                                                <TableCell>{integration.name}</TableCell>
                                                <TableCell>{integration.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant={integration.status === 'Active' ? 'default' : 'secondary'}
                                                           className={`${integration.status === 'Active'? "text-jade-950 bg-jade-500 hover:bg-jade-600 hover:text-jade-950": ""}`}
                                                    >
                                                        {integration.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <ButtonIconEdit  onClick={() => setEditingOtherIntegration(integration)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </ButtonIconEdit>
                                                        <ButtonIconDelete  onClick={() => handleDeleteOtherIntegration(integration.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </ButtonIconDelete>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="testing-groups">
                    <Card
                        className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className={"text-jade-950"}>Testing Groups</CardTitle>
                            <Dialog open={isCreateTestingGroupOpen} onOpenChange={setIsCreateTestingGroupOpen}>
                                <DialogTrigger asChild>
                                    <ButtonSubmit>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Testing Group
                                    </ButtonSubmit>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className={"text-jade-950"}>Create New Testing Group</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name:</Label>
                                            <Input
                                                id="name"
                                                placeholder="Testing Group Name"
                                                className="col-span-3"
                                                value={newTestingGroup.name}
                                                onChange={(e) => setNewTestingGroup({ ...newTestingGroup, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="whatsAppIds" className="text-right text-jade-950">WhatsApp IDs:</Label>
                                            <Select
                                                value={newTestingGroup.whatsAppIds.map(String)}
                                                onValueChange={(values) => setNewTestingGroup({ ...newTestingGroup, whatsAppIds: values.map(Number) })}
                                                multiple
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select WhatsApp IDs" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {whatsAppIntegrations.map((integration) => (
                                                        <SelectItem key={integration.id} value={integration.id.toString()}>
                                                            {integration.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <ButtonSubmit onClick={handleCreateTestingGroup}>Create Testing Group</ButtonSubmit>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>WhatsApp Integrations</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testingGroups.map((group) => (
                                            <TableRow key={group.id}>
                                                <TableCell>{group.name}</TableCell>
                                                <TableCell>
                                                    {group.whatsAppIds.map(id =>
                                                        whatsAppIntegrations.find(integration => integration.id === id)?.name
                                                    ).join(', ')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <ButtonIconEdit  onClick={() => setEditingTestingGroup(group)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </ButtonIconEdit>
                                                        <ButtonIconDelete onClick={() => handleDeleteTestingGroup(group.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </ButtonIconDelete>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="testing-numbers">
                    <Card
                        className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className={"text-jade-950"}>Testing Numbers</CardTitle>
                            <Dialog open={isCreateTestingNumberOpen} onOpenChange={setIsCreateTestingNumberOpen}>
                                <DialogTrigger asChild>
                                    <ButtonSubmit>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add Testing Number
                                    </ButtonSubmit>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className={"text-jade-950"}>Add New Testing Number</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="number" className="text-right text-jade-950">Number:</Label>
                                            <Input
                                                id="number"
                                                placeholder="Phone Number"
                                                className="col-span-3"
                                                value={newTestingNumber.number}
                                                onChange={(e) => setNewTestingNumber({ ...newTestingNumber, number: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name:</Label>
                                            <Input
                                                id="name"
                                                placeholder="Contact Name"
                                                className="col-span-3"
                                                value={newTestingNumber.name}
                                                onChange={(e) => setNewTestingNumber({ ...newTestingNumber, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="group" className="text-right">Group:</Label>
                                            <Select
                                                value={newTestingNumber.group}
                                                onValueChange={(value) => setNewTestingNumber({ ...newTestingNumber, group: value })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select testing group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {testingGroups.map((group) => (
                                                        <SelectItem key={group.id} value={group.name}>
                                                            {group.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <ButtonSubmit onClick={handleCreateTestingNumber}>Add Testing Number</ButtonSubmit>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Number</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Group</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testingNumbers.map((number) => (
                                            <TableRow key={number.id}>
                                                <TableCell>{number.number}</TableCell>
                                                <TableCell>{number.name}</TableCell>
                                                <TableCell>{number.group}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <ButtonIconEdit onClick={() => setEditingTestingNumber(number)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </ButtonIconEdit>
                                                        <ButtonIconDelete onClick={() => handleDeleteTestingNumber(number.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </ButtonIconDelete>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Modals */}
            <Dialog open={!!editingWhatsAppIntegration} onOpenChange={() => setEditingWhatsAppIntegration(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className={"text-jade-950"}>Edit WhatsApp Integration</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name:</Label>
                            <Input
                                id="edit-name"
                                placeholder="WhatsApp Integration Name"
                                className="col-span-3"
                                value={editingWhatsAppIntegration?.name}
                                onChange={(e) => setEditingWhatsAppIntegration({ ...editingWhatsAppIntegration, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phoneNumberId" className="text-right">Phone Number ID:</Label>
                            <Input
                                id="edit-phoneNumberId"
                                placeholder="Phone Number ID"
                                className="col-span-3"
                                value={editingWhatsAppIntegration?.phoneNumberId}
                                onChange={(e) => setEditingWhatsAppIntegration({ ...editingWhatsAppIntegration, phoneNumberId: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-apiKey" className="text-right">API Key:</Label>
                            <Input
                                id="edit-apiKey"
                                placeholder="API Key"
                                className="col-span-3"
                                value={editingWhatsAppIntegration?.apiKey}
                                onChange={(e) => setEditingWhatsAppIntegration({ ...editingWhatsAppIntegration, apiKey: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleEditWhatsAppIntegration}>Save Changes</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingOtherIntegration} onOpenChange={() => setEditingOtherIntegration(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Integration</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name:</Label>
                            <Input
                                id="edit-name"
                                placeholder="Integration Name"
                                className="col-span-3"
                                value={editingOtherIntegration?.name}
                                onChange={(e) => setEditingOtherIntegration({ ...editingOtherIntegration, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">Type:</Label>
                            <Select
                                value={editingOtherIntegration?.type}
                                onValueChange={(value) => setEditingOtherIntegration({ ...editingOtherIntegration, type: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select integration type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {integrationTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-apiKey" className="text-right">API Key:</Label>
                            <Input
                                id="edit-apiKey"
                                placeholder="API Key"
                                className="col-span-3"
                                value={editingOtherIntegration?.apiKey}
                                onChange={(e) => setEditingOtherIntegration({ ...editingOtherIntegration, apiKey: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleEditOtherIntegration}>Save Changes</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingTestingGroup} onOpenChange={() => setEditingTestingGroup(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Testing Group</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name:</Label>
                            <Input
                                id="edit-name"
                                placeholder="Testing Group Name"
                                className="col-span-3"
                                value={editingTestingGroup?.name}
                                onChange={(e) => setEditingTestingGroup({ ...editingTestingGroup, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-whatsAppIds" className="text-right">WhatsApp IDs:</Label>
                            <Select
                                value={editingTestingGroup?.whatsAppIds.map(String)}
                                onValueChange={(values) => setEditingTestingGroup({ ...editingTestingGroup, whatsAppIds: values.map(Number) })}
                                multiple
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select WhatsApp IDs" />
                                </SelectTrigger>
                                <SelectContent>
                                    {whatsAppIntegrations.map((integration) => (
                                        <SelectItem key={integration.id} value={integration.id.toString()}>
                                            {integration.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleEditTestingGroup}>Save Changes</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingTestingNumber} onOpenChange={() => setEditingTestingNumber(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Testing Number</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-number" className="text-right">Number:</Label>
                            <Input
                                id="edit-number"
                                placeholder="Phone Number"
                                className="col-span-3"
                                value={editingTestingNumber?.number}
                                onChange={(e) => setEditingTestingNumber({ ...editingTestingNumber, number: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name:</Label>
                            <Input
                                id="edit-name"
                                placeholder="Contact Name"
                                className="col-span-3"
                                value={editingTestingNumber?.name}
                                onChange={(e) => setEditingTestingNumber({ ...editingTestingNumber, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-group" className="text-right">Group:</Label>
                            <Select
                                value={editingTestingNumber?.group}
                                onValueChange={(value) => setEditingTestingNumber({ ...editingTestingNumber, group: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select testing group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {testingGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.name}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleEditTestingNumber}>Save Changes</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}