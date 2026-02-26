export default function TermsPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>Terms of Service</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)' }}>Last updated: February 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>By using Launchpad, you agree to these terms. If you do not agree, do not use our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Launchpad provides AI-powered conference generation, event pages, ticketing, and related tools. We reserve the right to modify or discontinue features at any time.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Accounts</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>You are responsible for maintaining the confidentiality of your account. You must provide accurate information and notify us of any unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Content</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>You retain ownership of content you create. By using our service, you grant us a license to use, display, and process your content to provide the service. You must not upload content that infringes others&apos; rights or violates laws.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>You agree not to use Launchpad for illegal activities, spam, fraud, or to harm others. We may suspend or terminate accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Payments</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Paid plans are billed according to the pricing on our website. Refunds are handled per our refund policy. You are responsible for any taxes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Launchpad and its branding are our property. You may not copy, modify, or create derivative works without our permission.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We provide the service &quot;as is.&quot; We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid us in the past 12 months.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>You may cancel your account at any time. We may terminate or suspend access for violations of these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Changes</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We may update these terms. Continued use after changes constitutes acceptance. We will notify you of material changes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>These terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Questions? Contact us at legal@launchpad.events or through our <a href="/contact" className="underline" style={{ color: 'var(--color-accent)' }}>contact page</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
