import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Scale, 
  FileText, 
  UserCheck,
  Brain,
  MessageCircle,
  FileSignature,
  Landmark,

  Bell,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TermsAndConditions() {
  const lastUpdated = "April, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white  relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 ">
          <Scale className="w-8 h-8 text-rose-600 " />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Terms & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Conditions</span>
        </h1>
        <p className="text-gray-600  text-lg max-w-2xl mx-auto">
          Welcome to UrbanKey! Please read these terms carefully before using our platform. 
          By accessing or using our services, you agree to be bound by these terms.
        </p>
        <p className="text-sm text-gray-400  mt-4">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white  backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <FileText className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              By registering for, accessing, or using UrbanKey ("Platform"), you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and Conditions. UrbanKey is a rental property platform 
              connecting tenants with verified landlords across India. If you do not agree with any part of these terms, 
              you must refrain from using our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <UserCheck className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">2. User Roles & Verification</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey operates a broker-free ecosystem with two primary user roles:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li><strong className="text-gray-900 ">Tenants:</strong> Users seeking to rent properties.</li>
              <li><strong className="text-gray-900 ">Landlords (Property Managers):</strong> Users listing properties for rent.</li>
              <li><strong className="text-gray-900 ">Admin:</strong> Platform administrators responsible for user verification and content moderation.</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              To ensure platform security, all users must complete mandatory Aadhar verification. Landlords must also 
              provide property ownership documents. UrbanKey reserves the right to suspend or terminate accounts that 
              fail verification or violate platform policies.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <Brain className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">3. AI-Powered Features</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey utilizes advanced AI technologies including:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li><strong className="text-gray-900 ">Semantic Search:</strong> AI-powered property search using natural language understanding.</li>
              <li><strong className="text-gray-900 ">Smart Recommendations:</strong> Personalized property suggestions based on user preferences.</li>
              <li><strong className="text-gray-900 ">RAG Chatbot:</strong> Intelligent assistant for property-related queries.</li>
              <li><strong className="text-gray-900 ">Auto-tagging:</strong> Automatic property feature extraction (metro distance, amenities, etc.).</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              While we strive for accuracy, AI-generated content may contain errors. Users should verify critical information independently.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <FileSignature className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">4. Rent Agreements & Documents</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey provides automated rent agreement generation using standard templates. These agreements are legally valid 
              under Indian law when signed by both parties. Key features include:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Auto-generated PDF agreements with e-signature support</li>
              <li>Digital document storage and retrieval</li>
              <li>Agreement tracking and status monitoring</li>
              <li>Customizable terms and conditions</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              Users are responsible for reviewing all terms before signing. UrbanKey is not a party to rental agreements.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <MessageCircle className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">5. Communication & WhatsApp Integration</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey facilitates direct communication between tenants and landlords through:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li><strong className="text-gray-900 ">WhatsApp Integration:</strong> Direct chat with property owners via WhatsApp.</li>
              <li><strong className="text-gray-900 ">In-app Enquiries:</strong> Send and receive property inquiries.</li>
              <li><strong className="text-gray-900 ">Visit Scheduling:</strong> Book and manage property tours.</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              Users are responsible for their communication conduct. Harassment, spam, or inappropriate behavior may result in account suspension.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <Landmark className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">6. Payments & Security</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey facilitates secure payment tracking for rent and security deposits:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Rent payment history and tracking</li>
              <li>Security deposit management</li>
              <li>Digital receipt generation</li>
              <li>Payment reminders and notifications</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              UrbanKey does not store payment card details. All transactions are processed through secure payment gateways. 
              Users are responsible for maintaining account security and should report any suspicious activity immediately.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <ShieldCheck className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">7. Property Listings & Accuracy</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              Landlords are solely responsible for the accuracy, legality, and truthfulness of their property listings. 
              UrbanKey provides AI-driven features including:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Distance to metro station calculation</li>
              <li>Amenity tagging (24/7 water, power backup, IGL pipeline)</li>
              <li>Property verification badges</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              Landlords must not post misleading information, discriminatory constraints, or fraudulent listings. 
              Violations may result in account termination.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <Bell className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">8. User Conduct & Prohibited Activities</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Post fake or non-existent properties</li>
              <li>Discriminate based on religion, caste, gender, or other protected characteristics</li>
              <li>Charge brokerage fees (UrbanKey is a broker-free platform)</li>
              <li>Share contact information of other users without consent</li>
              <li>Use automated bots or scrapers on the platform</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <Lock className="w-6 h-6 text-rose-600 " />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">9. Privacy & Data Protection</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey collects and processes user data in accordance with our Privacy Policy. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Personal information (name, email, phone number)</li>
              <li>Verification documents (Aadhar card, property documents)</li>
              <li>Usage data and preferences</li>
              <li>Communication history</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              We implement industry-standard security measures to protect user data. However, no online platform is completely secure, 
              and users should exercise caution when sharing sensitive information.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">10. Limitation of Liability</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey is not a real estate broker, agent, or property manager. We are not a party to any rental agreement 
              signed between Landlords and Tenants. Under no circumstances shall UrbanKey be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Disputes between tenants and landlords</li>
              <li>Property damages or maintenance issues</li>
              <li>Payment discrepancies or defaults</li>
              <li>Inaccurate property listings</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">11. Termination & Suspension</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey reserves the right to suspend or terminate user accounts for:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Violation of these terms and conditions</li>
              <li>Fraudulent or deceptive practices</li>
              <li>Harassment or inappropriate behavior</li>
              <li>Failure to complete KYC verification</li>
              <li>Inactivity for extended periods (12+ months)</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              Users may delete their accounts at any time through account settings. Certain data may be retained for legal compliance.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">12. Modifications to Terms</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              UrbanKey reserves the right to modify these terms at any time. Users will be notified of significant changes via:
            </p>
            <ul className="list-disc list-inside text-gray-600  space-y-2 ml-4">
              <li>Email notification</li>
              <li>In-app announcements</li>
              <li>Website notice</li>
            </ul>
            <p className="text-gray-600  leading-relaxed mt-2">
              Continued use of the platform after changes constitutes acceptance of modified terms.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">13. Governing Law</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200  pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">14. Contact Information</h2>
            </div>
            <p className="text-gray-600  leading-relaxed">
              For questions, concerns, or legal notices, please contact us:
            </p>
            <ul className="list-none text-gray-600  space-y-2 ml-0">
              <li>📧 Email: <a href="mailto:support@urbankey.com" className="text-rose-600 hover:underline">support@urbankey.com</a></li>
              <li>📍 Address: New Delhi, India, India</li>
              <li>📞 Support: Available 9 AM - 6 PM IST, Monday to Friday</li>
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
            href="/privacy"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300  text-gray-700  hover:bg-gray-100 "
            )}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}