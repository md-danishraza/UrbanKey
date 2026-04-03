import Link from 'next/link';
import { 
  HelpCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  User, 
  CreditCard,
  Brain,
  MessageCircle,
  FileSignature

} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <HelpCircle className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about UrbanKey, from finding your next home to listing your property.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1: General Questions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">General Questions</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is UrbanKey?</h3>
                <p className="text-gray-600 leading-relaxed">
                  UrbanKey is India's premier broker-free rental platform connecting verified tenants directly with verified landlords. 
                  We leverage AI technology to simplify property search, document verification, and rent agreement generation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is UrbanKey really broker-free?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! UrbanKey is designed to connect tenants directly with landlords. There are absolutely no brokerage fees 
                  charged by our platform. You pay only the rent and security deposit agreed upon with the landlord.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Why do I need to complete KYC verification?</h3>
                <p className="text-gray-600 leading-relaxed">
                  To ensure the safety and security of all our users, we require mandatory Aadhar verification. This builds a 
                  trustworthy ecosystem and prevents fraud on both sides of the rental process. Landlords also verify their 
                  property documents for authenticity.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Which cities does UrbanKey operate in?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Currently, UrbanKey operates in Bangalore, Delhi, Mumbai, Pune, Hyderabad, and Chennai. We're expanding to 
                  more cities soon!
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: AI-Powered Features */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">AI-Powered Features</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the AI semantic search work?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our platform uses advanced AI (RAG - Retrieval Augmented Generation) to understand natural language. Instead of 
                  clicking through endless filters, you can simply type "Show me 2BHK apartments near metro station under ₹25,000 
                  with power backup" and get precise, relevant matches.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the AI chatbot and how can I use it?</h3>
                <p className="text-gray-600 leading-relaxed">
                  The UrbanKey AI Assistant is available 24/7 on our platform (visible after login). You can ask it anything 
                  about properties, get recommendations, or learn about our features. It's powered by Google Gemini and understands 
                  your property database.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate are the AI-generated property tags?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI automatically calculates metro distances, detects amenities, and suggests property features. While we 
                  strive for accuracy, we recommend verifying critical information directly with the landlord.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: For Tenants */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <User className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">For Tenants</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I find and apply for a property?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use our AI-powered search to find properties that match your preferences. Once you find a property you love, 
                  you can send an enquiry, schedule a visit, or save it to your wishlist. The landlord will review your verified 
                  profile and respond accordingly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the wishlist feature?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can save properties you're interested in to your wishlist by clicking the heart icon on any property card. 
                  This helps you keep track of properties you like and compare them later.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I schedule a property visit?</h3>
                <p className="text-gray-600 leading-relaxed">
                  On any property page, click the "Schedule Visit" button. Choose your preferred date and time, add any notes, 
                  and send the request. The landlord will receive your request and confirm the visit.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I chat with landlords directly?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! Each property page has a WhatsApp button that opens a direct chat with the landlord. This is the fastest 
                  way to get your questions answered. You can also send formal enquiries through the platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the rent agreement work?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once your application is approved, the landlord will create a digital rent agreement. You'll receive it for 
                  review and e-signature. After both parties sign, the agreement becomes legally binding, and you can proceed 
                  with the security deposit and first month's rent.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: For Landlords */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">For Landlords</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I list my property?</h3>
                <p className="text-gray-600 leading-relaxed">
                  After completing your landlord verification, go to your dashboard and click "List New Property." Fill in the 
                  property details including photos, rent, amenities, and location. Our AI will automatically calculate metro 
                  distance and suggest tags. Once submitted, your property will be visible to tenants.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much does it cost to list a property?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Listing your property on UrbanKey is completely free! There are no upfront fees, no hidden charges, and no 
                  brokerage commissions. You pay nothing to list—only the rent you receive from tenants.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I manage tenant enquiries and leads?</h3>
                <p className="text-gray-600 leading-relaxed">
                  All enquiries appear in your landlord dashboard under "Leads." You can view each lead's verified profile, 
                  message, and contact preference. You can update lead status (New/Contacted/Converted/Closed) to track your 
                  pipeline effectively.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I approve tenant applications?</h3>
                <p className="text-gray-600 leading-relaxed">
                  When a tenant applies for your property, you'll receive a notification. Review their verified profile and 
                  rental history in the Leads section. If satisfied, you can mark the lead as "Converted" and proceed to create 
                  a rental agreement.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the rent agreement generation work?</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you're ready to finalize with a tenant, click "Create Agreement" from the lead. Fill in the start date, 
                  end date, monthly rent, and security deposit. The system generates a professional PDF agreement that both 
                  parties can sign digitally.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I track rent payments?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! Once an agreement is active, you can view all rent payments in the agreement details page. Tenants record 
                  their payments, and you can mark them as received. You'll also see payment history and upcoming dues.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Payments & Transactions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Payments & Transactions</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How are rent payments processed?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tenants can record their rent payments through the platform. The landlord then marks the payment as received. 
                  While UrbanKey doesn't process payments directly, we provide tracking and receipt generation for your records.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is the security deposit handled through UrbanKey?</h3>
                <p className="text-gray-600 leading-relaxed">
                  The security deposit amount is specified in the rental agreement. UrbanKey tracks the deposit as part of the 
                  agreement but doesn't hold or process the funds. The deposit is handled directly between tenant and landlord.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are there any transaction fees?</h3>
                <p className="text-gray-600 leading-relaxed">
                  UrbanKey does not charge any transaction fees. The platform is completely free for both tenants and landlords. 
                  You only pay the agreed rent and deposit directly to the landlord.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Verification & Security */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Verification & Security</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What documents do I need for verification?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tenants need to upload a clear image of their Aadhar card. Landlords need to upload Aadhar card and property 
                  ownership documents (like sale deed or property tax receipt). All documents are encrypted and stored securely.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does verification take?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Document verification typically takes 24-48 hours. Our admin team reviews submissions during business hours. 
                  You'll receive an email notification once verification is complete.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! We use industry-standard encryption for all sensitive data. Documents are stored securely, and we never 
                  share your personal information without consent. Our platform follows data protection best practices.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Rent Agreements */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FileSignature className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Rent Agreements</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are UrbanKey rent agreements legally valid?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! Our rent agreements are generated using legally compliant templates that adhere to Indian rental laws. 
                  When both parties sign digitally, the agreement becomes a legally binding document.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize the agreement terms?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. Landlords can add special conditions and customize terms before sending the agreement to tenants. 
                  You can also modify the standard terms as needed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens after both parties sign?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once both parties sign, the agreement becomes active. The property is marked as occupied, and payment tracking 
                  begins. Both parties can download the signed PDF anytime from their dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Support & Contact */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <MessageCircle className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Support & Contact</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I contact support?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can reach us at <a href="mailto:support@urbankey.com" className="text-rose-600 hover:underline">support@urbankey.com</a>. 
                  Our support team is available Monday to Friday, 9 AM to 6 PM IST. We typically respond within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I face technical issues?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use the AI chatbot (visible after login) for instant help, or email our support team. We're committed to 
                  resolving issues as quickly as possible.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
          <Link 
            href="/contact"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}