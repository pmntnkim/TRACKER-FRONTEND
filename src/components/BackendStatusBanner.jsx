import React, { useCallback, useEffect, useRef, useState } from "react"
import { checkBackendHealth } from "../services/healthApi"

const RETRY_INTERVAL_MS = 15000

const BackendStatusBanner = () => {
  const [isDown, setIsDown] = useState(false)
  const [checking, setChecking] = useState(false)
  const intervalRef = useRef(null)

  const runCheck = useCallback(async () => {
    setChecking(true)
    const healthy = await checkBackendHealth()
    setIsDown(!healthy)
    setChecking(false)
  }, [])

  useEffect(() => {
    runCheck()
  }, [runCheck])

  useEffect(() => {
    if (isDown) {
      intervalRef.current = setInterval(runCheck, RETRY_INTERVAL_MS)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isDown, runCheck])

  if (!isDown) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground text-sm px-4 py-2 flex items-center justify-center gap-3">
      <span>
        Can't reach the server right now. Some features may not work until it's back.
      </span>
      <button
        type="button"
        onClick={runCheck}
        disabled={checking}
        className="underline font-medium disabled:opacity-60"
      >
        {checking ? "Checking..." : "Retry"}
      </button>
    </div>
  )
}

export default BackendStatusBanner
