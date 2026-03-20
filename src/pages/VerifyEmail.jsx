import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import { Dumbbell, Loader2, CheckCircle, XCircle } from "lucide-react"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false)
        setSuccess(false)
        setMessage("Invalid verification link.")
        return
      }

      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/auth/verify-email/", {
          params: { token },
        })
        setSuccess(true)
        setMessage(data?.message || "Email verified successfully. You can now log in.")
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to verify email. Please try again."
        setSuccess(false)
        setMessage(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tight">ANGRIT</span>
          </Link>
          <p className="mt-4 text-muted-foreground">Email verification</p>
        </div>

        <div className="angrit-card-elevated text-center space-y-5">
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${success ? "bg-green-100" : "bg-red-100"}`}>
                {success ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <p className={success ? "text-green-700" : "text-red-700"}>{message}</p>
              <Link to="/login" className="angrit-btn-primary w-full inline-flex items-center justify-center">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
