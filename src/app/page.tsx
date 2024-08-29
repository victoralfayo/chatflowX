'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MenuIcon, XIcon, MessageSquareIcon, BarChartIcon, ZapIcon } from 'lucide-react'
import Link from 'next/link'
import {useToast} from "@/components/ui/use-toast";

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })

            if (response.ok) {
                toast({
                    title: "Message sent!",
                    description: "We'll get back to you soon.",
                })
                setName('')
                setEmail('')
                setMessage('')
            } else {
                throw new Error('Failed to send message')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (isMenuOpen) {
            setTimeout(() => setMenuVisible(true), 10)
        } else {
            setMenuVisible(false)
        }
    }, [isMenuOpen])

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <Link href="/" className="flex items-center justify-center">
                        <ZapIcon className="h-6 w-6 text-purple-500"/>
                        <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Chatflow</span>
                    </Link>
                    <nav className="ml-auto hidden md:flex items-center gap-6">
                        <Link href="/crm" className="text-sm font-medium hover:underline underline-offset-4">
                            CRM
                        </Link>
                        <Link href="/marketing" className="text-sm font-medium hover:underline underline-offset-4">
                            Marketing
                        </Link>
                        <Link href="/automations" className="text-sm font-medium hover:underline underline-offset-4">
                            Automations
                        </Link>
                        <Link href="/signin">
                            <Button variant="outline">Sign In</Button>
                        </Link>
                        <Link href="/get-started">
                            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                    <div className="flex items-center gap-2 md:hidden ml-auto">
                        <Link href="/signin">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                        <Button
                            className="md:hidden"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <XIcon className="h-6 w-6"/> : <MenuIcon className="h-6 w-6"/>}
                        </Button>
                    </div>
                </div>
            </header>
            <div
                className={`md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <nav
                    className={`flex flex-col items-center justify-center h-full transition-transform duration-300 ease-in-out ${
                        menuVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
                >
                    <Button
                        className="absolute top-4 right-4"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <XIcon className="h-6 w-6"/>
                    </Button>
                    <Link href="/crm" className="py-2 text-lg font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                        CRM
                    </Link>
                    <Link href="/marketing" className="py-2 text-lg font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                        Marketing
                    </Link>
                    <Link href="/automations" className="py-2 text-lg font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                        Automations
                    </Link>
                    <Link href="/get-started" onClick={() => setIsMenuOpen(false)}>
                        <Button className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </div>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 to-blue-500">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                                    Streamline Your Business with Chatflow
                                </h1>
                                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                                    Integrate CRM, Marketing, and Automations in one powerful platform.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button className="bg-white text-purple-500 hover:bg-purple-100 font-semibold">Get Started</Button>
                                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Solutions</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/crm" className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <MessageSquareIcon className="h-12 w-12 text-purple-500"/>
                                <h3 className="text-xl font-bold">CRM</h3>
                                <p className="text-muted-foreground">Manage customer relationships effortlessly with our intelligent CRM system.</p>
                            </Link>
                            <Link href="/marketing" className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <BarChartIcon className="h-12 w-12 text-blue-500"/>
                                <h3 className="text-xl font-bold">Marketing</h3>
                                <p className="text-muted-foreground">Boost your marketing efforts with data-driven insights and automation.</p>
                            </Link>
                            <Link href="/automations" className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <ZapIcon className="h-12 w-12 text-green-500"/>
                                <h3 className="text-xl font-bold">Automations</h3>
                                <p className="text-muted-foreground">Streamline your workflows and increase productivity with smart automations.</p>
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Why Choose Chatflow</h2>
                        <div className="grid gap-10 sm:grid-cols-2 md:gap-16">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">All-in-One Solution</h3>
                                <p className="text-muted-foreground">
                                    Chatflow combines CRM, Marketing, and Automations in a single platform, providing a seamless experience for managing your business operations.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                                <p className="text-muted-foreground">
                                    Leverage the power of artificial intelligence to gain valuable insights, predict trends, and make data-driven decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Get in Touch</h2>
                        <div className="mx-auto max-w-[600px]">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <Input
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Input
                                    type="email"
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Textarea
                                    placeholder="Your Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className={"resize-none"}
                                />
                                <Button
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 bg-background border-t">
                <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center justify-center mb-4 md:mb-0">
                        <ZapIcon className="h-6 w-6 text-purple-500"/>
                        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Chatflow</span>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-sm hover:underline underline-offset-4">Privacy Policy</a>
                        <a href="#" className="text-sm hover:underline underline-offset-4">Terms of Service</a>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 md:mt-0">&copy; 2023 Chatflow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}