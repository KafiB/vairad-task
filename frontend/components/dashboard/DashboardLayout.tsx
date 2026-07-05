'use client';

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "@/lib/hooks/useAuth";

interface Props{
    children:ReactNode;
}

export default function DashboardLayout({children}:Props){

    const {user}=useAuth();

    return(

        <div className="min-h-screen flex bg-slate-50">

            <Sidebar user={user}/>

            <div className="flex-1 flex flex-col">

                <Topbar/>

                <main className="flex-1 p-8">

                    {children}

                </main>

            </div>

        </div>

    )

}