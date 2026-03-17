import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Scale, FileText, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TermsAndConditions() {
  const lastUpdated = "March, 2026";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-rose-500/10 to-background pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20">
          <Scale className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Terms & <span className="text-rose-500">Conditions</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Please read these terms carefully before using the UrbanKey platform. 
          By accessing or using our services, you agree to be bound by these terms.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-4">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-card text-card-foreground border border-border shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <FileText className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">1. Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By registering for, accessing, or using UrbanKey ("Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must prohibit from using our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <UserCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">2. User Roles & KYC Verification</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              UrbanKey operates a broker-free ecosystem with distinct user roles:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Tenants:</strong> Users seeking to rent properties.</li>
              <li><strong className="text-foreground">Landlords (Managers):</strong> Users listing properties for rent.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              To ensure platform security, all users must complete a mandatory Know Your Customer (KYC) verification process. This includes the submission of valid government-issued identity documents (e.g., Aadhar Card). UrbanKey reserves the right to suspend or terminate accounts that fail to pass the Super Admin verification protocol.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">3. Property Listings & Accuracy</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Landlords are solely responsible for the accuracy, legality, and truthfulness of their property listings. 
              UrbanKey utilizes AI-driven discovery and automated tagging (e.g., "Distance to Metro"), but does not guarantee the absolute accuracy of these dynamically generated metrics. Landlords must not post misleading photos, discriminatory constraints, or fraudulent pricing.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <h2 className="text-2xl font-bold tracking-tight">4. Applications and Rent Payments</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The rental application process is a direct agreement between the Tenant and the Landlord. UrbanKey acts solely as a technological facilitator.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Tenants may only proceed with rent payments upon explicit application approval by the Landlord.</li>
              <li>Payments are processed securely via our integrated gateway (Cashfree).</li>
              <li>UrbanKey does not charge brokerage fees. Any transaction fees incurred are strictly for payment gateway processing and platform maintenance.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <h2 className="text-2xl font-bold tracking-tight">5. Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              UrbanKey is not a real estate broker, agent, or property manager. We are not a party to any rental agreement signed between Landlords and Tenants. Under no circumstances shall UrbanKey be liable for any direct, indirect, incidental, or consequential damages arising from property disputes, payment discrepancies, or physical damages to the listed properties.
            </p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/"
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}