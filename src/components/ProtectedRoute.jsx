import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = () => {
  const { userInfo } = useSelector(state => state.authLogin)
  const location = useLocation()

  if (!userInfo?.token) {
    return <Navigate to="/login" replace />
  }

  if (userInfo?.needs_profile && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />
  }

  if (!userInfo?.needs_profile && location.pathname === "/complete-profile") {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
