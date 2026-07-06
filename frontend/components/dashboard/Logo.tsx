export default function Logo() {
    return (
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
            {/* Logo Image Wrapper */}
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center overflow-hidden">
                <img 
                    src="/logo.png" 
                    alt="TaskAnnotate Logo" 
                    className="w-full h-full object-contain p-1"
                />
            </div>

            <span className="font-bold text-slate-900 tracking-tight">
                TaskAnnotate
            </span>
        </div>
    );
}