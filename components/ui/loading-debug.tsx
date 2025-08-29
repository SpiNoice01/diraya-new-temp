"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context-simple"

interface LoadingDebugProps {
  message?: string
  showDebug?: boolean
}

export function LoadingDebug({ message = "Memuat...", showDebug = true }: LoadingDebugProps) {
  const { user, loading } = useAuth()
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
      
      {showDebug && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Loading: {loading ? "true" : "false"}</p>
          <p>User: {user ? user.email : "null"}</p>
          <p>Time elapsed: {timeElapsed}s</p>
          <p>Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  )
}
