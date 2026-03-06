import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Dumbbell, Loader2, Check } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { register, resetRegisterState } from "../actions/authActions"
import TermsOfServiceDialog from "../components/TermsOfServiceDialog"
import PrivacyPolicyDialog from "../components/PrivacyPolicyDialog"

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, userInfo, error, registerSuccess, registerMessage } = useSelector(state => state.authLogin)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (userInfo?.token) {
      navigate("/complete-profile")
    }
  }, [userInfo, navigate])

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState())
    }
  }, [dispatch])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(formData.password) }
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch(register(formData.username, formData.email, formData.password))
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
            Start your transformation today.
          </p>
        </div>

        {/* Register Form */}
        <div className="angrit-card-elevated">
          {registerSuccess ? (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Verify your email</h2>
                <p className="text-muted-foreground">{registerMessage}</p>
              </div>
              <Link
                to="/login"
                className="angrit-btn-primary w-full inline-flex items-center justify-center"
              >
                Go to Login
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
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                className="angrit-input w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="angrit-input w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="angrit-input w-full pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      req.met ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? "bg-success" : "bg-muted"
                      }`}
                    >
                      {req.met && <Check className="w-3 h-3 text-background" />}
                    </div>
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-border bg-input checked:bg-primary"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <TermsOfServiceDialog>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </button>
                </TermsOfServiceDialog>{" "}
                and{" "}
                <PrivacyPolicyDialog>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                </PrivacyPolicyDialog>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="angrit-btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
