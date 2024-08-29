'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon, ArrowRightIcon, DatabaseIcon, SettingsIcon, Variable, GitBranchIcon, SendIcon, SearchIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Handle,
    Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodeTypes = {
    message: ({ data }) => (
        <div className="bg-white border-2 border-gray-200 rounded p-3 shadow-md max-w-xs">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div className="text-sm mt-2">
                {data.templateContent.split(/(\{\{[^}]+\}\})/).map((part, index) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                        return <span key={index} className="bg-blue-100 px-1 rounded">{part}</span>
                    }
                    return part
                })}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    ),
    input: ({ data }) => (
        <div className="bg-white border-2 border-blue-200 rounded p-3 shadow-md max-w-xs">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div className="text-sm mt-2">{data.content}</div>
            <div className="text-xs text-gray-500 mt-1">Variable: {data.variableName}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    ),
    api: ({ data }) => (
        <div className="bg-white border-2 border-green-200 rounded p-3 shadow-md max-w-xs">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div className="text-xs">{data.apiEndpoint}</div>
            <div className="text-xs">{data.apiMethod}</div>
            <div className="text-xs mt-1">Payload: {JSON.stringify(data.payload)}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    ),
    conditional: ({ data }) => (
        <div className="bg-white border-2 border-yellow-200 rounded p-3 shadow-md max-w-xs">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div className="text-xs mt-1">Condition: {data.condition}</div>
            <div className="text-xs">True: {data.trueLabel}</div>
            <div className="text-xs">False: {data.falseLabel}</div>
            <Handle type="source" position={Position.Bottom} id="true" />
            <Handle type="source" position={Position.Right} id="false" />
        </div>
    ),
}

export default function MenuAppDesigner() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [selectedNode, setSelectedNode] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [connections, setConnections] = useState([])
    const [variables, setVariables] = useState([])
    const [simulationMessages, setSimulationMessages] = useState([])
    const [userInput, setUserInput] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectingNodeId, setConnectingNodeId] = useState(null)

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

    const addNode = (type) => {
        const newNode = {
            id: `node_${nodes.length + 1}`,
            type: type,
            data: {
                label: `${type} ${nodes.length + 1}`,
                content: type === 'input' ? 'Enter your response:' : 'Message content',
                templateContent: type === 'message' ? 'Hello {{1}}! Welcome to {{2}}.' : '',
                apiEndpoint: type === 'api' ? 'https://api.example.com' : '',
                apiMethod: type === 'api' ? 'GET' : '',
                payload: type === 'api' ? {} : undefined,
                variableName: type === 'input' ? `input_${nodes.length + 1}` : '',
                condition: type === 'conditional' ? '{{variableName}} === "value"' : '',
                trueLabel: type === 'conditional' ? 'True path' : '',
                falseLabel: type === 'conditional' ? 'False path' : '',
            },
            position: { x: Math.random() * 300, y: Math.random() * 300 },
        }
        setNodes((nds) => nds.concat(newNode))
    }

    const updateNode = (updatedNode) => {
        setNodes((nds) => nds.map((node) => (node.id === updatedNode.id ? updatedNode : node)))
        setIsDialogOpen(false)
        setSelectedNode(null)

        if (updatedNode.type === 'input') {
            setVariables((vars) => {
                const existingVarIndex = vars.findIndex(v => v.name === updatedNode.data.variableName)
                if (existingVarIndex !== -1) {
                    return vars.map((v, i) => i === existingVarIndex ? { name: updatedNode.data.variableName, value: '' } : v)
                } else {
                    return [...vars, { name: updatedNode.data.variableName, value: '' }]
                }
            })
        }
    }

    const deleteNode = (id) => {
        setNodes((nds) => nds.filter((node) => node.id !== id))
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))
    }

    const onNodeClick = (event, node) => {
        if (isConnecting) {
            setEdges((eds) => addEdge({
                id: `e${connectingNodeId}-${node.id}`,
                source: connectingNodeId,
                target: node.id,
            }, eds))
            setIsConnecting(false)
            setConnectingNodeId(null)
        } else {
            setSelectedNode(node)
            setIsDialogOpen(true)
        }
    }

    const addConnection = (newConnection) => {
        setConnections((conns) => [...conns, newConnection])
    }

    const simulateFlow = () => {
        let currentNode = nodes.find(node => !edges.some(edge => edge.target === node.id))
        let messages = []

        while (currentNode) {
            if (currentNode.type === 'message') {
                messages.push({ type: 'bot', content: currentNode.data.templateContent })
            } else if (currentNode.type === 'input') {
                messages.push({ type: 'bot', content: currentNode.data.content })
                break
            }

            const nextEdge = edges.find(edge => edge.source === currentNode.id)
            currentNode = nextEdge ? nodes.find(node => node.id === nextEdge.target) : null
        }

        setSimulationMessages(messages)
    }

    useEffect(() => {
        simulateFlow()
    }, [nodes, edges])

    const handleUserInput = () => {
        if (userInput.trim()) {
            setSimulationMessages(prev => [...prev, { type: 'user', content: userInput }])
            setUserInput('')
            simulateFlow()
        }
    }

    const filteredNodes = nodes.filter(node =>
        node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const startConnecting = (nodeId) => {
        setIsConnecting(true)
        setConnectingNodeId(nodeId)
    }

    return (
        <div className="flex h-screen">
            <div className="flex-grow flex flex-col">
                <div className="flex-none bg-white shadow-sm p-4">
                    <h1 className="text-2xl font-bold">Menu App Designer</h1>
                </div>
                <div className="flex-grow flex">
                    <div className="w-64 bg-gray-100 p-4 space-y-4">
                        <Button onClick={() => addNode('message')} className="w-full">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Message
                        </Button>
                        <Button onClick={() => addNode('input')} className="w-full">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Input
                        </Button>
                        <Button onClick={() => addNode('api')} className="w-full">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add API Call
                        </Button>
                        <Button onClick={() => addNode('conditional')} className="w-full">
                            <GitBranchIcon className="mr-2 h-4 w-4" />
                            Add Conditional
                        </Button>
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Nodes</Label>
                            <Input
                                id="search"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            {filteredNodes.map(node => (
                                <Button
                                    key={node.id}
                                    onClick={() => startConnecting(node.id)}
                                    className="w-full justify-start"
                                >
                                    {node.data.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            nodeTypes={nodeTypes}
                        >
                            <Background />
                            <Controls />
                            <MiniMap />
                        </ReactFlow>
                    </div>
                </div>
            </div>

            {/* WhatsApp-themed Simulation */}
            <div className="w-80 bg-gray-100 border-l border-gray-300 flex flex-col">
                <div className="bg-green-500 text-white p-4">
                    <h2 className="text-lg font-semibold">WhatsApp Simulation</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {simulationMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs p-3 rounded-lg ${message.type === 'user' ? 'bg-green-100' : 'bg-white'}`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white border-t border-gray-300 flex">
                    <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-grow mr-2"
                    />
                    <Button onClick={handleUserInput}>
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Node: {selectedNode?.data.label}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        const updatedNode = {
                            ...selectedNode,
                            data: {
                                ...selectedNode.data,
                                label: formData.get('label'),
                                content: formData.get('content'),
                                templateContent: formData.get('templateContent'),
                                apiEndpoint: formData.get('apiEndpoint'),
                                apiMethod: formData.get('apiMethod'),
                                payload: formData.get('payload') ? JSON.parse(formData.get('payload')) : {},
                                variableName: formData.get('variableName'),
                                condition: formData.get('condition'),
                                trueLabel: formData.get('trueLabel'),
                                falseLabel: formData.get('falseLabel'),
                            },
                        }
                        updateNode(updatedNode)
                    }}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Label</Label>
                                <Input id="label" name="label" defaultValue={selectedNode?.data.label} required />
                            </div>
                            {selectedNode?.type === 'message' && (
                                <div className="space-y-2">
                                    <Label htmlFor="templateContent">Message Template</Label>
                                    <Textarea id="templateContent" name="templateContent" defaultValue={selectedNode?.data.templateContent} required />
                                    <p className="text-sm text-gray-500">Use {'{{number}}'} for variables, e.g., Hello {'{{1}}'}!</p>
                                </div>
                            )}
                            {selectedNode?.type === 'input' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Input Prompt</Label>
                                        <Input id="content" name="content" defaultValue={selectedNode?.data.content} require />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="variableName">Variable Name</Label>
                                        <Input id="variableName" name="variableName" defaultValue={selectedNode?.data.variableName} required />
                                    </div>
                                </>
                            )}
                            {selectedNode?.type === 'api' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="apiEndpoint">API Endpoint</Label>
                                        <Input id="apiEndpoint" name="apiEndpoint" defaultValue={selectedNode?.data.apiEndpoint} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apiMethod">API Method</Label>
                                        <Select name="apiMethod" defaultValue={selectedNode?.data.apiMethod || 'GET'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="payload">Payload (JSON)</Label>
                                        <Textarea id="payload" name="payload" defaultValue={JSON.stringify(selectedNode?.data.payload, null, 2)} />
                                        <p className="text-sm text-gray-500">Use {'{{variableName}}'} to reference variables</p>
                                    </div>
                                </>
                            )}
                            {selectedNode?.type === 'conditional' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="condition">Condition</Label>
                                        <Input id="condition" name="condition" defaultValue={selectedNode?.data.condition} required />
                                        <p className="text-sm text-gray-500">Use {'{{variableName}}'} to reference variables</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="trueLabel">True Path Label</Label>
                                        <Input id="trueLabel" name="trueLabel" defaultValue={selectedNode?.data.trueLabel} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="falseLabel">False Path Label</Label>
                                        <Input id="falseLabel" name="falseLabel" defaultValue={selectedNode?.data.falseLabel} required />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit">Update Node</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-4 right-4">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Manage Connections
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage External Connections</DialogTitle>
                        <DialogDescription>
                            Configure connections to external systems for API calls.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {connections.map((connection, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{connection.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>URL: {connection.url}</p>
                                    <p>Auth Type: {connection.authType}</p>
                                </CardContent>
                            </Card>
                        ))}
                        <Button onClick={() => {
                            const newConnection = {
                                name: `Connection ${connections.length + 1}`,
                                url: 'https://api.example.com',
                                authType: 'Bearer Token',
                            }
                            addConnection(newConnection)
                        }}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add New Connection
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-4 left-4">
                        <Variable className="mr-2 h-4 w-4" />
                        Manage Variables
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Variables</DialogTitle>
                        <DialogDescription>
                            View and manage variables used in the flow.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {variables.map((variable, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input value={variable.name} readOnly />
                                <Input value={variable.value} placeholder="Variable value" onChange={(e) => {
                                    setVariables(vars => vars.map((v, i) => i === index ? { ...v, value: e.target.value } : v))
                                }} />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}