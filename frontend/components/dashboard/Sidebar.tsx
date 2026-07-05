'use client';

import Logo from "./Logo";
import LogoutButton from "./LogoutButton";
import SidebarNav from "./SidebarNav";
import UserCard from "./UserCard";

interface Props{
    user:any;
}

export default function Sidebar({user}:Props){

    return(

        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">

            <Logo/>

            <SidebarNav/>
            <LogoutButton/>
            <UserCard user={user}/>

        </aside>

    )

}