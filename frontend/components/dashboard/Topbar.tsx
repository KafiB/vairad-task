import { Bell } from "lucide-react";

export default function Topbar(){

    return(

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6">

            <button
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Coming soon"
            >

                <Bell size={20} className="text-slate-500"/>

            </button>

        </header>

    )

}