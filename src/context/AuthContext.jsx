import React from "react"
import { createContext, useContext } from "react"

const AuthContext = createContext({ isAuthenticated: false })

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
