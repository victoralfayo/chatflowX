'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircleIcon, BuildingIcon, CreditCardIcon, GlobeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Success() {
    const router = useRouter()

    // In a real application, you would fetch this data from your state management or backend
    const config = {
        organizationName: "Acme Inc.",
        industry: "Technology",
        size: "51-200 employees",
        country: "United States",
        plan: "Professional",
        contacts: "10,000",
        messages: "100,000",
        integrations: "5"
    }

    const handleFinish = () => {
        // Here you would typically finalize the onboarding process
        console.log('Onboarding completed')
        router.push('/dashboard') // Assuming you have a dashboard page
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">Welcome aboard, {config.organizationName}!</h1>
                <p className="text-muted-foreground mt-2">Your ChatCRM account is ready to revolutionize your customer relationships.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <BuildingIcon className="h-6 w-6 text-blue-500" />
                            <h2 className="text-xl font-semibold">Organization Details</h2>
                        </div>
                        <ul className="space-y-2">
                            <li><strong>Industry:</strong> {config.industry}</li>
                            <li><strong>Size:</strong> {config.size}</li>
                            <li><strong>Country:</strong> {config.country}</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <CreditCardIcon className="h-6 w-6 text-green-500" />
                            <h2 className="text-xl font-semibold">Selected Plan: {config.plan}</h2>
                        </div>
                        <ul className="space-y-2">
                            <li><strong>Contacts:</strong> {config.contacts}</li>
                            <li><strong>Messages:</strong> {config.messages}</li>
                            <li><strong>Integrations:</strong> {config.integrations}</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <GlobeIcon className="h-6 w-6 text-purple-500" />
                        <h2 className="text-xl font-semibold">Next Steps</h2>
                    </div>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Customize your dashboard</li>
                        <li>Import your contacts</li>
                        <li>Set up your first customer interaction workflow</li>
                        <li>Explore available integrations</li>
                    </ul>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push('/onboarding/plan')}
                >
                    Back to Plans
                </Button>
                <Button onClick={handleFinish} className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}