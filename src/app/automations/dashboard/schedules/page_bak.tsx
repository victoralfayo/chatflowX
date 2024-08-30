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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { PlusIcon, Search, Clock, Users, Send, BarChart } from 'lucide-react'
import { format } from 'date-fns'

// Mock data for campaigns
const initialCampaigns = [
    {
        id: 1,
        name: 'Summer Sale Announcement',
        status: 'Scheduled',
        audience: 'VIP Customers',
        scheduledFor: '2023-07-01 10:00',
        sentTo: 0,
        opened: 0,
        clicked: 0
    },
    {
        id: 2,
        name: 'Product Launch',
        status: 'Sent',
        audience: 'All Customers',
        scheduledFor: '2023-06-15 09:00',
        sentTo: 1000,
        opened: 800,
        clicked: 500
    },
]

// Mock data for audience segments
const audienceSegments = [
    { id: 1, name: 'All Customers', count: 5000 },
    { id: 2, name: 'VIP Customers', count: 500 },
    { id: 3, name: 'New Customers (Last 30 days)', count: 200 },
    { id: 4, name: 'Inactive Customers', count: 1000 },
]

export default function BroadcastingDashboard() {
    const [campaigns, setCampaigns] = useState(initialCampaigns)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        message: '',
        audience: '',
        scheduledDate: new Date(),
        scheduledTime: '09:00'
    })

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateCampaign = () => {
        const scheduledFor = `${format(newCampaign.scheduledDate, 'yyyy-MM-dd')} ${newCampaign.scheduledTime}`
        setCampaigns([...campaigns, {
            ...newCampaign,
            id: campaigns.length + 1,
            status: 'Scheduled',
            scheduledFor,
            sentTo: 0,
            opened: 0,
            clicked: 0
        }])
        setNewCampaign({ name: '', message: '', audience: '', scheduledDate: new Date(), scheduledTime: '09:00' })
        setIsCreateCampaignOpen(false)
    }

    return (
        <div className="p-8">
            <Tabs defaultValue="campaigns">
                <TabsList>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Broadcast Campaigns</CardTitle>
                            <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Campaign
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Create New Broadcast Campaign</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="name" className="text-right">Name:</label>
                                            <Input
                                                id="name"
                                                placeholder="Campaign Name"
                                                className="col-span-3"
                                                value={newCampaign.name}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="message" className="text-right">Message:</label>
                                            <Textarea
                                                id="message"
                                                placeholder="Enter your broadcast message"
                                                className="col-span-3"
                                                value={newCampaign.message}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="audience" className="text-right">Audience:</label>
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
                                            <label className="text-right">Schedule:</label>
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
                                    </div>
                                    <Button onClick={handleCreateCampaign}>Create Campaign</Button>
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
                                                    <Badge variant={campaign.status === 'Sent' ? 'default' : 'secondary'}>
                                                        {campaign.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{campaign.audience}</TableCell>
                                                <TableCell>{campaign.scheduledFor}</TableCell>
                                                <TableCell>{campaign.sentTo}</TableCell>
                                                <TableCell>{campaign.opened}</TableCell>
                                                <TableCell>{campaign.clicked}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">
                                                        <BarChart className="h-4 w-4 mr-2" />
                                                        View Report
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
                            <CardTitle>Broadcasting Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}