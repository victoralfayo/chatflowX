'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        price: '$9.99/month',
        contacts: '1,000',
        messages: '10,000',
        integrations: '2',
        features: [
            'Email support',
            'Basic analytics',
            'Mobile app access'
        ]
    },
    {
        id: 'professional',
        name: 'Professional',
        price: '$29.99/month',
        contacts: '10,000',
        messages: '100,000',
        integrations: '5',
        features: [
            'Priority email support',
            'Advanced analytics',
            'Team collaboration tools',
            'Custom branding'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom pricing',
        contacts: 'Unlimited',
        messages: 'Unlimited',
        integrations: 'Unlimited',
        features: [
            '24/7 phone and email support',
            'Dedicated account manager',
            'Custom integrations',
            'On-premise deployment option',
            'Advanced security features'
        ]
    },
]

export default function PlanSelection() {
    const [selectedPlan, setSelectedPlan] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Selected plan:', selectedPlan)
        router.push('/onboarding/success')
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Choose Your Perfect Plan</h1>
                <p className="text-muted-foreground">Select the plan that best fits your business needs</p>
            </div>

            <form onSubmit={handleSubmit}>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id} className={`relative overflow-hidden transition-shadow hover:shadow-lg ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {plan.name}
                                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                                    <Label
                                        htmlFor={plan.id}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                    >
                                        {selectedPlan === plan.id && <CheckIcon className="h-4 w-4 text-white" />}
                                    </Label>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-2xl font-bold">{plan.price}</p>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>Contacts:</strong> {plan.contacts}</li>
                                    <li><strong>Messages:</strong> {plan.messages}</li>
                                    <li><strong>Integrations:</strong> {plan.integrations}</li>
                                </ul>
                                <div className="border-t pt-4">
                                    <p className="font-semibold mb-2">Features:</p>
                                    <ul className="space-y-1 text-sm">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                            {selectedPlan === plan.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                            )}
                        </Card>
                    ))}
                </RadioGroup>
                <div className="flex justify-between mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/onboarding/organization')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center space-x-2"
                        disabled={!selectedPlan}
                    >
                        <span>Next</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}