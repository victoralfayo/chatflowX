'use client'

import React, {useEffect, useState} from 'react'
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {PencilIcon, PlusIcon, TrashIcon} from 'lucide-react'
import {ButtonIconDelete, ButtonIconEdit, ButtonSubmit} from "@/components/customButtons";

// Simulated data for organizations, agents, and admins
const organizationsData = [
    {
        id: 1,
        name: "Acme Corp",
        industry: "tech",
        size: "51-200",
        country: "us",
        timezone: "pst",
        email: "info@acme.com",
        contact: { name: "Tom Smith", phone: "+1 (555) 123-4567", email: "tom@acme.com" }
    },
    {
        id: 2,
        name: "GlobalTech",
        industry: "tech",
        size: "201-500",
        country: "uk",
        timezone: "gmt",
        email: "contact@globaltech.com",
        contact: { name: "Emma Watson", phone: "+44 20 7123 4567", email: "emma@globaltech.com" }
    },
    {
        id: 3,
        name: "EduLearn",
        industry: "education",
        size: "11-50",
        country: "ca",
        timezone: "est",
        email: "hello@edulearn.com",
        contact: { name: "Michael Chen", phone: "+1 (416) 123-4567", email: "michael@edulearn.com" }
    },
]

const agentsData = [
    { id: 1, orgId: 1, name: 'John Doe', email: 'john@acme.com', role: 'Agent', phone: "+1 (555) 987-6543" },
    { id: 2, orgId: 1, name: 'Jane Smith', email: 'jane@acme.com', role: 'Agent', phone: "+1 (555) 876-5432" },
    { id: 3, orgId: 2, name: 'Bob Johnson', email: 'bob@globaltech.com', role: 'Agent', phone: "+44 20 7234 5678" },
    { id: 4, orgId: 2, name: 'Alice Brown', email: 'alice@globaltech.com', role: 'Agent', phone: "+44 20 7345 6789" },
    { id: 5, orgId: 3, name: 'Charlie Davis', email: 'charlie@edulearn.com', role: 'Agent', phone: "+1 (416) 234-5678" },
    { id: 6, orgId: 3, name: 'Diana Evans', email: 'diana@edulearn.com', role: 'Agent', phone: "+1 (416) 345-6789" },
]

const adminsData = [
    { id: 1, orgId: 1, name: 'Sarah Connor', email: 'sarah@acme.com', role: 'Admin', phone: "+1 (555) 111-2222" },
    { id: 2, orgId: 2, name: 'John Matrix', email: 'john@globaltech.com', role: 'Admin', phone: "+44 20 7111 2222" },
    { id: 3, orgId: 3, name: 'Dutch Schaefer', email: 'dutch@edulearn.com', role: 'Admin', phone: "+1 (416) 111-2222" },
]

function TableFooter({children}: {children: React.ReactNode}) {
    return <div className={"text-jade-600 text-sm"}>
        {children}
    </div>;
}

export default function Component() {
    const [selectedOrg, setSelectedOrg] = useState(organizationsData[0])
    const [agents, setAgents] = useState([])
    const [admins, setAdmins] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 5

    useEffect(() => {
        // Filter agents and admins based on selected organization
        const filteredAgents = agentsData.filter(agent => agent.orgId === selectedOrg.id)
        const filteredAdmins = adminsData.filter(admin => admin.orgId === selectedOrg.id)
        setAgents(filteredAgents)
        setAdmins(filteredAdmins)
        setCurrentPage(1) // Reset to first page when changizzng organization
    }, [selectedOrg])

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentAgents = filteredAgents.slice(startIndex, endIndex)

    const handleOrgChange = (orgId) => {
        const newOrg = organizationsData.find(org => org.id.toString() === orgId)
        setSelectedOrg(newOrg)
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card
                className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}>
                <CardHeader>
                    <CardTitle className={"text-jade-950"}>Organization Settings</CardTitle>
                    <CardDescription>Manage your organization&apos;s details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-select">Select Organization</Label>
                            <Select onValueChange={handleOrgChange} defaultValue={selectedOrg.id.toString()}>
                                <SelectTrigger id="org-select">
                                    <SelectValue placeholder="Select organization"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {organizationsData.map(org => (
                                        <SelectItem key={org.id} value={org.id.toString()}>{org.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input id="org-name" value={selectedOrg.name} readOnly/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry Type</Label>
                                <Select defaultValue={selectedOrg.industry}>
                                    <SelectTrigger id="industry">
                                        <SelectValue placeholder="Select industry"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech">Technology</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-size">Company Size</Label>
                                <Select defaultValue={selectedOrg.size}>
                                    <SelectTrigger id="company-size">
                                        <SelectValue placeholder="Select company size"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-10">1-10 employees</SelectItem>
                                        <SelectItem value="11-50">11-50 employees</SelectItem>
                                        <SelectItem value="51-200">51-200 employees</SelectItem>
                                        <SelectItem value="201-500">201-500 employees</SelectItem>
                                        <SelectItem value="501+">501+ employees</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Select defaultValue={selectedOrg.country}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select country"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="ca">Canada</SelectItem>
                                        <SelectItem value="au">Australia</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Time Zone</Label>
                                <Select defaultValue={selectedOrg.timezone}>
                                    <SelectTrigger id="timezone">
                                        <SelectValue placeholder="Select time zone"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                        <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={selectedOrg.email} readOnly/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Organization Contact</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input value={selectedOrg.contact.name} readOnly placeholder="Contact Name"/>
                                <Input value={selectedOrg.contact.phone} readOnly placeholder="Contact Phone"/>
                                <Input value={selectedOrg.contact.email} readOnly placeholder="Contact Email"/>
                            </div>
                        </div>
                        <ButtonSubmit>Save Changes</ButtonSubmit>
                    </form>
                </CardContent>
            </Card>

            <Card
                className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}>
                <CardHeader>
                    <CardTitle className={"text-jade-950"}>Organization Admins for {selectedOrg.name}</CardTitle>
                    <CardDescription>View and manage organization administrators</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.phone}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <ButtonIconEdit>
                                                    <PencilIcon className="h-4 w-4"/>
                                                </ButtonIconEdit>
                                                <ButtonIconDelete>
                                                    <TrashIcon className="h-4 w-4"/>
                                                </ButtonIconDelete>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ButtonSubmit>
                            New Admin
                        </ButtonSubmit>
                    </div>
                </CardContent>
            </Card>

            <Card
                className={"active:border-jade-600 focus-within:border-jade-600 hover:border-jade-600 transition-all duration-200"}>
                <CardHeader>
                    <CardTitle className={"text-jade-950"}>Agent Management for {selectedOrg.name}</CardTitle>
                    <CardDescription>Create, view, and manage your organization&apos;s agents</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Input
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <ButtonSubmit>
                                <PlusIcon className="mr-2 h-4 w-4"/>
                                Add Agent
                            </ButtonSubmit>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentAgents.map((agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell className="font-medium">{agent.name}</TableCell>
                                        <TableCell>{agent.email}</TableCell>
                                        <TableCell>{agent.phone}</TableCell>
                                        <TableCell>{agent.role}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <ButtonIconEdit>
                                                    <PencilIcon className="h-4 w-4"/>
                                                </ButtonIconEdit>
                                                <ButtonIconDelete>
                                                    <TrashIcon className="h-4 w-4"/>
                                                </ButtonIconDelete>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between items-center">
                            <TableFooter >
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredAgents.length)} of {filteredAgents.length} agents
                            </TableFooter>
                            <div className="space-x-2">
                                <ButtonSubmit
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </ButtonSubmit>
                                <ButtonSubmit
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </ButtonSubmit>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}