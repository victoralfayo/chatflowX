'use client'

import {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MenuIcon, XIcon, MessageSquareIcon, BarChartIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)

    useEffect(() => {
        if (isMenuOpen) {
            // Small delay to trigger the transition
            setTimeout(() => setMenuVisible(true), 10)
        } else {
            setMenuVisible(false)
        }
    }, [isMenuOpen])

    return (
        <div className="flex flex-col min-h-screen">
            <header
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <a className="flex items-center justify-center" href="#">
                        <MessageSquareIcon className="h-6 w-6 text-green-400"/>
                        <span
                            className="ml-2 text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">ChatCRM</span>
                    </a>
                    <nav className="ml-auto hidden md:flex items-center gap-6">
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#about">
                            About
                        </a>
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                            Features
                        </a>
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
                            Contact
                        </a>
                        <Link href="/signin">
                            <Button variant="outline">Sign In</Button>
                        </Link>
                        <Link href="/get-started">
                            <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                    <div className="flex items-center gap-2 md:hidden ml-auto">
                        <Button variant="outline" size="sm">Sign In</Button>
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
                    <a className="py-2 text-lg font-medium hover:underline underline-offset-4" href="#about"
                       onClick={() => setIsMenuOpen(false)}>
                        About
                    </a>
                    <a className="py-2 text-lg font-medium hover:underline underline-offset-4" href="#features"
                       onClick={() => setIsMenuOpen(false)}>
                        Features
                    </a>
                    <a className="py-2 text-lg font-medium hover:underline underline-offset-4" href="#contact"
                       onClick={() => setIsMenuOpen(false)}>
                        Contact
                    </a>
                    <Link href="/get-started" onClick={() => setIsMenuOpen(false)}>
                        <Button className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </div>
            <main className="flex-1">
                <section
                    className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-green-400 to-blue-500">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                                    Revolutionize Your Customer Relationships
                                </h1>
                                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                                    ChatCRM: The intelligent way to manage customer interactions and boost your business
                                    growth.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button className="bg-white text-green-500 hover:bg-green-100 font-semibold">Get
                                    Started</Button>
                                <Button variant="outline"
                                        className="bg-transparent text-white border-white hover:bg-white/10">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">About
                            ChatCRM</h2>
                        <div className="grid gap-10 sm:grid-cols-2 md:gap-16">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    At ChatCRM, we're dedicated to empowering businesses with intelligent customer
                                    relationship management tools. Our mission is to streamline communication, enhance
                                    customer satisfaction, and drive business growth through innovative chat-based
                                    solutions.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Why Choose Us</h3>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>AI-powered chat analytics</li>
                                    <li>Seamless integration with existing systems</li>
                                    <li>Customizable to fit your unique business needs</li>
                                    <li>24/7 customer support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key
                            Features</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-background rounded-lg shadow-lg">
                                <MessageSquareIcon className="h-12 w-12 text-green-400"/>
                                <h3 className="text-xl font-bold">Intelligent Chat Management</h3>
                                <p className="text-muted-foreground">Efficiently handle multiple customer conversations
                                    with AI-assisted routing and prioritization.</p>
                            </div>
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-background rounded-lg shadow-lg">
                                <BarChartIcon className="h-12 w-12 text-blue-500"/>
                                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                                <p className="text-muted-foreground">Gain valuable insights from customer interactions
                                    to improve your service and boost sales.</p>
                            </div>
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-background rounded-lg shadow-lg">
                                <UsersIcon className="h-12 w-12 text-green-400"/>
                                <h3 className="text-xl font-bold">Team Collaboration</h3>
                                <p className="text-muted-foreground">Seamlessly work together with your team to provide
                                    exceptional customer service.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Contact Us</h2>
                        <div className="mx-auto max-w-[600px]">
                            <form className="space-y-4">
                                <Input placeholder="Your Name"/>
                                <Input type="email" placeholder="Your Email"/>
                                <Textarea placeholder="Your Message"/>
                                <Button
                                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold">Send
                                    Message</Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 bg-background border-t">
                <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center justify-center mb-4 md:mb-0">
                        <MessageSquareIcon className="h-6 w-6 text-green-400"/>
                        <span
                            className="ml-2 text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">ChatCRM</span>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-sm hover:underline underline-offset-4">Privacy Policy</a>
                        <a href="#" className="text-sm hover:underline underline-offset-4">Terms of Service</a>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 md:mt-0">&copy; 2023 ChatCRM. All rights
                        reserved.</p>
                </div>
            </footer>
        </div>
    )
}
