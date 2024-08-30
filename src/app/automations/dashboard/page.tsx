'use client'

import { useState } from 'react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
    ArrowDown,
    ArrowUp,
    Users,
    MessageSquare,
    BarChart3,
    DollarSign,
    MessageCircle,
    Ticket,
    Radio
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsContent } from "@/components/ui/tabs"

const data = [
    {
        name: 'Jan',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Feb',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Mar',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Apr',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'May',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Jun',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Jul',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Aug',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Sep',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Oct',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Nov',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Dec',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
]

const agentPerformanceData = [
    { name: 'Agent A', performance: 85 },
    { name: 'Agent B', performance: 72 },
    { name: 'Agent C', performance: 90 },
    { name: 'Agent D', performance: 68 },
    { name: 'Agent E', performance: 95 },
]

export default function DashboardPage() {
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

    return (
        <main  className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18,549</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">423</div>
                        <p className="text-xs text-muted-foreground">+180 since last hour</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">129</div>
                        <p className="text-xs text-muted-foreground">+19% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Broadcasts</CardTitle>
                        <Radio className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">9</div>
                        <p className="text-xs text-muted-foreground">3 require immediate review</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Customer Satisfaction
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95.5%</div>
                        <p className="text-xs text-muted-foreground">
                            +5.5% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview/>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Agent Performance</CardTitle>
                        <CardDescription>
                            Top performing agents this month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AgentPerformance/>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Conversations</CardTitle>
                            <Select
                                value={selectedTimeRange}
                                onValueChange={setSelectedTimeRange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a timeframe"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">Last 24 hours</SelectItem>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RecentConversations timeRange={selectedTimeRange}/>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Customer Feedback</CardTitle>
                        <CardDescription>
                            Recent customer satisfaction ratings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CustomerFeedback/>
                    </CardContent>
                </Card>
            </div>

        </main>
    )
}

function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip/>
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

function AgentPerformance() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agentPerformanceData} layout="vertical">
                <XAxis type="number" domain={[0, 100]}/>
                <YAxis dataKey="name" type="category" width={100}/>
                <Tooltip/>
                <Bar dataKey="performance" fill="#adfa1d" radius={[0, 4, 4, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

function RecentConversations({timeRange}) {
    // This is a placeholder. In a real application, you would fetch this data based on the selected time range.
    const conversationData = [
        {id: 1, customer: 'Alice', agent: 'John', duration: '5m 23s', satisfaction: 4.5},
        {id: 2, customer: 'Bob', agent: 'Sarah', duration: '3m 12s', satisfaction: 5},
        {id: 3, customer: 'Charlie', agent: 'Mike', duration: '8m 56s', satisfaction: 3.5},
        {id: 4, customer: 'Diana', agent: 'Emily', duration: '2m 34s', satisfaction: 4},
        {id: 5, customer: 'Ethan', agent: 'Lisa', duration: '6m 45s', satisfaction: 4.5},
    ]

    return (
        <div className="space-y-8">
            {conversationData.map((conversation) => (
                <div key={conversation.id} className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {conversation.customer} with {conversation.agent}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Duration: {conversation.duration}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        Rating: {conversation.satisfaction}
                    </div>
                </div>
            ))}
        </div>
    )
}

function CustomerFeedback() {
    const feedbackData = [
        { date: '2023-01', satisfaction: 4.2 },
        { date: '2023-02', satisfaction: 4.3 },
        { date: '2023-03', satisfaction: 4.1 },
        { date: '2023-04', satisfaction: 4.4 },
        { date: '2023-05', satisfaction: 4.6 },
        { date: '2023-06', satisfaction: 4.5 },
    ]

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={feedbackData}>
                <XAxis dataKey="date" />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="satisfaction" stroke="#adfa1d" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    )
}