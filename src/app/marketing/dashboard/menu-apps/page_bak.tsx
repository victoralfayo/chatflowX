'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon, ArrowRightIcon, DatabaseIcon, SettingsIcon, Variable } from 'lucide-react'
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
    Edge
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodeTypes = {
    message: ({ data }) => (
        <div className="bg-white border-2 border-gray-200 rounded p-3 shadow-md max-w-xs">
            <div className="font-bold">{data.label}</div>
            <div className="text-sm mt-2">
                {data.templateContent.split(/(\{\{[^}]+\}\})/).map((part, index) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                        return <span key={index} className="bg-blue-100 px-1 rounded">{part}</span>
                    }
                    return part
                })}
            </div>
        </div>
    ),
    input: ({ data }) => (
        <div className="bg-white border-2 border-blue-200 rounded p-3 shadow-md max-w-xs">
            <div className="font-bold">{data.label}</div>
            <div className="text-sm mt-2">{data.content}</div>
            <div className="text-xs text-gray-500 mt-1">Variable: {data.variableName}</div>
        </div>
    ),
    api: ({ data }) => (
        <div className="bg-white border-2 border-green-200 rounded p-3 shadow-md max-w-xs">
            <div className="font-bold">{data.label}</div>
            <div className="text-xs">{data.apiEndpoint}</div>
            <div className="text-xs">{data.apiMethod}</div>
            <div className="text-xs mt-1">Payload: {JSON.stringify(data.payload)}</div>
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
            },
            position: { x: Math.random() * 300, y: Math.random() * 300 },
        }
        setNodes((nds) => nds.concat(newNode))
    }

    const updateNode = (updatedNode) => {
        setNodes((nds) => nds.map((node) => (node.id === updatedNode.id ? updatedNode : node)))
        setIsDialogOpen(false)
        setSelectedNode(null)

        // Update variables if it's an input node
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
        setSelectedNode(node)
        setIsDialogOpen(true)
    }

    const addConnection = (newConnection) => {
        setConnections((conns) => [...conns, newConnection])
    }

    return (
        <div className="flex flex-col h-screen">
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
                                    <p className="text-sm text-gray-500">Use {{number}} for variables, e.g., Hello {{1}}!</p>
                                </div>
                            )}
                            {selectedNode?.type === 'input' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Input Prompt</Label>
                                        <Input id="content" name="content" defaultValue={selectedNode?.data.content} required />
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
                                        <p className="text-sm text-gray-500">Use {'{{'}}variableName{{'}}'}} to reference variables</p>
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