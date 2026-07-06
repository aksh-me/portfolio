"use client";

import { useEffect, useState } from "react";

/** Live local time in JetBrains Mono — the footer / gallery clock. */
export default function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`font-mono text-xs tracking-widest text-muted tabular-nums ${className}`} suppressHydrationWarning>
      {time || "00:00:00"}
    </span>
  );
}
