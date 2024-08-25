import React from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/SIdebar";

function Layout({ children,}: {   children: React.ReactNode}) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
                <Header/>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;