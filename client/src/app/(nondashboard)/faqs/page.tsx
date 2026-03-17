import Link from 'next/link';
import { HelpCircle, ArrowLeft, ShieldCheck, Building2, User, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-rose-500/10 to-background pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20">
          <HelpCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Frequently Asked <span className="text-rose-500">Questions</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about UrbanKey, from finding your next home to listing your property.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-card text-card-foreground border border-border shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1: General */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">General Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Is UrbanKey really broker-free?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! UrbanKey is designed to connect verified tenants directly with verified landlords. There are absolutely no brokerage fees charged by our platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Why do I need to complete KYC verification?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To ensure the safety and security of all our users, we require mandatory identity verification (like Aadhar). This builds a trustworthy ecosystem and prevents fraud on both sides of the rental process.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Tenants */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <User className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">For Tenants</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">How do I apply for a property?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Once you find a home you love using our AI-driven search, simply click "Apply for Rent" on the listing. The landlord will review your verified profile. If approved, you can proceed to sign the agreement and pay rent.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">How does the AI search work?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform uses advanced AI to understand natural language. Instead of clicking through endless filters, you can simply type "Show me 2BHK apartments near the metro station under 25k" and get precise matches.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Landlords */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <Building2 className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">For Landlords</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">How much does it cost to list a property?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Listing your property on UrbanKey is completely free. We focus on providing you with high-quality, KYC-verified leads without any upfront listing fees.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">How do I screen potential tenants?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When a tenant applies, you will receive their application in your Dashboard. You can review their verified credentials, professional background, and rental history before choosing to "Approve" or "Reject" their request.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Payments */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <CreditCard className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">Payments & Transactions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">How are rent payments processed?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All transactions are handled securely through our integrated payment gateway (Cashfree). Tenants can only make a payment once you (the landlord) have officially approved their rental application.
                </p>
              </div>
            </div>
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