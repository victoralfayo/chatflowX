"use client"

import { useState, useCallback } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Node,
    Edge,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PlusIcon, Search, ArrowRight, Settings, BarChart, Save, MessageSquare, PhoneCall, AlertCircle, Variable } from 'lucide-react'

// Custom node types
const nodeTypes = {
    whatsappTemplate: ({ data }) => (
        <div className="bg-white border-2 border-green-200 rounded p-3 shadow-md max-w-sm">
            <div className="font-bold border-b pb-2 mb-2">{data.header}</div>
            <div className="mb-2">{data.body}</div>
            <div className="text-sm text-gray-500 border-t pt-2">{data.footer}</div>
            {data.buttons && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {data.buttons.map((button, index) => (
                        <Button key={index} variant="outline" size="sm">{button}</Button>
                    ))}
                </div>
            )}
        </div>
    ),
    apiCall: ({ data }) => (
        <div className="bg-white border-2 border-blue-200 rounded p-3 shadow-md">
            <PhoneCall className="inline-block mr-2" />
            <span>{data.label}</span>
        </div>
    ),
    condition: ({ data }) => (
        <div className="bg-white border-2 border-yellow-200 rounded p-3 shadow-md">
            <AlertCircle className="inline-block mr-2" />
            <span>{data.label}</span>
        </div>
    ),
    setVariable: ({ data }) => (
        <div className="bg-white border-2 border-purple-200 rounded p-3 shadow-md">
            <Variable className="inline-block mr-2" />
            <span>{data.label}</span>
        </div>
    ),
};

// Step templates
const stepTemplates = {
    'Welcome Message': [
        {
            id: '1',
            type: 'whatsappTemplate',
            data: {
                label: 'Welcome Message',
                header: 'Welcome!',
                body: 'Hello {{1}}, welcome to our service!',
                footer: 'Reply with a number to continue',
                buttons: ['1. English', '2. Español']
            }
        },
        {
            id: '2',
            type: 'condition',
            data: {
                label: 'Language Selection',
                variable: 'input',
                operator: '==',
                value: '"1"'
            }
        },
        {
            id: '3',
            type: 'whatsappTemplate',
            data: {
                label: 'English Selected',
                header: 'Language Set',
                body: 'You have selected English. How can we help you today?',
                footer: 'Choose an option below',
                buttons: ['Check Order', 'Support', 'More Info']
            }
        },
        {
            id: '4',
            type: 'whatsappTemplate',
            data: {
                label: 'Spanish Selected',
                header: 'Idioma Configurado',
                body: 'Has seleccionado Español. ¿Cómo podemos ayudarte hoy?',
                footer: 'Elige una opción abajo',
                buttons: ['Verificar Orden', 'Soporte', 'Más Información']
            }
        },
    ],
    'Order Status Check': [
        {
            id: '1',
            type: 'whatsappTemplate',
            data: {
                label: 'Order Number Request',
                header: 'Check Order Status',
                body: 'Please enter your order number:',
                footer: 'Reply with your order number'
            }
        },
        {
            id: '2',
            type: 'apiCall',
            data: {
                label: 'Check Order Status',
                endpoint: '/api/order/{{input}}',
                method: 'GET',
                payload: '{ "orderId": "{{input}}" }'
            }
        },
        {
            id: '3',
            type: 'setVariable',
            data: {
                label: 'Set Order Status',
                variableName: 'orderStatus',
                value: '{{response.status}}'
            }
        },
        {
            id: '4',
            type: 'condition',
            data: {
                label: 'Order Shipped?',
                variable: 'orderStatus',
                operator: '==',
                value: '"shipped"'
            }
        },
        {
            id: '5',
            type: 'whatsappTemplate',
            data: {
                label: 'Order Shipped',
                header: 'Order Status',
                body: 'Your order #{{input}} has been shipped.',
                footer: 'Thank you for your business!',
                buttons: ['Track Package', 'Need Help?']
            }
        },
        {
            id: '6',
            type: 'whatsappTemplate',
            data: {
                label: 'Order Processing',
                header: 'Order Status',
                body: 'Your order #{{input}} is still being processed.',
                footer: 'We\'ll notify you when it ships.',
                buttons: ['Estimated Delivery', 'Cancel Order']
            }
        },
    ],
}

// Mock data for automation flows
const initialFlows = [
    {
        id: 1,
        name: 'Welcome Flow',
        type: 'USSD',
        status: 'Active',
        steps: stepTemplates['Welcome Message'],
        usage: { calls: 1000, lastUsed: '2023-06-10 14:30' }
    },
    {
        id: 2,
        name: 'Order Status Check',
        type: 'API Integration',
        status: 'Active',
        steps: stepTemplates['Order Status Check'],
        usage: { calls: 500, lastUsed: '2023-06-11 09:15' }
    },
]

export default function AutomationDashboard() {
    const [flows, setFlows] = useState(initialFlows)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false)
    const [newFlow, setNewFlow] = useState({ name: '', type: 'USSD', steps: [] })
    const [selectedFlow, setSelectedFlow] = useState<typeof initialFlows[0] | null>(null)
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const filteredFlows = flows.filter(flow =>
        flow.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateFlow = () => {
        const newFlowData = {
            ...newFlow,
            id: flows.length + 1,
            status: 'Active',
            usage: { calls: 0, lastUsed: 'N/A' }
        }
        setFlows([...flows, newFlowData])
        setNewFlow({ name: '', type: 'USSD', steps: [] })
        setIsCreateFlowOpen(false)

        // Initialize flow visualization
        const initialNodes = newFlowData.steps.map((step, index) => ({
            id: step.id,
            type: step.type,
            data: { ...step.data },
            position: { x: 250, y: index * 150 },
        }))
        const initialEdges = newFlowData.steps.slice(0, -1).map((step, index) => ({
            id: `e${index}-${index+1}`,
            source: step.id,
            target: newFlowData.steps[index+1].id,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
        }))
        setNodes(initialNodes)
        setEdges(initialEdges)
    }

    const handleAddStep = (type: string) => {
        if (selectedFlow) {
            const newStep = {
                id: (selectedFlow.steps.length + 1).toString(),
                type,
                data: type === 'whatsappTemplate'
                    ? {
                        label: 'New Message',
                        header: 'Header',
                        body: 'Message body',
                        footer: 'Footer',
                        buttons: ['Button 1', 'Button 2']
                    }
                    : type === 'apiCall'
                        ? {
                            label: 'API Call',
                            endpoint: '/api/endpoint',
                            method: 'GET',
                            payload: '{}'
                        }
                        : type === 'condition'
                            ? {
                                label: 'New Condition',
                                variable: 'variable',
                                operator: '==',
                                value: 'value'
                            }
                            : {
                                label: 'Set Variable',
                                variableName: 'newVariable',
                                value: 'value'
                            }
            }
            const updatedFlow = {
                ...selectedFlow,
                steps: [...selectedFlow.steps, newStep]
            }
            setFlows(flows.map(flow => flow.id === selectedFlow.id ? updatedFlow : flow))
            setSelectedFlow(updatedFlow)

            // Update flow visualization
            const newNode = {
                id: newStep.id,
                type: newStep.type,
                data: { ...newStep.data },
                position: { x: 250, y: selectedFlow.steps.length * 150 },
            }
            setNodes((nds) => [...nds, newNode])
            if (selectedFlow.steps.length > 0) {
                const newEdge = {
                    id: `e${selectedFlow.steps.length-1}-${selectedFlow.steps.length}`,
                    source: selectedFlow.steps[selectedFlow.steps.length-1].id,
                    target: newStep.id,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                }
                setEdges((eds) => [...eds, newEdge])
            }
        }
    }

    const handleUpdateStep = (stepId: string, updates: Partial<typeof selectedFlow.steps[0]['data']>) => {
        if (selectedFlow) {
            const updatedSteps = selectedFlow.steps.map(step =>
                step.id === stepId ? { ...step, data: { ...step.data, ...updates } } : step
            )
            const updatedFlow = { ...selectedFlow, steps: updatedSteps }
            setFlows(flows.map(flow => flow.id === selectedFlow.id ? updatedFlow : flow))
            setSelectedFlow(updatedFlow)

            // Update flow visualization
            setNodes((nds) => nds.map(node =>
                node.id === stepId ? { ...node, data: { ...node.data, ...updates } } : node
            ))
        }
    }

    const handleApplyTemplate = (templateName: string) => {
        const template = stepTemplates[templateName]
        if (template && selectedFlow) {
            const updatedFlow = {
                ...selectedFlow,
                steps: template
            }
            setFlows(flows.map(flow => flow.id === selectedFlow.id ? updatedFlow : flow))
            setSelectedFlow(updatedFlow)
            setNodes(template.map((step, index) => ({
                id: step.id,
                type: step.type,
                data: { ...step.data },
                position: { x: 250, y: index * 150 },
            })))
            setEdges(template.slice(0, -1).map((step, index) => ({
                id: `e${index}-${index+1}`,
                source: step.id,
                target: template[index+1].id,
                type: 'smoothstep',
                markerEnd: { type: MarkerType.ArrowClosed },
            })))
        }
    }

    const handleSaveAsTemplate = () => {
        if (selectedFlow) {
            stepTemplates[selectedFlow.name] = selectedFlow.steps
            // In a real application, you'd want to persist this to a backend
            alert(`Template "${selectedFlow.name}" saved!`)
        }
    }

    return (
        <div className="p-8">
            <Tabs defaultValue="flows">
                <TabsList>
                    <TabsTrigger value="flows">Automation Flows</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="flows">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Automation Flows</CardTitle>
                            <Dialog open={isCreateFlowOpen} onOpenChange={setIsCreateFlowOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Flow
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Automation Flow</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input
                                            placeholder="Flow Name"
                                            value={newFlow.name}
                                            onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                                        />
                                        <Select
                                            value={newFlow.type}
                                            onValueChange={(value) => setNewFlow({ ...newFlow, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select flow type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USSD">USSD</SelectItem>
                                                <SelectItem value="API Integration">API Integration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleCreateFlow}>Create Flow</Button>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search flows..."
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
                                            <TableHead>Total Calls</TableHead>
                                            <TableHead>Last Used</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFlows.map((flow) => (
                                            <TableRow key={flow.id}>
                                                <TableCell>{flow.name}</TableCell>
                                                <TableCell>{flow.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant={flow.status === 'Active' ? 'default' : 'secondary'}>
                                                        {flow.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{flow.usage.calls}</TableCell>
                                                <TableCell>{flow.usage.lastUsed}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedFlow(flow)}>
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
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
                            <CardTitle>Automation Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Flows</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{flows.length}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Calls</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {flows.reduce((sum, flow) => sum + flow.usage.calls, 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Most Used Flow</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl font-bold">
                                            {flows.reduce((max, flow) => max.usage.calls > flow.usage.calls ? max : flow).name}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {selectedFlow && (
                <Dialog open={!!selectedFlow} onOpenChange={() => setSelectedFlow(null)}>
                    <DialogContent className="max-w-[90vw] w-full h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Edit Flow: {selectedFlow.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex h-full">
                            <div className="w-1/3 pr-4 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Steps</h3>
                                    <div className="space-x-2">
                                        <Button size="sm" onClick={() => handleAddStep('whatsappTemplate')}>Add Message</Button>
                                        <Button size="sm" onClick={() => handleAddStep('apiCall')}>Add API Call</Button>
                                        <Button size="sm" onClick={() => handleAddStep('condition')}>Add Condition</Button>
                                        <Button size="sm" onClick={() => handleAddStep('setVariable')}>Set Variable</Button>
                                    </div>
                                </div>
                                <ScrollArea className="h-[calc(100vh-16rem)]">
                                    {selectedFlow.steps.map((step, index) => (
                                        <div key={step.id} className="flex flex-col space-y-2 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Badge>{index + 1}</Badge>
                                                <Badge variant="outline">{step.type}</Badge>
                                                <Input
                                                    value={step.data.label}
                                                    onChange={(e) => handleUpdateStep(step.id, { label: e.target.value })}
                                                />
                                            </div>
                                            {step.type === 'whatsappTemplate' && (
                                                <>
                                                    <Input
                                                        value={step.data.header}
                                                        onChange={(e) => handleUpdateStep(step.id, { header: e.target.value })}
                                                        placeholder="Header"
                                                    />
                                                    <Textarea
                                                        value={step.data.body}
                                                        onChange={(e) => handleUpdateStep(step.id, { body: e.target.value })}
                                                        placeholder="Body (use {{1}}, {{2}}, etc. for variables)"
                                                    />
                                                    <Input
                                                        value={step.data.footer}
                                                        onChange={(e) => handleUpdateStep(step.id, { footer: e.target.value })}
                                                        placeholder="Footer"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {step.data.buttons?.map((button, buttonIndex) => (
                                                            <Input
                                                                key={buttonIndex}
                                                                value={button}
                                                                onChange={(e) => {
                                                                    const newButtons = [...step.data.buttons];
                                                                    newButtons[buttonIndex] = e.target.value;
                                                                    handleUpdateStep(step.id, { buttons: newButtons });
                                                                }}
                                                                className="w-auto"
                                                            />
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newButtons = [...(step.data.buttons || []), 'New Button'];
                                                                handleUpdateStep(step.id, { buttons: newButtons });
                                                            }}
                                                        >
                                                            Add Button
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                            {step.type === 'apiCall' && (
                                                <>
                                                    <Input
                                                        value={step.data.endpoint}
                                                        onChange={(e) => handleUpdateStep(step.id, { endpoint: e.target.value })}
                                                        placeholder="API Endpoint"
                                                    />
                                                    <Select
                                                        value={step.data.method}
                                                        onValueChange={(value) => handleUpdateStep(step.id, { method: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="HTTP Method" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="GET">GET</SelectItem>
                                                            <SelectItem value="POST">POST</SelectItem>
                                                            <SelectItem value="PUT">PUT</SelectItem>
                                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Textarea
                                                        value={step.data.payload}
                                                        onChange={(e) => handleUpdateStep(step.id, { payload: e.target.value })}
                                                        placeholder="Request Payload (JSON)"
                                                    />
                                                </>
                                            )}
                                            {step.type === 'condition' && (
                                                <div className="flex items-center space-x-2">
                                                    <Select
                                                        value={step.data.variable}
                                                        onValueChange={(value) => handleUpdateStep(step.id, { variable: value })}
                                                    >
                                                        <SelectTrigger className="w-[120px]">
                                                            <SelectValue placeholder="Variable" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="input">input</SelectItem>
                                                            <SelectItem value="orderStatus">orderStatus</SelectItem>
                                                            {/* Add more variables as needed */}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select
                                                        value={step.data.operator}
                                                        onValueChange={(value) => handleUpdateStep(step.id, { operator: value })}
                                                    >
                                                        <SelectTrigger className="w-[80px]">
                                                            <SelectValue placeholder="Operator" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="==">==</SelectItem>
                                                            <SelectItem value="!=">!=</SelectItem>
                                                            <SelectItem value=">">{'>'}</SelectItem>
                                                            <SelectItem value="<">{'<'}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        value={step.data.value}
                                                        onChange={(e) => handleUpdateStep(step.id, { value: e.target.value })}
                                                        placeholder="Value"
                                                        className="flex-grow"
                                                    />
                                                </div>
                                            )}
                                            {step.type === 'setVariable' && (
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        value={step.data.variableName}
                                                        onChange={(e) => handleUpdateStep(step.id, { variableName: e.target.value })}
                                                        placeholder="Variable Name"
                                                        className="w-1/2"
                                                    />
                                                    <Input
                                                        value={step.data.value}
                                                        onChange={(e) => handleUpdateStep(step.id, { value: e.target.value })}
                                                        placeholder="Value"
                                                        className="w-1/2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </ScrollArea>
                            </div>
                            <div className="w-2/3 border rounded-md">
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    nodeTypes={nodeTypes}
                                    fitView
                                >
                                    <Controls />
                                    <MiniMap />
                                    <Background variant="dots" gap={12} size={1} />
                                </ReactFlow>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <Select onValueChange={handleApplyTemplate}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Apply Template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(stepTemplates).map((templateName) => (
                                        <SelectItem key={templateName} value={templateName}>
                                            {templateName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSaveAsTemplate}>
                                <Save className="mr-2 h-4 w-4" />
                                Save as Template
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}