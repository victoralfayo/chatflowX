'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ZapIcon, ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {register, sendOTP, verifyOTP} from "@/app/api/auth";

const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
]

export default function GetStarted() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
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
            setSubmitStatus('loading')
            try {
                await sendOTP(countryCode + phoneNumber)
                setOtpSent(true)
                setOtp('')
                setOtpVerified(false)
                setSubmitStatus('idle')
            } catch (error) {
                setSubmitStatus('error')
                setErrors({ ...errors, otp: 'Failed to send OTP. Please try again.' })
            }
        }
    }

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setErrors({ ...errors, otp: 'OTP must be 6 digits' })
            return
        }

        setSubmitStatus('loading')
        try {
            await verifyOTP(countryCode + phoneNumber, otp)
            setOtpVerified(true)
            setErrors({ ...errors, otp: '' })
            setSubmitStatus('idle')
        } catch (error) {
            setOtpVerified(false)
            setErrors({ ...errors, otp: 'Invalid OTP' })
            setSubmitStatus('idle')
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

        try {
            await register({
                name,
                email,
                password,
                phoneNumber: countryCode + phoneNumber
            })
            setSubmitStatus('success')
            setTimeout(() => router.push('/dashboard'), 1500)
        } catch (error) {
            setSubmitStatus('error')
            setErrors({ ...errors, form: 'Registration failed. Please try again.' })
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
            <header className="w-full p-4">
                <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                    <ArrowLeftIcon className="inline-block mr-2" /> Back to Home
                </Link>
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
                <Card className="w-full max-w-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center text-2xl font-bold">
                            <ZapIcon className="h-6 w-6 mr-2 text-purple-500" />
                            Get Started with Chatflow
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
                                    Account created successfully! Redirecting to dashboard...
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
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${errors.password ? 'border-red-500' : ''} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
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
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
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
                                                        className="w-10 h-12 text-center text-lg transition-all duration-200 ease-in-out transform border-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
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
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                disabled={submitStatus === 'loading' || !otpSent || !otpVerified}
                            >
                                {submitStatus === 'loading' ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-purple-500 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}