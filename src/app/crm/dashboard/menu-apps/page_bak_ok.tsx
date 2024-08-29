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
    Handle,
    Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodeTypes = {
    message: ({ data }) => (
        <div className="bg-white border-2 border-gray-200 rounded p-3 shadow-md">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div>{data.content}</div>
            <div className="text-sm text-gray-500 mt-2">
                Variables: {data.variables.join(', ')}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    ),
    input: ({ data }) => (
        <div className="bg-white border-2 border-blue-200 rounded p-3 shadow-md">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div>{data.content}</div>
            <div className="text-sm text-gray-500 mt-2">
                Variable: {data.variable}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    ),
    api: ({ data }) => (
        <div className="bg-white border-2 border-green-200 rounded p-3 shadow-md">
            <Handle type="target" position={Position.Top} />
            <div className="font-bold">{data.label}</div>
            <div>{data.apiEndpoint}</div>
            <div>{data.apiMethod}</div>
            <div className="text-sm text-gray-500 mt-2">
                Input Variables: {data.inputVariables.join(', ')}
            </div>
            <div className="text-sm text-gray-500">
                Output Variable: {data.outputVariable}
            </div>
            <Handle type="source" position={Position.Bottom} />
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

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

    const addNode = (type) => {
        const newNode = {
            id: `node_${nodes.length + 1}`,
            type: type,
            data: {
                label: `${type} ${nodes.length + 1}`,
                content: type === 'message' ? 'Hello {{1}}! Your order {{2}} is {{3}}.' : 'Enter your response:',
                apiEndpoint: type === 'api' ? 'https://api.example.com' : '',
                apiMethod: type === 'api' ? 'GET' : '',
                variables: type === 'message' ? ['name', 'orderId', 'status'] : [],
                variable: type === 'input' ? 'userInput' : '',
                inputVariables: type === 'api' ? [] : [],
                outputVariable: type === 'api' ? 'apiResponse' : '',
                payload: type === 'api' ? '{\n  "key": "{{value}}"\n}' : '',
            },
            position: { x: Math.random() * 300, y: Math.random() * 300 },
        }
        setNodes((nds) => nds.concat(newNode))
        if (type === 'input' || type === 'api') {
            setVariables((vars) => [...vars, newNode.data.variable || newNode.data.outputVariable])
        }
    }

    const updateNode = (updatedNode) => {
        setNodes((nds) => nds.map((node) => (node.id === updatedNode.id ? updatedNode : node)))
        setIsDialogOpen(false)
        setSelectedNode(null)

        // Update variables
        if (updatedNode.type === 'input' || updatedNode.type === 'api') {
            setVariables((vars) => [
                ...vars.filter((v) => v !== selectedNode.data.variable && v !== selectedNode.data.outputVariable),
                updatedNode.data.variable || updatedNode.data.outputVariable
            ])
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
                <DialogContent className="max-w-3xl">
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
                                apiEndpoint: formData.get('apiEndpoint'),
                                apiMethod: formData.get('apiMethod'),
                                variables: formData.getAll('variables'),
                                variable: formData.get('variable'),
                                inputVariables: formData.getAll('inputVariables'),
                                outputVariable: formData.get('outputVariable'),
                                payload: formData.get('payload'),
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
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Message Template</Label>
                                        <Textarea id="content" name="content" defaultValue={selectedNode?.data.content} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="variables">Variables</Label>
                                        {selectedNode?.data.variables.map((variable, index) => (
                                            <Input
                                                key={index}
                                                name="variables"
                                                defaultValue={variable}
                                                className="mt-2"
                                            />
                                        ))}
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setSelectedNode({
                                                    ...selectedNode,
                                                    data: {
                                                        ...selectedNode.data,
                                                        variables: [...selectedNode.data.variables, '']
                                                    }
                                                })
                                            }}
                                        >
                                            Add Variable
                                        </Button>
                                    </div>
                                </>
                            )}
                            {selectedNode?.type === 'input' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Input Prompt</Label>
                                        <Input id="content" name="content" defaultValue={selectedNode?.data.content} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="variable">Variable Name</Label>
                                        <Input id="variable" name="variable" defaultValue={selectedNode?.data.variable} required />
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
                                        <Label htmlFor="payload">Payload</Label>
                                        <Textarea id="payload" name="payload" defaultValue={selectedNode?.data.payload} rows={5} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="inputVariables">Input Variables</Label>
                                        <Select name="inputVariables" multiple>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select input variables" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {variables.map((variable) => (
                                                    <SelectItem key={variable} value={variable}>{variable}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="outputVariable">Output Variable</Label>
                                        <Input id="outputVariable" name="outputVariable" defaultValue={selectedNode?.data.outputVariable} required />
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
        </div>
    )
}