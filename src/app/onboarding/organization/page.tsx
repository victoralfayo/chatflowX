'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { BuildingIcon, BriefcaseIcon, UsersIcon, GlobeIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Services", "Other"
]

const companySizes = [
    "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
]

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    // Add more countries as needed
]

export default function OrganizationDetails() {
    const [orgName, setOrgName] = useState('')
    const [industry, setIndustry] = useState('')
    const [size, setSize] = useState('')
    const [country, setCountry] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Organization details:', { orgName, industry, size, country })
        router.push('/onboarding/plan')
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Tell Us About Your Organization</h1>
                <p className="text-muted-foreground">Help us tailor ChatCRM to your specific needs</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <BuildingIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <Label htmlFor="orgName" className="text-xl font-semibold">Organization Name</Label>
                        </div>
                        <Input
                            id="orgName"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Enter your organization name"
                            className="text-lg"
                            required
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <BriefcaseIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <Label htmlFor="industry" className="text-xl font-semibold">Industry</Label>
                            </div>
                            <Select value={industry} onValueChange={setIndustry} required>
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => (
                                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <UsersIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <Label htmlFor="size" className="text-xl font-semibold">Company Size</Label>
                            </div>
                            <Select value={size} onValueChange={setSize} required>
                                <SelectTrigger id="size">
                                    <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companySizes.map((s) => (
                                        <SelectItem key={s} value={s}>{s} employees</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <GlobeIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <Label htmlFor="country" className="text-xl font-semibold">Country</Label>
                        </div>
                        <Select value={country} onValueChange={setCountry} required>
                            <SelectTrigger id="country">
                                <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/onboarding')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center space-x-2"
                        disabled={!orgName || !industry || !size || !country}
                    >
                        <span>Next</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}