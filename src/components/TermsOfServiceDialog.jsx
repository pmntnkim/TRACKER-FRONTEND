import React from "react" 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"

const TermsOfServiceDialog = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">
              Last updated: January 2026
            </p>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using ANGRIT, you accept and agree to be bound
                by the terms and provisions of this agreement. If you do not
                agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                2. Description of Service
              </h3>
              <p>
                ANGRIT is a workout tracking application that allows users to
                log exercises, track progress, and manage their fitness
                routines. We reserve the right to modify, suspend, or
                discontinue the service at any time.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                3. User Accounts
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">4. User Conduct</h3>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious content or spam</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                5. Health Disclaimer
              </h3>
              <p>
                ANGRIT is not a substitute for professional medical advice.
                Always consult with a healthcare professional before starting
                any exercise program. We are not responsible for any injuries
                that may occur during your workouts.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                6. Intellectual Property
              </h3>
              <p>
                All content, features, and functionality of ANGRIT are owned by
                us and are protected by international copyright, trademark, and
                other intellectual property laws.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                7. Limitation of Liability
              </h3>
              <p>
                ANGRIT shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of the service.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">
                8. Changes to Terms
              </h3>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-foreground font-semibold">9. Contact</h3>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at support@angrit.com.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default TermsOfServiceDialog
