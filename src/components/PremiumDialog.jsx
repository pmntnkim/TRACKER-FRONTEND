import React from "react"
import { useState } from "react"
import { Crown, Sparkles, ShieldCheck, Zap } from "lucide-react"
import axios from "axios"
import { useSelector } from "react-redux"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"

const PremiumDialog = ({ open, onOpenChange }) => {
  const { userInfo } = useSelector(state => state.authLogin)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckout = async () => {
    setLoading(true)
    setError("")

    try {
      const token = userInfo?.token || localStorage.getItem("angrit_token")
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/premium/paypal/create-order/",
        {},
        config
      )

      if (!data?.approve_url) {
        throw new Error("PayPal approval URL not returned.")
      }

      window.location.href = data.approve_url
    } catch (requestError) {
      const message =
        requestError.response?.data?.detail ||
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to start PayPal checkout."
      setError(message)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Crown className="w-5 h-5 text-primary" />
            Go Premium
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Unlock the full ANGRIT training experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
            <Sparkles className="w-4 h-4 mt-0.5 text-primary" />
            <p className="text-sm">Access all premium exercises and future pro programs.</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
            <Zap className="w-4 h-4 mt-0.5 text-primary" />
            <p className="text-sm">Get advanced workout templates and progression tools.</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-primary" />
            <p className="text-sm">Be first to unlock upcoming premium features.</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <div className="w-full space-y-3">
            {error && (
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20 p-2">
                {error}
              </p>
            )}
            <button
              className="angrit-btn-primary w-full"
              type="button"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Redirecting to PayPal..." : "Get Premium"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Secure checkout powered by PayPal Sandbox.
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PremiumDialog
