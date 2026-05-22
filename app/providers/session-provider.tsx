"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  name?: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside SessionProvider")
  return ctx
}