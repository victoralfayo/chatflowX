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
    Edge
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
import { PlusIcon, Search, ArrowRight, Settings, BarChart, Save } from 'lucide-react'

// Step templates
const stepTemplates = {
    'Welcome Message': [
        { id: '1', type: 'message', data: { label: 'Welcome to our service!' } },
        { id: '2', type: 'input', data: { label: 'Enter 1 for English, 2 for Spanish' } },
        { id: '3', type: 'condition', data: { label: 'Language Selection' } },
        { id: '4', type: 'message', data: { label: 'You selected English' } },
        { id: '5', type: 'message', data: { label: 'You selected Spanish' } },
    ],
    'Order Status Check': [
        { id: '1', type: 'input', data: { label: 'Enter order number' } },
        { id: '2', type: 'api', data: { label: 'Check order status' } },
        { id: '3', type: 'condition', data: { label: 'Order shipped?' } },
        { id: '4', type: 'message', data: { label: 'Your order has been shipped' } },
        { id: '5', type: 'message', data: { label: 'Your order is being processed' } },
    ],
}

// Mock data for automation flows
const initialFlows = [
    {
        id: 1,
        name: 'Welcome Message',
        type: 'USSD',
        status: 'Active',
        steps: [
            { id: '1', type: 'message', data: { label: 'Welcome to our service!' } },
            { id: '2', type: 'input', data: { label: 'Enter 1 for English, 2 for Spanish' } },
            { id: '3', type: 'condition', data: { label: 'Language Selection' } },
            { id: '4', type: 'message', data: { label: 'You selected English' } },
            { id: '5', type: 'message', data: { label: 'You selected Spanish' } }
        ],
        usage: { calls: 1000, lastUsed: '2023-06-10 14:30' }
    },
    {
        id: 2,
        name: 'Order Status Check',
        type: 'Business Process',
        status: 'Active',
        steps: [
            { id: '1', type: 'input', data: { label: 'Please enter your order number' } },
            { id: '2', type: 'api', data: { label: 'GET /api/order/{input}' } },
            { id: '3', type: 'condition', data: { label: 'if order_status == "shipped" goto 4 else goto 5' } },
            { id: '4', type: 'message', data: { label: 'Your order has been shipped' } },
            { id: '5', type: 'message', data: { label: 'Your order is being processed' } }
        ],
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
            id: step.id.toString(),
            type: step.type,
            data: { label: step.data.label },
            position: { x: 250, y: index * 100 },
        }))
        const initialEdges = newFlowData.steps.slice(0, -1).map((step, index) => ({
            id: `e${index}-${index+1}`,
            source: step.id.toString(),
            target: newFlowData.steps[index+1].id.toString(),
            type: 'smoothstep',
        }))
        setNodes(initialNodes)
        setEdges(initialEdges)
    }

    const handleAddStep = (type: string) => {
        if (selectedFlow) {
            const newStep = {
                id: (selectedFlow.steps.length + 1).toString(),
                type,
                data: { label: type === 'message' ? 'Enter message' : type === 'input' ? 'Enter prompt' : 'Enter condition' }
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
                data: newStep.data,
                position: { x: 250, y: selectedFlow.steps.length * 100 },
            }
            setNodes((nds) => [...nds, newNode])
            if (selectedFlow.steps.length > 0) {
                const newEdge = {
                    id: `e${selectedFlow.steps.length-1}-${selectedFlow.steps.length}`,
                    source: selectedFlow.steps[selectedFlow.steps.length-1].id.toString(),
                    target: newStep.id,
                    type: 'smoothstep',
                }
                setEdges((eds) => [...eds, newEdge])
            }
        }
    }

    const handleUpdateStep = (stepId: string, content: string) => {
        if (selectedFlow) {
            const updatedSteps = selectedFlow.steps.map(step =>
                step.id === stepId ? { ...step, data: { label: content } } : step
            )
            const updatedFlow = { ...selectedFlow, steps: updatedSteps }
            setFlows(flows.map(flow => flow.id === selectedFlow.id ? updatedFlow : flow))
            setSelectedFlow(updatedFlow)

            // Update flow visualization
            setNodes((nds) => nds.map(node =>
                node.id === stepId ? { ...node, data: { label: content } } : node
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
                ...step,
                position: { x: 250, y: index * 100 },
            })))
            setEdges(template.slice(0, -1).map((step, index) => ({
                id: `e${index}-${index+1}`,
                source: step.id,
                target: template[index+1].id,
                type: 'smoothstep',
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
                                                <SelectItem value="Business Process">Business Process</SelectItem>
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
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Edit Flow: {selectedFlow.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Steps</h3>
                                <div className="space-x-2">
                                    <Button size="sm" onClick={() => handleAddStep('message')}>Add Message</Button>
                                    <Button size="sm" onClick={() => handleAddStep('input')}>Add Input</Button>
                                    <Button size="sm" onClick={() => handleAddStep('condition')}>Add Condition</Button>
                                </div>
                            </div>
                            <ScrollArea className="h-[400px] border rounded-md p-4">
                                {selectedFlow.steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center space-x-2 mb-2">
                                        <Badge>{index + 1}</Badge>
                                        <Badge variant="outline">{step.type}</Badge>
                                        <Input
                                            value={step.data.label}
                                            onChange={(e) => handleUpdateStep(step.id, e.target.value)}
                                        />
                                        {index < selectedFlow.steps.length - 1 && (
                                            <ArrowRight className="h-4 w-4" />
                                        )}
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="h-[400px] border rounded-md">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                fitView
                            >
                                <Controls />
                                <MiniMap />
                                <Background variant="dots" gap={12} size={1} />
                            </ReactFlow>
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