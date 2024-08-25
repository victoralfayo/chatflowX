"use client"

import { useState } from 'react'
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
import { Switch } from "@/components/ui/switch"
import { PlusIcon, Search, Edit, Trash2, MessageSquare, Phone, Eye } from 'lucide-react'

// Template categories as per WhatsApp guidelines
const templateCategories = [
    'ACCOUNT_UPDATE',
    'PAYMENT_UPDATE',
    'PERSONAL_FINANCE_UPDATE',
    'SHIPPING_UPDATE',
    'RESERVATION_UPDATE',
    'ISSUE_RESOLUTION',
    'APPOINTMENT_UPDATE',
    'TRANSPORTATION_UPDATE',
    'TICKET_UPDATE',
    'ALERT_UPDATE',
]

// Initial templates
const initialTemplates = [
    {
        id: 1,
        name: 'Order Confirmation',
        category: 'SHIPPING_UPDATE',
        language: 'en',
        content: 'Hello {{1}}, your order #{{2}} has been confirmed and will be shipped soon. Thank you for your purchase!',
        header: { type: 'TEXT', text: 'Order Confirmation' },
        footer: 'Reply STOP to unsubscribe',
        buttons: [
            { type: 'QUICK_REPLY', text: 'Track Order' },
            { type: 'QUICK_REPLY', text: 'View Invoice' },
        ],
        status: 'Approved',
    },
    {
        id: 2,
        name: 'Appointment Reminder',
        category: 'APPOINTMENT_UPDATE',
        language: 'en',
        content: 'Hi {{1}}, this is a reminder for your appointment on {{2}} at {{3}}. Please reply YES to confirm or NO to reschedule.',
        header: { type: 'TEXT', text: 'Appointment Reminder' },
        footer: 'Reply STOP to unsubscribe',
        buttons: [
            { type: 'QUICK_REPLY', text: 'Confirm' },
            { type: 'QUICK_REPLY', text: 'Reschedule' },
        ],
        status: 'Pending',
    },
]

export default function MessageTemplatesDashboard() {
    const [templates, setTemplates] = useState(initialTemplates)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
    const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<typeof initialTemplates[0] | null>(null)
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        category: '',
        language: 'en',
        content: '',
        header: { type: 'TEXT', text: '' },
        footer: '',
        buttons: [],
    })

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateTemplate = () => {
        setTemplates([...templates, {
            ...newTemplate,
            id: templates.length + 1,
            status: 'Pending',
        }])
        setNewTemplate({
            name: '',
            category: '',
            language: 'en',
            content: '',
            header: { type: 'TEXT', text: '' },
            footer: '',
            buttons: [],
        })
        setIsCreateTemplateOpen(false)
    }

    const handleEditTemplate = () => {
        if (editingTemplate) {
            setTemplates(templates.map(template =>
                template.id === editingTemplate.id ? editingTemplate : template
            ))
            setIsEditTemplateOpen(false)
            setEditingTemplate(null)
        }
    }

    const handleDeleteTemplate = (id: number) => {
        setTemplates(templates.filter(template => template.id !== id))
    }

    const handleAddButton = (isEditing: boolean) => {
        const targetTemplate = isEditing ? editingTemplate : newTemplate
        if (targetTemplate && targetTemplate.buttons.length < 3) {
            const updatedButtons = [...targetTemplate.buttons, { type: 'QUICK_REPLY', text: '' }]
            if (isEditing && editingTemplate) {
                setEditingTemplate({ ...editingTemplate, buttons: updatedButtons })
            } else {
                setNewTemplate({ ...newTemplate, buttons: updatedButtons })
            }
        }
    }

    const handleUpdateButton = (index: number, text: string, isEditing: boolean) => {
        const targetTemplate = isEditing ? editingTemplate : newTemplate
        if (targetTemplate) {
            const updatedButtons = targetTemplate.buttons.map((button, i) =>
                i === index ? { ...button, text } : button
            )
            if (isEditing && editingTemplate) {
                setEditingTemplate({ ...editingTemplate, buttons: updatedButtons })
            } else {
                setNewTemplate({ ...newTemplate, buttons: updatedButtons })
            }
        }
    }

    const handleRemoveButton = (index: number, isEditing: boolean) => {
        const targetTemplate = isEditing ? editingTemplate : newTemplate
        if (targetTemplate) {
            const updatedButtons = targetTemplate.buttons.filter((_, i) => i !== index)
            if (isEditing && editingTemplate) {
                setEditingTemplate({ ...editingTemplate, buttons: updatedButtons })
            } else {
                setNewTemplate({ ...newTemplate, buttons: updatedButtons })
            }
        }
    }

    const TemplateForm = ({ template, isEditing }: { template: typeof newTemplate, isEditing: boolean }) => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name:</Label>
                <Input
                    id="name"
                    placeholder="Template Name"
                    className="col-span-3"
                    value={template.name}
                    onChange={(e) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, name: e.target.value })
                        : setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category:</Label>
                <Select
                    value={template.category}
                    onValueChange={(value) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, category: value })
                        : setNewTemplate({ ...newTemplate, category: value })}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {templateCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">Language:</Label>
                <Input
                    id="language"
                    placeholder="Language Code (e.g., en)"
                    className="col-span-3"
                    value={template.language}
                    onChange={(e) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, language: e.target.value })
                        : setNewTemplate({ ...newTemplate, language: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="header" className="text-right">Header:</Label>
                <Input
                    id="header"
                    placeholder="Header Text"
                    className="col-span-3"
                    value={template.header.text}
                    onChange={(e) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, text: e.target.value } })
                        : setNewTemplate({ ...newTemplate, header: { ...newTemplate.header, text: e.target.value } })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">Content:</Label>
                <Textarea
                    id="content"
                    placeholder="Enter your message content. Use {{1}}, {{2}}, etc. for variables."
                    className="col-span-3"
                    value={template.content}
                    onChange={(e) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, content: e.target.value })
                        : setNewTemplate({ ...newTemplate, content: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="footer" className="text-right">Footer:</Label>
                <Input
                    id="footer"
                    placeholder="Footer Text"
                    className="col-span-3"
                    value={template.footer}
                    onChange={(e) => isEditing && editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, footer: e.target.value })
                        : setNewTemplate({ ...newTemplate, footer: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Buttons:</Label>
                <div className="col-span-3 space-y-2">
                    {template.buttons.map((button, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                placeholder="Button Text"
                                value={button.text}
                                onChange={(e) => handleUpdateButton(index, e.target.value, isEditing)}
                            />
                            <Button variant="outline" size="icon" onClick={() => handleRemoveButton(index, isEditing)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {template.buttons.length < 3 && (
                        <Button variant="outline" onClick={() => handleAddButton(isEditing)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Button
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className="p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>WhatsApp Message Templates</CardTitle>
                    <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Create New Message Template</DialogTitle>
                            </DialogHeader>
                            <TemplateForm template={newTemplate} isEditing={false} />
                            <Button onClick={handleCreateTemplate}>Create Template</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search templates..."
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
                                    <TableHead>Category</TableHead>
                                    <TableHead>Language</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTemplates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>{template.name}</TableCell>
                                        <TableCell>{template.category}</TableCell>
                                        <TableCell>{template.language}</TableCell>
                                        <TableCell>
                                            <Badge variant={template.status === 'Approved' ? 'default' : 'secondary'}>
                                                {template.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    setEditingTemplate(template)
                                                    setIsEditTemplateOpen(true)
                                                }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
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

            <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Message Template</DialogTitle>
                    </DialogHeader>
                    {editingTemplate && (
                        <>
                            <TemplateForm template={editingTemplate} isEditing={true} />
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>Cancel</Button>
                                <Button onClick={handleEditTemplate}>Save Changes</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}