'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    Link as LinkIcon,
    UserCircle,
    MessageCircle,
    Ticket,
    Menu,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Organization', href: '/organization' },
    { icon: LinkIcon, label: 'Integrations', href: '/integrations' },
    { icon: UserCircle, label: 'Customers', href: '/customers' },
    { icon: MessageCircle, label: 'Chats', href: '/chats' },
    { icon: Ticket, label: 'Tickets', href: '/tickets' },
    { icon: Menu, label: 'Menu Apps', href: '/menu-apps' },
    { icon: FileText, label: 'Templates', href: '/templates' },
    { icon: Calendar, label: 'Schedules', href: '/schedules' },
]

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className={` fixed top-3 left-5 z-40 lg:hidden`}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                <Menu className="h-4 w-4" />
            </Button>
            <aside
                className={`fixed inset-y-0 left-0 z-30 lg:relative max-w-48 bg-white shadow-lg transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isExpanded ? "max-w-48" : "w-20"} lg:translate-x-0 transition-all duration-300 ease-in-out`}>
                <nav className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-4">
                        {isExpanded && <span className="text-xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out">ChatCRM</span>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="hidden lg:flex"
                        >
                            {isExpanded ? <ChevronLeft className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                        </Button>
                    </div>
                    <ul className="space-y-2 p-4 flex-1">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} passHref>
                                    <Button
                                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                                        className={`
                                            "w-full justify-start" ${!isExpanded ? "justify-center px-2" : ''} transition-all duration-300 ease-in-out`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <item.icon className={`h-4 w-4", ${isExpanded ? "mr-2" : ''}`}/>
                                        {isExpanded && <span className={"whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"}>{item.label}</span>}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}