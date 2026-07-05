'use client';

import Link from "next/link";

interface Props{
    item:any;
    isActive:boolean;
}

export default function NavItem({item,isActive}:Props){

    const Icon=item.icon;

    const content=(
        <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                ?'bg-brand-light text-brand'
                :item.functional
                ?'text-slate-600 hover:bg-slate-100'
                :'text-slate-400 cursor-not-allowed'
            }`}
        >
            <Icon size={18}/>
            {item.label}
        </div>
    );

    if(item.functional){
        return(
            <Link href={item.href}>
                {content}
            </Link>
        )
    }

    return(
        <div title="Coming soon">
            {content}
        </div>
    )
}