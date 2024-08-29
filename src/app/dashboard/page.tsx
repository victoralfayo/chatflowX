'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, AlertCircle, ArrowRight, LogOut, User, Settings, ChevronDown, BarChart2, Users, Zap, Bot, Building, CreditCard, Bell } from 'lucide-react'
import { getUserProfile, getAvailableProducts, getStats, getNotifications, logout } from '@/app/api/auth'

interface UserProfile {
    id: string
    name: string
    email: string
    avatarUrl?: string
    onboardingComplete: boolean
    organization?: {
        id: string
        name: string
        plan: string
    }
}

interface Product {
    id: string
    name: string
    description: string
    available: boolean
    link: string
}

interface Stat {
    name: string
    value: string
    change: string
    trend: 'up' | 'down'
}

interface Notification {
    id: string
    message: string
    type: 'info' | 'warning' | 'success'
    module: 'crm' | 'marketing' | 'automation' | 'analytics'
}

// Dummy data for testing
const dummyUserProfile: UserProfile = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://github.com/shadcn.png',
    onboardingComplete: true,
    organization: {
        id: 'org1',
        name: 'Acme Corp',
        plan: 'Pro'
    }
}

const dummyProducts: Product[] = [
    {
        id: 'crm',
        name: 'CRM',
        description: 'Manage customer relationships effectively',
        available: true,
        link: '/products/crm'
    },
    {
        id: 'marketing',
        name: 'Marketing',
        description: 'Create and manage marketing campaigns',
        available: true,
        link: '/products/marketing'
    },
    {
        id: 'automation',
        name: 'Automation',
        description: 'Streamline your workflows with intelligent automation',
        available: true,
        link: '/products/automation'
    },
    {
        id: 'analytics',
        name: 'Analytics',
        description: 'Gain insights from your data',
        available: true,
        link: '/products/analytics'
    },
]

const dummyStats: Stat[] = [
    { name: 'Total Customers', value: '1,234', change: '12%', trend: 'up' },
    { name: 'Revenue', value: '$12,345', change: '8%', trend: 'up' },
    { name: 'Active Campaigns', value: '5', change: '20%', trend: 'up' },
    { name: 'Automation Tasks', value: '1,234', change: '5%', trend: 'down' },
]

const dummyNotifications: Notification[] = [
    { id: '1', message: 'New customer signed up', type: 'success', module: 'crm' },
    { id: '2', message: 'Campaign "Summer Sale" is ending soon', type: 'warning', module: 'marketing' },
    { id: '3', message: 'Automation workflow "Lead Nurturing" completed', type: 'info', module: 'automation' },
    { id: '4', message: 'Monthly analytics report is ready', type: 'info', module: 'analytics' },
    { id: '5', message: 'High-value lead identified', type: 'success', module: 'crm' },
    { id: '6', message: 'Email open rates have increased by 15%', type: 'success', module: 'marketing' },
]

export default function Dashboard() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [stats, setStats] = useState<Stat[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, productsData, statsData, notificationsData] = await Promise.all([
                    getUserProfile(),
                    getAvailableProducts(),
                    getStats(),
                    getNotifications()
                ])
                setUserProfile(profileData)
                setProducts(productsData)
                setStats(statsData)
                setNotifications(notificationsData)
            } catch (err) {
                console.error('Error fetching data:', err)
                // Use dummy data if API calls fail
                setUserProfile(dummyUserProfile)
                setProducts(dummyProducts)
                setStats(dummyStats)
                setNotifications(dummyNotifications)
                setError('Failed to load real user data. Using dummy data for testing.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleOnboarding = () => {
        router.push('/onboarding')
    }

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/signin')
        } catch (error) {
            console.error('Logout failed:', error)
            setError('Logout failed. Please try again.')
        }
    }

    const handleProfileSettings = () => {
        router.push('/profile-settings')
    }

    const handleOrgSettings = () => {
        router.push('/org-settings')
    }

    const handleBilling = () => {
        router.push('/billing')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-4">
                <div className="container mx-auto space-y-4">
                    <Skeleton className="h-12 w-3/4 bg-white/20" />
                    <Skeleton className="h-4 w-1/2 bg-white/20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <Skeleton key={index} className="h-40 bg-white/20" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-4">
            <div className="container mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Welcome, {userProfile?.name}!</h1>
                        {userProfile?.organization && (
                            <p className="text-xl text-white/80">Organization: {userProfile.organization.name}</p>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name} />
                                    <AvatarFallback>{userProfile?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userProfile?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleProfileSettings}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOrgSettings}>
                                <Building className="mr-2 h-4 w-4" />
                                <span>Organization Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleBilling}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing & Plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {error && (
                    <Alert variant="destructive" className="bg-red-100 border-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!userProfile?.onboardingComplete && (
                    <Alert className="bg-white/80 border-none">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Onboarding Required</AlertTitle>
                        <AlertDescription>
                            Please complete your profile to access all features.
                            <Button onClick={handleOnboarding} variant="link" className="p-0 h-auto font-normal">
                                Start Onboarding <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-white/90 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                                {stat.trend === 'up' ? (
                                    <ArrowRight className="h-4 w-4 text-green-500 rotate-45" />
                                ) : (
                                    <ArrowRight className="h-4 w-4 text-red-500 -rotate-45" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.trend === 'up' ? '+' : '-'}{stat.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products.map((product) => {
                                    let bgColor, hoverColor;
                                    switch (product.id) {
                                        case 'crm':
                                            bgColor = 'bg-blue-600';
                                            hoverColor = 'hover:bg-blue-700';
                                            break;
                                        case 'marketing':
                                            bgColor = 'bg-yellow-600';
                                            hoverColor = 'hover:bg-yellow-700';
                                            break;
                                        case 'automation':
                                            bgColor = 'bg-cyan-600';
                                            hoverColor = 'hover:bg-cyan-700';
                                            break;
                                        default:
                                            bgColor = 'bg-purple-600';
                                            hoverColor = 'hover:bg-purple-700';
                                    }
                                    return (
                                        <TooltipProvider key={product.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Card className="bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                                                        <CardHeader>
                                                            <CardTitle>{product.name}</CardTitle>
                                                            <CardDescription>{product.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <Link href={product.link} passHref>
                                                                <Button
                                                                    className={`w-full ${bgColor} ${hoverColor} text-white`}
                                                                >
                                                                    Launch <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </CardContent>
                                                    </Card>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Click to launch {product.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                {['crm', 'marketing', 'automation', 'analytics'].map((module) => {
                                    const moduleNotifications = notifications.filter(n => n.module === module);
                                    if (moduleNotifications.length === 0) return null;
                                    return (
                                        <div key={module} className="mb-4">
                                            <h3 className="font-semibold mb-2 capitalize">{module}</h3>
                                            <div className="space-y-4">
                                                {moduleNotifications.map((notification) => (
                                                    <Alert key={notification.id} variant={notification.type === 'warning' ? 'destructive' : 'default'}>
                                                        <Bell className="h-4 w-4" />
                                                        <AlertTitle>{notification.type === 'success' ? 'Success' : notification.type === 'warning' ? 'Warning' : 'Info'}</AlertTitle>
                                                        <AlertDescription>{notification.message}</AlertDescription>
                                                    </Alert>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {userProfile?.organization?.name}</p>
                                <p><strong>Plan:</strong> {userProfile?.organization?.plan}</p>
                                <Button onClick={handleOrgSettings} className="w-full mt-4">
                                    Manage Organization
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Billing Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>Current Plan:</strong> {userProfile?.organization?.plan}</p>
                                <p><strong>Next Billing Date:</strong> July 1, 2023</p>
                                <Button onClick={handleBilling} className="w-full mt-4">
                                    Manage Billing
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}