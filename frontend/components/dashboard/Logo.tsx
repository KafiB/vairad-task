import { CheckSquare } from "lucide-react";

export default function Logo() {
    return (
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <CheckSquare size={18} className="text-white"/>
            </div>

            <span className="font-bold text-slate-900 tracking-tight">
                TaskAnnotate
            </span>
        </div>
    );
}