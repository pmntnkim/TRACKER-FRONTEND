import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import { CheckCircle, CircleAlert, Loader2, Crown } from "lucide-react"

const PremiumSuccess = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("Confirming your PayPal subscription...")

  useEffect(() => {
    const finalizePayment = async () => {
      const subscriptionID = (
        searchParams.get("subscription_id") ||
        searchParams.get("token") ||
        searchParams.get("orderID") ||
        ""
      ).trim()
      const token = localStorage.getItem("angrit_token")

      if (!subscriptionID) {
        setLoading(false)
        setSuccess(false)
        setMessage("Missing PayPal subscription ID in callback URL.")
        return
      }

      if (!token) {
        setLoading(false)
        setSuccess(false)
        setMessage("You are logged out. Please log in and try again.")
        return
      }

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/premium/paypal/activate-subscription/",
          { subscriptionID },
          config
        )
        setSuccess(true)
        setMessage(data?.message || "Premium subscription activated successfully.")
      } catch (error) {
        const detail =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to confirm PayPal subscription."
        setSuccess(false)
        setMessage(detail)
      } finally {
        setLoading(false)
      }
    }

    finalizePayment()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md angrit-card-elevated text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Crown className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-bold">Premium Checkout</h1>

        {loading ? (
          <div className="space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {success ? <CheckCircle className="w-6 h-6" /> : <CircleAlert className="w-6 h-6" />}
            </div>
            <p className={success ? "text-green-700" : "text-red-700"}>{message}</p>
          </div>
        )}

        <Link to="/dashboard" className="angrit-btn-primary w-full inline-flex items-center justify-center">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default PremiumSuccess
