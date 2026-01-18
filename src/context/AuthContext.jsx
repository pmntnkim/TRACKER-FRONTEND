import React from "react"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)

  const login = newToken => {
    setIsAuthenticated(true)
    if (newToken) {
      setToken(newToken)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, setToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
