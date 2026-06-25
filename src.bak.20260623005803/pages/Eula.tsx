import { Link } from 'react-router-dom'

export default function Eula() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="px-8 py-4 flex items-center gap-2.5 border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
            <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
          </svg>
          <span className="font-extrabold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">End User License Agreement</h1>
        <p className="text-sm text-[var(--text-dim)] mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[var(--text-muted)] leading-relaxed text-[15px]">
          <section>
            <p>This End User License Agreement ("EULA") is a legal agreement between you ("User," "you") and Greyrock Studio ("Company," "we," "us") for the Lodestone desktop application software ("Software"). By downloading, installing, or using the Software, you agree to be bound by this EULA.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">1. License Grant</h2>
            <p className="mb-3">Subject to your compliance with this EULA, Greyrock Studio grants you a limited, non-exclusive, non-transferable, revocable license to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Install and run the Software on personal computers that you own or control</li>
              <li>Use the Software for your personal or business purposes in accordance with the applicable subscription tier</li>
              <li>Make backup copies of the Software for archival purposes</li>
            </ul>
            <p className="mt-3">This license does not grant you any title to or ownership of the Software. The Software is licensed, not sold.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">2. Open Source License</h2>
            <p>The Lodestone desktop application source code is available under the MIT License at <a href="https://github.com/GreyrockStudios/lodestone-desktop" className="text-[var(--cyan)]">github.com/GreyrockStudios/lodestone-desktop</a>. The MIT License grants you additional rights to the source code, including the right to modify and redistribute it under the terms of that license. This EULA applies to the pre-built binary distribution and your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">3. Restrictions</h2>
            <p className="mb-3">You may not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the pre-built binary distribution (except to the extent that applicable law prohibits this restriction, or as permitted by the MIT License for source code distributions)</li>
              <li>Redistribute, sell, rent, lease, or sublicense the pre-built binary distribution without written permission</li>
              <li>Remove, alter, or obscure any proprietary notices on the Software</li>
              <li>Use the Software in any way that violates applicable laws or regulations</li>
              <li>Use the Software to develop competing products or services</li>
              <li>Modify the Software to bypass authentication, licensing, or usage controls</li>
              <li>Incorporate the Software into malicious software or tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">4. Ownership</h2>
            <p>The Software, including all intellectual property rights therein, is owned by Greyrock Studio. The MIT License applies only to the source code as published in the repository. This EULA does not transfer any ownership rights to you. All rights not expressly granted in this EULA are reserved by Greyrock Studio.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">5. User Content</h2>
            <p className="mb-3">You retain all rights to content you create, input, or generate through the Software, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Conversations and chat messages</li>
              <li>Agent configurations and personalities</li>
              <li>Memory data and knowledge graphs</li>
              <li>Custom prompts and workflows</li>
            </ul>
            <p className="mt-3">You grant Greyrock Studio a limited, non-exclusive license to process and store your content solely for the purpose of providing the Service, including cloud sync features for paid tiers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">6. Disclaimers</h2>
            <p className="mb-3">To the fullest extent permitted by applicable law:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Software is provided "as is" and "as available" without warranties of any kind, whether express, implied, or statutory</li>
              <li>We do not warrant that the Software will be error-free, uninterrupted, or meet your specific requirements</li>
              <li>We do not warrant the accuracy, completeness, or reliability of AI-generated content</li>
              <li>We disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>No advice or information obtained from the Software creates any warranty not expressly stated in this EULA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">7. Limitation of Liability</h2>
            <p className="mb-3">To the maximum extent permitted by applicable law:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>In no event shall Greyrock Studio be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities</li>
              <li>Our total aggregate liability shall not exceed the amount you paid for the Software in the 12 months preceding the claim, or $100 CAD, whichever is greater</li>
              <li>We are not liable for any loss or corruption of data stored on your local device</li>
              <li>We are not liable for any actions taken based on AI-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">8. Termination</h2>
            <p className="mb-3">This EULA is effective until terminated. It will terminate automatically if you fail to comply with any term. You may terminate at any time by uninstalling the Software.</p>
            <p>Upon termination:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>You must cease all use of the Software</li>
              <li>You must delete all copies of the Software in your possession</li>
              <li>Sections 3 (Restrictions), 4 (Ownership), 6 (Disclaimers), 7 (Limitation of Liability), and 9 (Governing Law) shall survive termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">9. Updates and Modifications</h2>
            <p className="mb-3">We may from time to time release updated versions of the Software. By installing updates, you agree to the EULA terms in effect at the time of the update.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Updates may be automatically downloaded and installed</li>
              <li>You may choose to disable automatic updates, but doing so may affect functionality or security</li>
              <li>We are not obligated to provide updates, bug fixes, or enhancements for any particular version</li>
              <li>We reserve the right to discontinue the Software or any feature at any time with reasonable notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">10. Third-Party Components</h2>
            <p>The Software includes third-party open source components, each governed by their respective licenses. A list of these components and their licenses is included in the Software's about screen and in the repository's LICENSES file.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">11. Governing Law</h2>
            <p>This EULA is governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Ottawa, Ontario, Canada.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">12. Severability</h2>
            <p>If any provision of this EULA is held to be unenforceable, the remaining provisions will remain in full force and effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">13. Entire Agreement</h2>
            <p>This EULA, together with the <Link to="/terms" className="text-[var(--cyan)]">Terms of Service</Link> and <Link to="/privacy" className="text-[var(--cyan)]">Privacy Policy</Link>, constitutes the entire agreement between you and Greyrock Studio regarding the Software.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">14. Contact</h2>
            <p>For questions about this EULA, contact us at <a href="mailto:legal@heylodestone.com" className="text-[var(--cyan)]">legal@heylodestone.com</a>.</p>
          </section>

          <section className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm">Greyrock Studio · Ottawa, Ontario, Canada</p>
          </section>
        </div>

        <div className="mt-12 flex gap-6 justify-center text-sm">
          <Link to="/terms" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline transition-colors">Privacy Policy</Link>
          <Link to="/" className="text-[var(--text-muted)] hover:text-[var(--text)] no-underline transition-colors">← Home</Link>
        </div>
      </div>
    </div>
  )
}
