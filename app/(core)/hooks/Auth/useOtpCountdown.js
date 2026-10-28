"use client";

import { useEffect, useState } from "react";

export function useOtpCountdown(initialSeconds = 120) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return undefined;

    const timerId = setTimeout(() => {
      setSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds]);

  const restart = () => setSeconds(initialSeconds);

  return { seconds, restart };
}
