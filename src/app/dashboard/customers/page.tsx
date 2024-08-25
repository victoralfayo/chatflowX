"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, Search, Filter, MoreVertical, Trash2, Edit2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for customers
const initialCustomers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234 567 8901', group: 'VIP', tags: ['Product Inquiry', 'High Value'] },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 234 567 8902', group: 'Regular', tags: ['Support'] },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1 234 567 8903', group: 'VIP', tags: ['Feedback'] },
    // Add more mock customers as needed
]

export default function CustomersDashboard() {
    const [customers, setCustomers] = useState(initialCustomers)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterGroup, setFilterGroup] = useState('All')
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false)
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', group: 'Regular' })
    const [newGroup, setNewGroup] = useState('')
    const [groups, setGroups] = useState(['All', 'Regular', 'VIP'])
    const [currentPage, setCurrentPage] = useState(1)
    const [customersPerPage] = useState(5)

    const filteredCustomers = customers.filter(customer =>
        (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGroup === 'All' || customer.group === filterGroup)
    )

    // Pagination logic
    const indexOfLastCustomer = currentPage * customersPerPage
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)

    const handleAddCustomer = () => {
        setCustomers([...customers, { ...newCustomer, id: customers.length + 1, tags: [] }])
        setNewCustomer({ name: '', email: '', phone: '', group: 'Regular' })
        setIsAddCustomerOpen(false)
    }

    const handleAddGroup = () => {
        if (newGroup && !groups.includes(newGroup)) {
            setGroups([...groups, newGroup])
            setNewGroup('')
            setIsAddGroupOpen(false)
        }
    }

    const handleDeleteCustomer = (id: number) => {
        setCustomers(customers.filter(customer => customer.id !== id))
    }

    const handleEditCustomer = (id: number, updatedCustomer: any) => {
        setCustomers(customers.map(customer => customer.id === id ? { ...customer, ...updatedCustomer } : customer))
    }

    const handleBulkDelete = () => {
        setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)))
        setSelectedCustomers([])
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Customers</CardTitle>
                    <div className="flex space-x-2">
                        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Customer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Customer</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Input
                                        placeholder="Name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Phone"
                                        value={newCustomer.phone}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    />
                                    <Select
                                        value={newCustomer.group}
                                        onValueChange={(value) => setNewCustomer({ ...newCustomer, group: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.filter(group => group !== 'All').map((group) => (
                                                <SelectItem key={group} value={group}>{group}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddCustomer}>Add Customer</Button>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Group
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Group</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Input
                                        placeholder="Group Name"
                                        value={newGroup}
                                        onChange={(e) => setNewGroup(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddGroup}>Add Group</Button>
                            </DialogContent>
                        </Dialog>
                        {selectedCustomers.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <Select value={filterGroup} onValueChange={setFilterGroup}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group} value={group}>{group}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={selectedCustomers.length === currentCustomers.length}
                                        onCheckedChange={(checked) => {
                                            setSelectedCustomers(checked ? currentCustomers.map(c => c.id) : [])
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCustomers.includes(customer.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedCustomers(
                                                    checked
                                                        ? [...selectedCustomers, customer.id]
                                                        : selectedCustomers.filter((id) => id !== customer.id)
                                                )
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{customer.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{customer.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={customer.group === 'VIP' ? 'default' : 'secondary'}>
                                            {customer.group}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {customer.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline">{tag}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditCustomer(customer.id, { group: customer.group === 'VIP' ? 'Regular' : 'VIP' })}>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    {customer.group === 'VIP' ? 'Remove VIP' : 'Make VIP'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {/* Implement edit functionality */}}>
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} entries
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}