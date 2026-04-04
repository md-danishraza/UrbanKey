import Link from 'next/link';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Shield, 
  Scale, 
  FileText, 
 
  Building2,
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DisclaimerPage() {
  const lastUpdated = "April, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Disclaimer
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Please read this disclaimer carefully before using the UrbanKey platform.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1: General Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">General Information</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The information provided on UrbanKey (the "Platform") is for general informational purposes only. 
              While we strive to keep the information up to date and correct, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability 
              of the information, products, services, or related graphics contained on the Platform.
            </p>
          </section>

          {/* Section 2: No Brokerage Disclaimer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Building2 className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">No Brokerage Platform</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey is a technology platform that connects tenants directly with landlords. We are NOT a real estate 
              broker, agent, or property manager. We do not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Charge any brokerage fees or commissions</li>
              <li>Act as an intermediary in rental negotiations</li>
              <li>Take possession of any property</li>
              <li>Provide legal advice or representation</li>
              <li>Guarantee rental income or property occupancy</li>
            </ul>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-3">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> All rental agreements are directly between tenants and landlords. 
                UrbanKey is not a party to any rental transaction.
              </p>
            </div>
          </section>

          {/* Section 3: Property Listings Disclaimer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Property Listings</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Property listings on UrbanKey are submitted by landlords and property managers. While we implement 
              verification processes, we do not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Guarantee the accuracy of property descriptions, photos, or amenities</li>
              <li>Verify property ownership beyond document submission</li>
              <li>Inspect properties physically</li>
              <li>Ensure pricing accuracy or availability</li>
              <li>Validate zoning compliance or legal status</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              <strong>Recommendation:</strong> We strongly recommend that tenants physically inspect properties 
              and verify all details before signing any agreement or making payments.
            </p>
          </section>

          {/* Section 4: AI-Generated Content */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">AI-Generated Content</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey uses artificial intelligence (AI) to enhance user experience, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Semantic search and property recommendations</li>
              <li>Chatbot responses and property insights</li>
              <li>Automated tag generation (e.g., metro distance, amenities)</li>
              <li>Personalized property suggestions</li>
            </ul>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> AI-generated content may contain errors or inaccuracies. Users should 
                independently verify all critical information before making decisions.
              </p>
            </div>
          </section>

          {/* Section 5: Verification Disclaimer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Verification</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey implements verification processes for user identities and documents. However:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Verification does not guarantee a user's character, reliability, or intent</li>
              <li>We do not perform background checks beyond document verification</li>
              <li>Verified status only confirms identity, not trustworthiness</li>
              <li>Users should exercise due diligence when interacting with other users</li>
            </ul>
          </section>

          {/* Section 6: Financial Transactions */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <CreditCard className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Financial Transactions</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey facilitates payment tracking but does not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Hold or process payments directly</li>
              <li>Guarantee payment completion or refunds</li>
              <li>Provide financial advice</li>
              <li>Assume liability for payment disputes</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              All financial transactions are between tenants and landlords. Users are advised to use secure 
              payment methods and maintain proper documentation.
            </p>
          </section>

          {/* Section 7: Legal Disclaimer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Scale className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Legal Disclaimer</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey does not provide legal advice. Our rent agreement templates are for informational purposes 
              only and may not be suitable for your specific situation. We recommend that users:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Consult with a qualified legal professional before signing agreements</li>
              <li>Review all terms and conditions carefully</li>
              <li>Ensure compliance with local rental laws and regulations</li>
              <li>Seek legal counsel for complex rental situations</li>
            </ul>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To the fullest extent permitted by law, UrbanKey and its affiliates, officers, directors, employees, 
              and agents shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, or goodwill</li>
              <li>Property disputes between tenants and landlords</li>
              <li>Payment defaults or financial losses</li>
              <li>Physical damages to properties during tenancy</li>
              <li>Inaccuracies in property listings or AI-generated content</li>
              <li>Third-party services integrated with our platform</li>
            </ul>
          </section>

          {/* Section 9: External Links */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">External Links</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our Platform may contain links to external websites that are not operated by us. We have no control 
              over the content, privacy policies, or practices of any third-party sites. We do not endorse or assume 
              responsibility for the accuracy or reliability of any information offered by third-party websites.
            </p>
          </section>

          {/* Section 10: Force Majeure */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Force Majeure</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey shall not be liable for any failure or delay in performance due to causes beyond our reasonable 
              control, including but not limited to natural disasters, pandemics, government actions, internet outages, 
              cyber attacks, or technical failures.
            </p>
          </section>

          {/* Section 11: No Warranties */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">No Warranties</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey provides the platform on an "as is" and "as available" basis without any warranties of any kind, 
              either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>The platform will be uninterrupted, timely, secure, or error-free</li>
              <li>Results obtained from the platform will be accurate or reliable</li>
              <li>Any errors in the platform will be corrected</li>
              <li>The platform will be compatible with all devices or browsers</li>
            </ul>
          </section>

          {/* Section 12: Acknowledgment */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <CheckCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Acknowledgment</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              By using UrbanKey, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. 
              If you do not agree with any part of this disclaimer, you must not use our platform.
            </p>
          </section>

          {/* Section 13: Contact Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>📧 <a href="mailto:legal@urbankey.com" className="text-rose-600 hover:underline">legal@urbankey.com</a></li>
              <li>📍 Bangalore, Karnataka, India</li>
              <li>📞 +91 98765 43210 (Mon-Fri, 9 AM - 6 PM IST)</li>
            </ul>
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
            href="/terms"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/privacy"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}