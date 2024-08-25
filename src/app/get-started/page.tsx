'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquareIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    // Add more country codes as needed
]

export default function GetStarted() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const router = useRouter()

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!name) newErrors.name = 'Name is required'
        if (!email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
        if (!password) newErrors.password = 'Password is required'
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if (!countryCode) newErrors.countryCode = 'Country code is required'
        if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required'
        else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSendOtp = async () => {
        if (validateForm()) {
            // Simulating OTP send
            setOtpSent(true)
            setOtp('') // Reset OTP when sending a new one
            setOtpVerified(false) // Reset verification status
            // In a real app, you would call an API to send the OTP
            console.log('OTP sent to', countryCode + phoneNumber)
            console.log("OTP 123456")
        }
    }

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setErrors({ ...errors, otp: 'OTP must be 6 digits' })
            return
        }

        // Simulating OTP verification
        // In a real app, you would call an API to verify the OTP
        if (otp === '123456') {
            setOtpVerified(true)
            setErrors({ ...errors, otp: '' })
        } else {
            setOtpVerified(false)
            setErrors({ ...errors, otp: 'Invalid OTP' })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        if (!otpSent || !otpVerified) {
            setErrors({ ...errors, otp: 'Please verify OTP first' })
            return
        }

        setSubmitStatus('loading')

        // Simulating an API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setSubmitStatus('success')
            // Redirect to the onboarding greeting page after a short delay
            setTimeout(() => router.push('/onboarding'), 1500)
        } catch (error) {
            setSubmitStatus('error')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
            <header className="w-full p-4">
                <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                    <ArrowLeftIcon className="inline-block mr-2" /> Back to Home
                </Link>
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
                <Card className="w-full max-w-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center text-2xl font-bold">
                            <MessageSquareIcon className="h-6 w-6 mr-2 text-green-500" />
                            Get Started with ChatCRM
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submitStatus === 'error' && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>
                                    An error occurred. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}
                        {submitStatus === 'success' && (
                            <Alert className="mb-4">
                                <AlertDescription>
                                    Account created successfully! Redirecting...
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">User Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-1/3">
                                    <Label htmlFor="countryCode">Code</Label>
                                    <Select value={countryCode} onValueChange={setCountryCode}>
                                        <SelectTrigger id="countryCode" className={errors.countryCode ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countryCodes.map((cc) => (
                                                <SelectItem key={cc.code} value={cc.code}>
                                                    {cc.code} ({cc.country})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.countryCode && <p className="text-red-500 text-sm mt-1">{errors.countryCode}</p>}
                                </div>
                                <div className="w-2/3">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className={errors.phoneNumber ? 'border-red-500' : ''}
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                                </div>
                            </div>
                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white"
                            >
                                {otpSent ? 'Resend OTP' : 'Send OTP'}
                            </Button>
                            {otpSent && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-6 items-center">
                                        <Label htmlFor="otp">Enter OTP</Label>
                                        <InputOTP
                                            value={otp}
                                            onChange={setOtp}
                                            maxLength={6}
                                        >
                                            <InputOTPGroup className="flex justify-center">
                                                {[...Array(6)].map((_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="w-10 h-12 text-center text-lg transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                        disabled={otp.length !== 6}
                                    >
                                        Verify OTP
                                    </Button>
                                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                                    {otpVerified && <p className="text-green-500 text-sm mt-1">OTP verified successfully!</p>}
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                disabled={submitStatus === 'loading' || !otpSent || !otpVerified}
                            >
                                {submitStatus === 'loading' ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-blue-500 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}