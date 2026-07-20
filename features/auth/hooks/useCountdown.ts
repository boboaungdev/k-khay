import { useEffect, useState } from "react"

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setIsRunning(false)
          return initialSeconds
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [initialSeconds, isRunning, seconds])

  return {
    seconds,
    isRunning,
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    reset: () => setSeconds(initialSeconds),
    label: `0:${seconds.toString().padStart(2, "0")}`,
  }
}
