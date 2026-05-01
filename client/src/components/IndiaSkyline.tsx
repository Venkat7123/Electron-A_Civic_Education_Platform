export function TricolorBand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-2 w-full ${className}`}>
      <div className="flex-1 bg-saffron" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-india-green" />
    </div>
  );
}