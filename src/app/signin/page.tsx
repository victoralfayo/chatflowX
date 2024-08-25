'use client'

import React, { useState, Fragment } from 'react'
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
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    // Add more country codes as needed
]

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [otpSent, setOtpSent] = useState(false)
    const router = useRouter()

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (loginMethod === 'password') {
            if (!email) newErrors.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
            if (!password) newErrors.password = 'Password is required'
        } else {
            if (!countryCode) newErrors.countryCode = 'Country code is required'
            if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required'
            else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSendOtp = async () => {
        if (validateForm()) {
            // Simulating OTP send
            setOtpSent(true)
            setOtp('') // Reset OTP when sending a new one
            // In a real app, you would call an API to send the OTP
            console.log('OTP sent to', countryCode + phoneNumber)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        if (loginMethod === 'otp') {
            if (!otpSent) {
                setErrors({ ...errors, otp: 'Please send and verify OTP first' })
                return
            }
            if (otp.length !== 6) {
                setErrors({ ...errors, otp: 'OTP must be 6 digits' })
                return
            }
        }

        setSubmitStatus('loading')

        // Simulating an API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setSubmitStatus('success')
            // Redirect to the dashboard after a short delay
            setTimeout(() => router.push('/dashboard'), 1500)
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
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center text-2xl font-bold">
                            <MessageSquareIcon className="h-6 w-6 mr-2 text-green-500" />
                            Sign In to ChatCRM
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submitStatus === 'error' && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>
                                    Invalid credentials. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}
                        {submitStatus === 'success' && (
                            <Alert className="mb-4">
                                <AlertDescription>
                                    Sign in successful! Redirecting...
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex space-x-2 mb-4">
                                <Button
                                    type="button"
                                    onClick={() => setLoginMethod('password')}
                                    variant={loginMethod === 'password' ? 'default' : 'outline'}
                                    className="w-1/2"
                                >
                                    Password
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setLoginMethod('otp')}
                                    variant={loginMethod === 'otp' ? 'default' : 'outline'}
                                    className="w-1/2"
                                >
                                    OTP
                                </Button>
                            </div>
                            {loginMethod === 'password' ? (
                                <>
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
                                </>
                            ) : (
                                <>
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
                                        <div className={"flex gap-8 items-center flex-row"}>
                                            <Label htmlFor="otp">Enter OTP</Label>
                                            <InputOTP
                                                value={otp}
                                                onChange={setOtp}
                                                maxLength={6}
                                            >
                                                <InputOTPGroup className={" flex justify-center"}>
                                                    <InputOTPSlot
                                                        index={0}
                                                        className={`w-10 h-12 text-center text-lg  transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                    <InputOTPSlot
                                                        index={1}
                                                        className={`w-10 h-12 text-center text-lg  transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                    <InputOTPSlot
                                                        index={2}
                                                        className={`w-10 h-12 text-center text-lg transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                    <InputOTPSlot
                                                        index={3}
                                                        className={`w-10 h-12 text-center text-lg  transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                    <InputOTPSlot
                                                        index={4}
                                                        className={`w-10 h-12 text-center text-lg transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                    <InputOTPSlot
                                                        index={5}
                                                        className={`w-10 h-12 text-center text-lg transition-all duration-200 ease-in-out transform border-green-600 focus:border-green-500 focus:ring focus:ring-green-200 `}
                                                    />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                                        </div>
                                    )}
                                </>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                disabled={submitStatus === 'loading' || (loginMethod === 'otp' && (!otpSent || otp.length !== 6))}
                            >
                                {submitStatus === 'loading' ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/get-started" className="text-blue-500 hover:underline">
                                Get Started
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}