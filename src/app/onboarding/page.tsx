'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BuildingIcon, CreditCardIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OnboardingWelcome() {
    const router = useRouter()

    const handleStart = () => {
        router.push('/onboarding/organization')
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Welcome to ChatCRM</h1>
                <p className="text-muted-foreground">Let's get your account set up in just a few easy steps</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <BuildingIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 pt-2">Organization Details</h2>
                        <p className="text-muted-foreground text-sm">Tell us about your company to personalize your experience</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <CreditCardIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 pt-2">Choose Your Plan</h2>
                        <p className="text-muted-foreground text-sm">Select the perfect plan to suit your business needs</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 pt-2">Ready to Go</h2>
                        <p className="text-muted-foreground text-sm">Get started with your fully configured ChatCRM account</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Your Data is Safe</h3>
                        <p className="text-muted-foreground text-sm">We take data security seriously. All your information is encrypted and protected.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <BuildingIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                </CardContent>
            </Card>

            <div className="text-center space-y-4">
                <p className="font-medium">Ready to revolutionize your customer relationships?</p>
                <Button onClick={handleStart} className="bg-gradient-to-r from-green-400 to-blue-500 text-white group relative overflow-hidden px-8 py-3 rounded-full transition-transform duration-200 ease-in-out transform hover:scale-105">
                    <span className="relative z-10">Begin Onboarding</span>
                    <ArrowRightIcon className="inline-block ml-2 h-5 w-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"></div>
                </Button>
            </div>
        </div>
    )
}