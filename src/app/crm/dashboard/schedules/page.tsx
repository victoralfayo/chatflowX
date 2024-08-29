"use client"

import { useState, useEffect } from 'react'
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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { PlusIcon, Search, Clock, Users, Send, BarChart, Target, PhoneCall, Zap, CheckCircle, XCircle, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {Label} from "@/components/ui/label";
import {ButtonSubmit} from "@/components/customButtons";

// Mock data for campaigns
const initialCampaigns = [
    {
        id: 1,
        name: 'Summer Sale Announcement',
        status: 'Pending Approval',
        audience: 'VIP Customers',
        scheduledFor: '2023-07-01 10:00',
        templateId: 1,
        testingGroup: 'Beta Testers',
        sentTo: 0,
        opened: 0,
        clicked: 0,
        tested: false
    },
    {
        id: 2,
        name: 'Product Launch',
        status: 'Approved',
        audience: 'All Customers',
        scheduledFor: '2023-06-15 09:00',
        templateId: 2,
        testingGroup: 'VIP Customers',
        sentTo: 1000,
        opened: 800,
        clicked: 500,
        tested: true
    },
]

// Mock data for audience segments
const audienceSegments = [
    { id: 1, name: 'All Customers', count: 5000 },
    { id: 2, name: 'VIP Customers', count: 500 },
    { id: 3, name: 'New Customers (Last 30 days)', count: 200 },
    { id: 4, name: 'Inactive Customers', count: 1000 },
]

// Mock data for analytics
const analyticsData = [
    { date: '2023-06-01', sent: 1000, opened: 800, clicked: 500 },
    { date: '2023-06-02', sent: 1200, opened: 950, clicked: 600 },
    { date: '2023-06-03', sent: 800, opened: 700, clicked: 400 },
    { date: '2023-06-04', sent: 1500, opened: 1200, clicked: 800 },
    { date: '2023-06-05', sent: 2000, opened: 1600, clicked: 1000 },
]

// Mock data for message templates
const messageTemplates = [
    { id: 1, name: 'Summer Sale Template', content: 'Don\'t miss our summer sale! Up to 50% off on selected items.' },
    { id: 2, name: 'Product Launch Template', content: 'Exciting news! Our new product is now available. Be among the first to try it!' },
    { id: 3, name: 'Customer Feedback Template', content: 'We value your opinion. Please take a moment to share your feedback.' },
]

// Mock data for testing groups
const testingGroups = [
    { id: 1, name: 'Beta Testers', count: 50 },
    { id: 2, name: 'VIP Customers', count: 100 },
    { id: 3, name: 'Internal Team', count: 20 },
]

export default function BroadcastingDashboard() {
    const [campaigns, setCampaigns] = useState(initialCampaigns)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
    const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        templateId: '',
        audience: '',
        scheduledDate: new Date(),
        scheduledTime: '09:00',
        isAutomated: false,
        automationTrigger: '',
        testingGroup: '',
        testNumber: '',
        tested: false
    })
    const [isAdmin, setIsAdmin] = useState(true) // This would typically come from an auth context

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateCampaign = () => {
        if (!newCampaign.tested) {
            alert('Please test the campaign before submitting for approval.')
            return
        }
        const scheduledFor = `${format(newCampaign.scheduledDate, 'yyyy-MM-dd')} ${newCampaign.scheduledTime}`
        setCampaigns([...campaigns, {
            ...newCampaign,
            id: campaigns.length + 1,
            status: 'Pending Approval',
            scheduledFor,
            sentTo: 0,
            opened: 0,
            clicked: 0
        }])
        setNewCampaign({
            name: '',
            templateId: '',
            audience: '',
            scheduledDate: new Date(),
            scheduledTime: '09:00',
            isAutomated: false,
            automationTrigger: '',
            testingGroup: '',
            testNumber: '',
            tested: false
        })
        setIsCreateCampaignOpen(false)
    }

    const handleTestCampaign = () => {
        const selectedTemplate = messageTemplates.find(template => template.id.toString() === newCampaign.templateId)
        if (selectedTemplate) {
            let testMessage = `Test message for campaign: ${newCampaign.name}\n\nTemplate: ${selectedTemplate.name}\nContent: ${selectedTemplate.content}`
            if (newCampaign.testingGroup) {
                const group = testingGroups.find(g => g.name === newCampaign.testingGroup)
                testMessage += `\n\nSent to Testing Group: ${group.name} (${group.count} recipients)`
            } else if (newCampaign.testNumber) {
                testMessage += `\n\nSent to Test Number: ${newCampaign.testNumber}`
            } else {
                alert('Please select a testing group or enter a test number before testing.')
                return
            }
            alert(testMessage)
            setNewCampaign({ ...newCampaign, tested: true })
        } else {
            alert('Please select a template before testing.')
        }
    }

    const handleApproveCampaign = (id: number) => {
        setCampaigns(campaigns.map(campaign =>
            campaign.id === id ? { ...campaign, status: 'Approved' } : campaign
        ))
    }

    const handleRejectCampaign = (id: number) => {
        setCampaigns(campaigns.map(campaign =>
            campaign.id === id ? { ...campaign, status: 'Rejected' } : campaign
        ))
    }

    const handleEditSchedule = () => {
        if (selectedCampaign) {
            const scheduledFor = `${format(selectedCampaign.scheduledDate, 'yyyy-MM-dd')} ${selectedCampaign.scheduledTime}`
            setCampaigns(campaigns.map(campaign =>
                campaign.id === selectedCampaign.id ? { ...selectedCampaign, scheduledFor } : campaign
            ))
            setIsEditScheduleOpen(false)
        }
    }

    const EditScheduleModal = () => (
        <Dialog open={isEditScheduleOpen} onOpenChange={setIsEditScheduleOpen}>
            <DialogContent className="max-w-3xl w-full h-[90vh]max-w-[80vw]">
                <DialogHeader>
                    <DialogTitle className={"text-jade-950"}>Edit Campaign: {selectedCampaign?.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right text-jade-950">Name:</Label>
                        <Input
                            id="edit-name"
                            value={selectedCampaign?.name}
                            onChange={(e) => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-template" className="text-right text-jade-950">Template:</Label>
                        <Select
                            value={selectedCampaign?.templateId.toString()}
                            onValueChange={(value) => setSelectedCampaign({ ...selectedCampaign, templateId: parseInt(value) })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select message template" />
                            </SelectTrigger>
                            <SelectContent>
                                {messageTemplates.map((template) => (
                                    <SelectItem key={template.id} value={template.id.toString()}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-audience" className="text-right text-jade-950">Audience:</Label>
                        <Select
                            value={selectedCampaign?.audience}
                            onValueChange={(value) => setSelectedCampaign({ ...selectedCampaign, audience: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select target audience" />
                            </SelectTrigger>
                            <SelectContent>
                                {audienceSegments.map((segment) => (
                                    <SelectItem key={segment.id} value={segment.name}>
                                        {segment.name} ({segment.count} recipients)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-jade-950">Schedule:</Label>
                        <div className="col-span-3 flex gap-4">
                            <Calendar
                                mode="single"
                                selected={selectedCampaign?.scheduledDate}
                                onSelect={(date) => setSelectedCampaign({ ...selectedCampaign, scheduledDate: date || new Date() })}
                                className="rounded-md border"
                            />
                            <Select
                                value={selectedCampaign?.scheduledTime}
                                onValueChange={(value) => setSelectedCampaign({ ...selectedCampaign, scheduledTime: value })}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                        <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                            {`${hour.toString().padStart(2, '0')}:00`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-testingGroup" className="text-right text-jade-950">Testing Group:</Label>
                        <Select
                            value={selectedCampaign?.testingGroup}
                            onValueChange={(value) => setSelectedCampaign({ ...selectedCampaign, testingGroup: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select testing group" />
                            </SelectTrigger>
                            <SelectContent>
                                {testingGroups.map((group) => (
                                    <SelectItem key={group.id} value={group.name}>
                                        {group.name} ({group.count} recipients)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ButtonSubmit onClick={handleEditSchedule}>Save Changes</ButtonSubmit>
            </DialogContent>
        </Dialog>
    )

    return (
        <div className="p-8 container" >
            <Tabs defaultValue="campaigns">
                <TabsList>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    {isAdmin && <TabsTrigger value="approval">Approval Queue</TabsTrigger>}
                </TabsList>
                <TabsContent value="campaigns">
                    <Card
                        className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className={"text-jade-950"}>Broadcast Campaigns</CardTitle>
                            <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
                                <DialogTrigger asChild>
                                    <ButtonSubmit>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Campaign
                                    </ButtonSubmit>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Create New Broadcast Campaign</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right text-jade-950">Name:</Label>
                                            <Input
                                                id="name"
                                                placeholder="Campaign Name"
                                                className="col-span-3"
                                                value={newCampaign.name}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="template" className="text-right text-jade-950">Template:</Label>
                                            <Select
                                                value={newCampaign.templateId}
                                                onValueChange={(value) => setNewCampaign({ ...newCampaign, templateId: value })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select message template" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {messageTemplates.map((template) => (
                                                        <SelectItem key={template.id} value={template.id.toString()}>
                                                            {template.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="audience" className="text-right text-jade-950">Audience:</Label>
                                            <Select
                                                value={newCampaign.audience}
                                                onValueChange={(value) => setNewCampaign({ ...newCampaign, audience: value })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select target audience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {audienceSegments.map((segment) => (
                                                        <SelectItem key={segment.id} value={segment.name}>
                                                            {segment.name} ({segment.count} recipients)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right text-jade-950">Schedule:</Label>
                                            <div className="col-span-3 flex gap-4">
                                                <Calendar
                                                    mode="single"
                                                    selected={newCampaign.scheduledDate}
                                                    onSelect={(date) => setNewCampaign({ ...newCampaign, scheduledDate: date || new Date() })}
                                                    className="rounded-md border"
                                                />
                                                <Select
                                                    value={newCampaign.scheduledTime}
                                                    onValueChange={(value) => setNewCampaign({ ...newCampaign, scheduledTime: value })}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select time" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                                            <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                                                {`${hour.toString().padStart(2, '0')}:00`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="automated" className="text-right text-jade-950">Automated:</Label>
                                            <Checkbox
                                                id="automated"
                                                checked={newCampaign.isAutomated}
                                                onCheckedChange={(checked) => setNewCampaign({ ...newCampaign, isAutomated: checked })}
                                            />
                                        </div>
                                        {newCampaign.isAutomated && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="trigger" className="text-right text-jade-950">Trigger:</Label>
                                                <Input
                                                    id="trigger"
                                                    placeholder="e.g., New customer sign-up"
                                                    className="col-span-3"
                                                    value={newCampaign.automationTrigger}
                                                    onChange={(e) => setNewCampaign({ ...newCampaign, automationTrigger: e.target.value })}
                                                />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="testingGroup" className="text-right text-jade-950">Testing Group:</Label>
                                            <Select
                                                value={newCampaign.testingGroup}
                                                onValueChange={(value) => setNewCampaign({ ...newCampaign, testingGroup: value, testNumber: '' })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select testing group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {testingGroups.map((group) => (
                                                        <SelectItem key={group.id} value={group.name}>
                                                            {group.name} ({group.count} recipients)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="testNumber" className="text-right text-jade-950">Test Number:</Label>
                                            <Input
                                                id="testNumber"
                                                placeholder="Enter phone number for testing"
                                                className="col-span-2"
                                                value={newCampaign.testNumber}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, testNumber: e.target.value, testingGroup: '' })}
                                            />
                                            <ButtonSubmit variant={"outline"} onClick={handleTestCampaign}>Test</ButtonSubmit>
                                        </div>
                                    </div>
                                    <ButtonSubmit onClick={handleCreateCampaign} disabled={!newCampaign.tested}>
                                        {newCampaign.tested ? 'Submit for Approval' : 'Test Required'}
                                    </ButtonSubmit>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search campaigns..."
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
                                            <TableHead>Status</TableHead>
                                            <TableHead>Audience</TableHead>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Testing Group</TableHead>
                                            <TableHead>Scheduled For</TableHead>
                                            <TableHead>Sent</TableHead>
                                            <TableHead>Opened</TableHead>
                                            <TableHead>Clicked</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>{campaign.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={campaign.status === 'Approved' ? 'default' : campaign.status === 'Pending Approval' ? 'secondary' : 'destructive'}
                                                           className={`${campaign.status === 'Approved' ? "text-jade-950 bg-jade-500 hover:bg-jade-600 hover:text-jade-950": ""}`}
                                                    >
                                                        {campaign.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{campaign.audience}</TableCell>
                                                <TableCell>{messageTemplates.find(t => t.id === campaign.templateId)?.name}</TableCell>
                                                <TableCell>{campaign.testingGroup}</TableCell>
                                                <TableCell>{campaign.scheduledFor}</TableCell>
                                                <TableCell>{campaign.sentTo}</TableCell>
                                                <TableCell>{campaign.opened}</TableCell>
                                                <TableCell>{campaign.clicked}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            setSelectedCampaign(campaign)
                                                            setIsAnalyticsOpen(true)
                                                        }}>
                                                            <BarChart className="h-4 w-4 mr-2" />
                                                            Analytics
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            setSelectedCampaign(campaign)
                                                            setIsEditScheduleOpen(true)
                                                        }}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
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
                </TabsContent>
                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Broadcasting Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Campaigns</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{campaigns.length}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Recipients</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {campaigns.reduce((sum, campaign) => sum + campaign.sentTo, 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Avg. Open Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {(campaigns.reduce((sum, campaign) => sum + (campaign.opened / campaign.sentTo), 0) / campaigns.length * 100).toFixed(2)}%
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analyticsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="opened" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="clicked" stroke="#ffc658" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {isAdmin && (
                    <TabsContent value="approval">
                        <Card
                            className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}
                        >
                            <CardHeader >
                                <CardTitle className={"text-jade-950"}>Campaigns Pending Approval</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[calc(100vh-16rem)]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Audience</TableHead>
                                                <TableHead>Template</TableHead>
                                                <TableHead>Testing Group</TableHead>
                                                <TableHead>Scheduled For</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {campaigns.filter(campaign => campaign.status === 'Pending Approval').map((campaign) => (
                                                <TableRow key={campaign.id}>
                                                    <TableCell>{campaign.name}</TableCell>
                                                    <TableCell>{campaign.audience}</TableCell>
                                                    <TableCell>{messageTemplates.find(t => t.id === campaign.templateId)?.name}</TableCell>
                                                    <TableCell>{campaign.testingGroup}</TableCell>
                                                    <TableCell>{campaign.scheduledFor}</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2 items-center">
                                                            <ButtonSubmit variant="outline"  onClick={() => handleApproveCampaign(campaign.id)}>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Approve
                                                            </ButtonSubmit>
                                                            <ButtonSubmit variant="outline" onClick={() => handleRejectCampaign(campaign.id)}>
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Reject
                                                            </ButtonSubmit>
                                                            <ButtonSubmit variant="outline" size="sm" onClick={() => {
                                                                setSelectedCampaign(campaign)
                                                                setIsEditScheduleOpen(true)
                                                            }}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </ButtonSubmit>
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
                )}
            </Tabs>

            <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Campaign Analytics: {selectedCampaign?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sent</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{selectedCampaign?.sentTo}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Opened</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{selectedCampaign?.opened}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Clicked</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{selectedCampaign?.clicked}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                                <Line type="monotone" dataKey="opened" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="clicked" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
            </Dialog>

            <EditScheduleModal />
        </div>
    )
}