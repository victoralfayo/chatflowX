"use client"

import {
    BellIcon,
    LogOutIcon,
    MessageCircle,
    MessageSquareIcon,
    PencilIcon,
    PlusIcon,
    Radio,
    Ticket, TrashIcon,
    Users,
    MenuIcon
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {useState} from "react";


const navItems = [
    { href: 'marketing/dashboard', label: 'Dashboard' },
    { href: 'marketing/dashboard/organization', label: 'Organization & Agents' },
    { href: 'marketing/dashboard/integrations', label: 'Integrations' },
    { href: 'marketing/dashboard/customers', label: 'Customers' },
    { href: 'marketing/dashboard/chats', label: 'Chats' },
    { href: 'marketing/dashboard/tickets', label: 'Tickets' },
    { href: 'marketing/dashboard/menu-apps', label: 'Menu Apps' },
    { href: 'marketing/dashboard/templates', label: 'Templates' },
    { href: 'marketing/dashboard/schedules', label: 'Schedules' },
]

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <MessageSquareIcon className="h-8 w-8 text-jade-900"/>
                            <span className="ml-2 text-2xl font-bold text-jade-950">ChatCRM</span>
                        </div>
                        <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        className={pathname === item.href ? "border-green-500 text-gray-900" : "text-gray-500"}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative">
                                    <BellIcon className="h-5 w-5"/>
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>New message received</DropdownMenuItem>
                                <DropdownMenuItem>Ticket updated</DropdownMenuItem>
                                <DropdownMenuItem>Broadcast approved</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-3">
                                    <Image className="h-8 w-8 rounded-full" src="/placeholder.svg" alt="User avatar" width={32} height={32}/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <LogOutIcon className="mr-2 h-4 w-4"/>
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden ml-2">
                                    <MenuIcon className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4 mt-4">
                                    {navItems.map((item) => (
                                        <Link key={item.href} href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default function OnboardingLayout({ children,}: { children: React.ReactNode}) {

    return (
        <div className="flex flex-col min-h-screen bg-jade-600">

            <main className="flex-grow flex items-center justify-center px-2 py-2 flex-col">
                <div className="bg-white p-4 rounded-lg shadow-lg w-full ">
                    <div className="flex flex-col min-h-screen bg-gray-100">
                        {/* Top Navigation */}
                        <Header />
                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto p-4">
                            <div className="mt-4">
                                {children} {/* This will render the content of the respective page */}
                            </div>
                        </main>
                    </div>
                </div>
            </main>
        </div>
)
}