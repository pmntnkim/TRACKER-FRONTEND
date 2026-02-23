import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dumbbell, Loader2, Mail, ArrowLeft } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, resetForgotPasswordState } from "../actions/authActions"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, success, message, error } = useSelector(state => state.forgotPassword)

  const [email, setEmail] = useState("")

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordState())
    }
  }, [dispatch])

  const handleSubmit = async e => {
    e.preventDefault()
    if (email) {
      dispatch(forgotPassword(email))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tight">
              ANGRIT
            </span>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="angrit-card-elevated">
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to {email}. Please check your email and follow the instructions.
                </p>
              </div>
              <Link
                to="/login"
                className="angrit-btn-primary w-full inline-flex items-center justify-center gap-2"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="angrit-input w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your account
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="angrit-btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
