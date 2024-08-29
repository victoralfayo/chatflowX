'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, AlertCircle, ArrowRight, LogOut } from 'lucide-react'
import { getUserProfile, getAvailableProducts, logout } from '@/app/api/auth'

interface UserProfile {
    id: string
    name: string
    email: string
    onboardingComplete: boolean
    organization?: {
        id: string
        name: string
    }
}

interface Product {
    id: string
    name: string
    description: string
    available: boolean
}

// Dummy data for testing
const dummyUserProfile: UserProfile = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    onboardingComplete: true,
    organization: {
        id: 'org1',
        name: 'Acme Corp'
    }
}

const dummyProducts: Product[] = [
    {
        id: '1',
        name: 'Basic Chat',
        description: 'Simple chat functionality for your application',
        available: true,
    },
    {
        id: '2',
        name: 'Advanced Analytics',
        description: 'Detailed insights and analytics for your chat data',
        available: true,
    },
    {
        id: '3',
        name: 'AI Chatbot',
        description: 'Intelligent chatbot powered by advanced AI',
        available: false,
    },
    {
        id: '4',
        name: 'Multi-language Support',
        description: 'Add multiple language capabilities to your chat',
        available: true,
    },
]

export default function Dashboard() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, productsData] = await Promise.all([
                    getUserProfile(),
                    getAvailableProducts()
                ])
                setUserProfile(profileData)
                setProducts(productsData)
            } catch (err) {
                console.error('Error fetching data:', err)
                // Use dummy data if API calls fail
                setUserProfile(dummyUserProfile)
                setProducts(dummyProducts)
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

    const handleProductSelect = (productId: string) => {
        router.push(`/products/${productId}`)
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
                <div className="container mx-auto space-y-4">
                    <Skeleton className="h-12 w-3/4 bg-white/20" />
                    <Skeleton className="h-4 w-1/2 bg-white/20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} className="h-40 bg-white/20" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4">
            <div className="container mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Welcome, {userProfile?.name}!</h1>
                        {userProfile?.organization && (
                            <p className="text-xl text-white/80">Organization: {userProfile.organization.name}</p>
                        )}
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>

                {/*{error && (
                    <Alert variant="destructive" className="bg-red-100 border-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}*/}

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {product.available ? (
                                    <Button onClick={() => handleProductSelect(product.id)} className="w-full bg-purple-600 hover:bg-purple-700">
                                        Select <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button disabled className="w-full">
                                        Not Available
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {userProfile?.onboardingComplete && products.length === 0 && (
                    <Alert className="bg-white/80 border-none">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Products Available</AlertTitle>
                        <AlertDescription>
                            There are currently no products available for your account. Please contact support for assistance.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}