import Link from "next/link";

export default function UserCard({user}:any){

    if(!user) return null;

    return(
        <div className="px-3 pb-4">

            <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >

                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-semibold text-sm">

                    {user.full_name.charAt(0).toUpperCase()}

                </div>

                <div className="min-w-0">

                    <p className="text-sm text-slate-900 font-medium truncate">
                        {user.full_name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                        {user.email}
                    </p>

                </div>

            </Link>

        </div>
    )
}