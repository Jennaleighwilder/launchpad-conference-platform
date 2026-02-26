export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>Privacy Policy</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)' }}>Last updated: February 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Data We Collect</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We collect information you provide when creating events, registering, or contacting us: name, email, event details, and payment information when you purchase tickets. We also collect usage data such as IP address, browser type, and pages visited.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Data</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We use your data to provide our services, process payments, send event confirmations, improve our product, and communicate with you about updates. We do not sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Data is stored on secure servers with encryption at rest and in transit. We use industry-standard practices to protect your information from unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We use Stripe for payments, Supabase for database storage, and Vercel for hosting. These providers have their own privacy policies. We may also use analytics tools to understand product usage.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We use essential cookies for session management and preferences. We may use analytics cookies to improve our service. You can control cookies through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications. Contact us at privacy@launchpad.events to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We retain your data for as long as your account is active or as needed to provide services. Event data may be retained for legal and accounting purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Children&apos;s Privacy</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Our service is not intended for users under 16. We do not knowingly collect data from children.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>We may update this policy from time to time. We will notify you of material changes via email or a notice on our site.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Questions? Contact us at privacy@launchpad.events or through our <a href="/contact" className="underline" style={{ color: 'var(--color-accent)' }}>contact page</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
