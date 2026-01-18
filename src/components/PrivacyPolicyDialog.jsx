import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"

const PrivacyPolicyDialog = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">
              Last updated: January 2026
            </p>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                1. Information We Collect
              </h3>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (fitness goals, preferences)</li>
                <li>Workout data (exercises, sets, reps, weights)</li>
                <li>Usage data (how you interact with our app)</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                2. How We Use Your Information
              </h3>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your workout experience</li>
                <li>Track your fitness progress</li>
                <li>Send you updates and notifications</li>
                <li>Respond to your requests and support needs</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                3. Information Sharing
              </h3>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist our operations</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                4. Data Security
              </h3>
              <p>
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                5. Data Retention
              </h3>
              <p>
                We retain your personal information for as long as your account
                is active or as needed to provide you services. You may request
                deletion of your account and associated data at any time.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">6. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your workout data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                7. Cookies and Tracking
              </h3>
              <p>
                We use cookies and similar technologies to enhance your
                experience, analyze usage patterns, and deliver personalized
                content. You can control cookie preferences through your browser
                settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                8. Children's Privacy
              </h3>
              <p>
                ANGRIT is not intended for children under 13 years of age. We do
                not knowingly collect personal information from children under
                13.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                9. Changes to This Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">10. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@angrit.com.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PrivacyPolicyDialog
