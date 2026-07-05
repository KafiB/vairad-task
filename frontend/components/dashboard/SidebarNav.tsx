'use client';

import { usePathname } from "next/navigation";
import { navItems } from "./navigation";
import NavItem from "./NavItem";

export default function SidebarNav(){

    const pathname=usePathname();

    return(
        <nav className="flex-1 px-3 py-4 space-y-1">

            {navItems.map(item=>(
                <NavItem
                    key={item.href}
                    item={item}
                    isActive={pathname===item.href}
                />
            ))}

        </nav>
    )
}