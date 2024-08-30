"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, Search, Edit, Trash2, Eye } from 'lucide-react'

// Initial integrations data
const initialIntegrations = [
    {
        id: 1,
        name: 'WhatsApp Business API',
        type: 'WhatsApp',
        apiKey: 'whatsapp_api_key_123',
        phoneNumberId: '1234567890',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Salesforce CRM',
        type: 'CRM',
        apiKey: 'salesforce_api_key_456',
        instanceUrl: 'https://mycompany.salesforce.com',
        status: 'Active',
    },
    {
        id: 3,
        name: 'HubSpot CRM',
        type: 'CRM',
        apiKey: 'hubspot_api_key_789',
        portalId: '7890123',
        status: 'Inactive',
    },
]

const integrationTypes = ['WhatsApp', 'CRM', 'Email Marketing', 'Payment Gateway']

export default function IntegrationsManagement() {
    const [integrations, setIntegrations] = useState(initialIntegrations)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateIntegrationOpen, setIsCreateIntegrationOpen] = useState(false)
    const [isEditIntegrationOpen, setIsEditIntegrationOpen] = useState(false)
    const [editingIntegration, setEditingIntegration] = useState<typeof initialIntegrations[0] | null>(null)
    const [newIntegration, setNewIntegration] = useState({
        name: '',
        type: '',
        apiKey: '',
        phoneNumberId: '',
        instanceUrl: '',
        portalId: '',
        status: 'Inactive',
    })

    const filteredIntegrations = integrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateIntegration = () => {
        setIntegrations([...integrations, {
            ...newIntegration,
            id: integrations.length + 1,
        }])
        setNewIntegration({
            name: '',
            type: '',
            apiKey: '',
            phoneNumberId: '',
            instanceUrl: '',
            portalId: '',
            status: 'Inactive',
        })
        setIsCreateIntegrationOpen(false)
    }

    const handleEditIntegration = () => {
        if (editingIntegration) {
            setIntegrations(integrations.map(integration =>
                integration.id === editingIntegration.id ? editingIntegration : integration
            ))
            setIsEditIntegrationOpen(false)
            setEditingIntegration(null)
        }
    }

    const handleDeleteIntegration = (id: number) => {
        setIntegrations(integrations.filter(integration => integration.id !== id))
    }

    const IntegrationForm = ({ integration, isEditing }: { integration: typeof newIntegration, isEditing: boolean }) => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name:</Label>
                <Input
                    id="name"
                    placeholder="Integration Name"
                    className="col-span-3"
                    value={integration.name}
                    onChange={(e) => isEditing && editingIntegration
                        ? setEditingIntegration({ ...editingIntegration, name: e.target.value })
                        : setNewIntegration({ ...newIntegration, name: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type:</Label>
                <Select
                    value={integration.type}
                    onValueChange={(value) => isEditing && editingIntegration
                        ? setEditingIntegration({ ...editingIntegration, type: value })
                        : setNewIntegration({ ...newIntegration, type: value })}
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
                <Label htmlFor="apiKey" className="text-right">API Key:</Label>
                <Input
                    id="apiKey"
                    placeholder="API Key"
                    className="col-span-3"
                    value={integration.apiKey}
                    onChange={(e) => isEditing && editingIntegration
                        ? setEditingIntegration({ ...editingIntegration, apiKey: e.target.value })
                        : setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                />
            </div>
            {integration.type === 'WhatsApp' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumberId" className="text-right">Phone Number ID:</Label>
                    <Input
                        id="phoneNumberId"
                        placeholder="Phone Number ID"
                        className="col-span-3"
                        value={integration.phoneNumberId}
                        onChange={(e) => isEditing && editingIntegration
                            ? setEditingIntegration({ ...editingIntegration, phoneNumberId: e.target.value })
                            : setNewIntegration({ ...newIntegration, phoneNumberId: e.target.value })}
                    />
                </div>
            )}
            {integration.type === 'CRM' && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instanceUrl" className="text-right">Instance URL:</Label>
                        <Input
                            id="instanceUrl"
                            placeholder="Instance URL"
                            className="col-span-3"
                            value={integration.instanceUrl}
                            onChange={(e) => isEditing && editingIntegration
                                ? setEditingIntegration({ ...editingIntegration, instanceUrl: e.target.value })
                                : setNewIntegration({ ...newIntegration, instanceUrl: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="portalId" className="text-right">Portal ID:</Label>
                        <Input
                            id="portalId"
                            placeholder="Portal ID"
                            className="col-span-3"
                            value={integration.portalId}
                            onChange={(e) => isEditing && editingIntegration
                                ? setEditingIntegration({ ...editingIntegration, portalId: e.target.value })
                                : setNewIntegration({ ...newIntegration, portalId: e.target.value })}
                        />
                    </div>
                </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status:</Label>
                <Select
                    value={integration.status}
                    onValueChange={(value) => isEditing && editingIntegration
                        ? setEditingIntegration({ ...editingIntegration, status: value })
                        : setNewIntegration({ ...newIntegration, status: value })}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )

    return (
        <div className="p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>System Integrations</CardTitle>
                    <Dialog open={isCreateIntegrationOpen} onOpenChange={setIsCreateIntegrationOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Integration
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Integration</DialogTitle>
                            </DialogHeader>
                            <IntegrationForm integration={newIntegration} isEditing={false} />
                            <Button onClick={handleCreateIntegration}>Add Integration</Button>
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
                                {filteredIntegrations.map((integration) => (
                                    <TableRow key={integration.id}>
                                        <TableCell>{integration.name}</TableCell>
                                        <TableCell>{integration.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={integration.status === 'Active' ? 'default' : 'secondary'}>
                                                {integration.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    setEditingIntegration(integration)
                                                    setIsEditIntegrationOpen(true)
                                                }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteIntegration(integration.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Dialog open={isEditIntegrationOpen} onOpenChange={setIsEditIntegrationOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Integration</DialogTitle>
                    </DialogHeader>
                    {editingIntegration && (
                        <>
                            <IntegrationForm integration={editingIntegration} isEditing={true} />
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setIsEditIntegrationOpen(false)}>Cancel</Button>
                                <Button onClick={handleEditIntegration}>Save Changes</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}