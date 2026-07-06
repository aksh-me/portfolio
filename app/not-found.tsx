import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">404 — frame not found</p>
      <h1 className="mt-6 font-display text-display-2 font-medium">
        This page is <span className="italic text-accent">out of focus</span>.
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">
        Whatever was here has been cropped out. Let&apos;s get you back to the story.
      </p>
      <div className="mt-10">
        <Button href="/" variant="solid">
          Back to the start
        </Button>
      </div>
    </div>
  );
}
