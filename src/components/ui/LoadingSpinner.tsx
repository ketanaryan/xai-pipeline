import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "Processing AI Inference..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[250px] border border-neutral-100 rounded-lg bg-neutral-50/50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
      <p className="text-sm font-medium text-neutral-600 animate-pulse">{text}</p>
    </div>
  );
}
