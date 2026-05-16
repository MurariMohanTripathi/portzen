export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 text-cyan-200 grid place-items-center">
      <div className="h-12 w-12 rounded-full border-2 border-cyan-300/30 border-t-cyan-300 animate-spin" />
    </div>
  );
}
