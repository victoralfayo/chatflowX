"use client"

import { MessageSquareIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const steps = [
    { path: '/onboarding', label: 'Welcome' },
    { path: '/onboarding/organization', label: 'Organization' },
    { path: '/onboarding/plan', label: 'Plan' },
    { path: '/onboarding/success', label: 'Success' },
]

export default function OnboardingLayout({ children,}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const currentStepIndex = steps.findIndex(step => step.path === pathname)

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
            <header className="w-full p-4">
                <div className="flex items-center justify-center">
                    <MessageSquareIcon className="h-8 w-8 text-white" />
                    <span className="ml-2 text-2xl font-bold text-white">
                        ChatCRM Onboarding
                    </span>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center px-4 flex-col">
                <div className="flex justify-between mb-8 w-1/3">
                    {steps.map((step, index) => (
                        <Link key={step.path} href={step.path} className="flex flex-col items-center group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                index <= currentStepIndex
                                    ? 'bg-white text-green-500'
                                    : 'bg-gray-300 text-gray-500 group-hover:bg-gray-200'
                            }`}>
                                {index + 1}
                            </div>
                            <span className="mt-2 text-sm text-white">{step.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    )
}