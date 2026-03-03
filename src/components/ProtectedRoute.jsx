import React from "react";
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = () => {
  const { userInfo } = useSelector(state => state.authLogin)

  if (!userInfo?.token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
