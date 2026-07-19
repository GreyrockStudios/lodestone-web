import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'

export default function Terms() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-[var(--text-dim)] mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-[var(--text-muted)] leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Lodestone (&quot;Service&quot;), operated by Greyrock Studio
              (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, do not use the Service. These terms apply to both the web
              application and the desktop application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">2. User Accounts</h2>
            <p className="mb-3">To use the Service, you must create an account. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete registration information</li>
            </ul>
            <p className="mt-3">
              You must be at least 13 years old to create an account. If you are under 18, you must
              have parental consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">3. Service Tiers</h2>
            <p className="mb-3">
              During early access, access may be provided through founding or campaign packages that
              differ from standard launch pricing. At general availability, Lodestone is offered in
              the following standard tiers:
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text)] mb-1">Community ($0)</h3>
                <p>
                  Free forever at launch. Desktop app with core features. Bring-your-own-key (BYOK)
                  is required. No included Lodestone usage credits.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text)] mb-1">Pro ($30/month)</h3>
                <p>
                  Everything in Community plus remote web access (after early access), premium
                  providers, file uploads, sharing, included monthly usage credits, optional BYOK,
                  and credit packs or auto top-up. Billed monthly.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text)] mb-1">Studio ($60/month)</h3>
                <p>
                  Everything in Pro plus multiple agent identities, API access, higher included
                  usage, and dedicated support. Billed monthly.
                </p>
              </div>
            </div>
            <p className="mt-3">
              Founding packages may include prepaid months and locked renewal rates while the
              subscription remains active. Paid subscriptions are billed in advance. Prices may
              change with 30 days&apos; notice for non-locked plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate any applicable law or regulation</li>
              <li>Generate, distribute, or promote illegal, harmful, or offensive content</li>
              <li>Attempt to gain unauthorized access to other users&apos; accounts or our systems</li>
              <li>Interfere with or disrupt the Service&apos;s integrity or performance</li>
              <li>Use the Service to build competing products or services without authorization</li>
              <li>Reverse engineer, decompile, or disassemble the desktop application (see EULA)</li>
              <li>Share your account credentials with others</li>
              <li>Use automated means to access the Service beyond what our API permits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">5. Intellectual Property</h2>
            <p className="mb-3">
              The Service and its original content, features, and functionality are owned by Greyrock
              Studio and are protected by international copyright, trademark, and other intellectual
              property laws.
            </p>
            <p>
              <strong className="text-[var(--text)]">Your content:</strong> You retain ownership of
              all content you input into the Service. By using the Service, you grant us a limited
              license to process your content solely to provide the Service. We do not use your
              content to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">6. Open Source Components</h2>
            <p>
              The Lodestone desktop application is open source under the MIT License and available at{' '}
              <a
                href="https://github.com/GreyrockStudios/lodestone-desktop"
                className="text-[var(--cyan)]"
              >
                github.com/GreyrockStudios/lodestone-desktop
              </a>
              . The MIT License applies to the source code. These Terms of Service apply to your use
              of the hosted Service, cloud features, and paid subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">7. Payment and Billing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Paid subscriptions are billed monthly in advance via our payment processor</li>
              <li>You may cancel at any time; access continues until the end of your billing period</li>
              <li>No refunds for partial billing periods unless required by law</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice (founding locks excepted as offered)</li>
              <li>Failure to pay may result in suspension of paid features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">8. Limitation of Liability</h2>
            <p className="mb-3">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Service is provided &quot;as is&quot; without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amount you paid in the 12 months preceding the claim</li>
              <li>We are not responsible for the accuracy, completeness, or reliability of AI-generated content</li>
              <li>We are not liable for any loss of data stored on your local machine</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Greyrock Studio, its officers, directors,
              employees, and agents from any claims, damages, losses, or expenses arising from your
              use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">10. Termination</h2>
            <p className="mb-3">
              We may terminate or suspend your account at our discretion, with or without notice, for
              conduct that violates these Terms or is harmful to other users or the Service.
            </p>
            <p>You may delete your account at any time through Settings. Upon termination:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your right to use the Service ceases immediately</li>
              <li>We will delete your account data within 30 days (see Privacy Policy)</li>
              <li>Provisions that by their nature should survive termination remain in effect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">11. Modifications</h2>
            <p>
              We may modify these Terms at any time. Material changes will be notified via email or
              in-Service notice at least 30 days before taking effect. Continued use of the Service
              after changes become effective constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of
              Canada applicable therein. Any disputes shall be resolved in the courts of Ottawa,
              Ontario, Canada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">13. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@heylodestone.com" className="text-[var(--cyan)]">
                legal@heylodestone.com
              </a>
              .
            </p>
          </section>

          <section className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm">Greyrock Studio · Ottawa, Ontario, Canada</p>
          </section>
        </div>

        <div className="mt-12 flex gap-6 justify-center text-sm">
          <Link to="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
            Privacy Policy
          </Link>
          <Link to="/eula" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline">
            EULA
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}
