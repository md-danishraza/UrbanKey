import Link from 'next/link';
import { 
  Shield, 
  ArrowLeft, 
 
  Database, 
  Lock, 
  Users,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Server,
  Cookie,
  
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PrivacyPolicyPage() {
  const lastUpdated = "April, 2026";
  const effectiveDate = "April 1, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <Shield className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your privacy matters to us. Learn how UrbanKey collects, uses, and protects your personal information.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-500">
          <span>Last Updated: {lastUpdated}</span>
          <span>•</span>
          <span>Effective: {effectiveDate}</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Shield className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our platform, website, and services. 
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the platform.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Database className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We collect information that you provide directly to us, information automatically collected when you use our platform, 
              and information from third-party sources.
            </p>
            
            <div className="space-y-3 mt-4">
              <h3 className="font-semibold text-gray-800">Personal Information You Provide:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Name, email address, phone number, and physical address</li>
                <li>Government ID documents (Aadhar card) for verification</li>
                <li>Property ownership documents (for landlords)</li>
                <li>Payment information and transaction history</li>
                <li>Communication preferences and chat history</li>
                <li>Profile information and preferences</li>
              </ul>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="font-semibold text-gray-800">Information Automatically Collected:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, search queries)</li>
                <li>Location data (with your consent)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data and analytics information</li>
              </ul>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Users className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">How We Use Your Information</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Creating and managing your account</li>
              <li>Verifying your identity and documents</li>
              <li>Facilitating property listings and rental agreements</li>
              <li>Processing payments and transactions</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Improving our platform and developing new features</li>
              <li>Sending important notifications and updates</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Preventing fraud and ensuring platform security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Section 4: Legal Basis for Processing */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FileText className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Legal Basis for Processing</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We process your personal information under the following legal bases:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li><strong>Contractual Necessity:</strong> To perform our contract with you and provide our services</li>
              <li><strong>Legitimate Interests:</strong> To improve our platform, prevent fraud, and ensure security</li>
              <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Consent:</strong> For marketing communications and optional data collection</li>
            </ul>
          </section>

          {/* Section 5: Data Sharing and Disclosure */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Globe className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Data Sharing and Disclosure</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li><strong>With Other Users:</strong> As necessary to facilitate rentals (e.g., sharing tenant info with landlords)</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist with our operations</li>
              <li><strong>Legal Requirements:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-3">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> We do not sell your personal information to third parties for their marketing purposes.
              </p>
            </div>
          </section>

          {/* Section 6: Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Lock className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Data Security</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Encryption of data in transit (TLS/SSL) and at rest (AES-256)</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and vulnerability scanning</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, 
              we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Section 7: Data Retention */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Server className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Data Retention</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              unless a longer retention period is required or permitted by law. Specifically:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Account information: Retained until you delete your account</li>
              <li>Transaction records: Retained for 7 years for legal compliance</li>
              <li>Chat logs: Retained for 2 years</li>
              <li>Analytics data: Retained for 26 months</li>
            </ul>
          </section>

          {/* Section 8: Your Rights and Choices */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <CheckCircle className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Rights and Choices</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Restriction:</strong> Limit how we use your information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-3">
              <p className="text-sm text-gray-600">
                To exercise these rights, please contact us at <a href="mailto:privacy@urbankey.com" className="text-rose-600 hover:underline">privacy@urbankey.com</a>. 
                We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Section 9: Cookies and Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Cookie className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cookies and Tracking Technologies</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Remember your preferences and login status</li>
              <li>Analyze how you use our platform</li>
              <li>Personalize your experience</li>
              <li>Improve our services and marketing</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              You can control cookies through your browser settings. However, disabling cookies may affect certain features 
              of our platform. For more information, please see our <Link href="/cookies" className="text-rose-600 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Section 10: Children's Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Users className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Children's Privacy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information 
              from children under 18. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Section 11: Third-Party Links */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Globe className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Third-Party Links</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices or 
              content of these third-party sites. We encourage you to review their privacy policies before providing any 
              personal information.
            </p>
          </section>

          {/* Section 12: International Data Transfers */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Globe className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">International Data Transfers</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We take appropriate 
              safeguards to ensure your data remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Section 13: Changes to This Privacy Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <AlertCircle className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Changes to This Privacy Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Posting the new policy on this page</li>
              <li>Sending an email notification</li>
              <li>Displaying a prominent notice on our platform</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              The "Last Updated" date at the top of this page indicates when this policy was last revised. Your continued 
              use of the platform after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 14: Contact Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Mail className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Information</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p>📧 <strong>Email:</strong> <a href="mailto:privacy@urbankey.com" className="text-rose-600 hover:underline">privacy@urbankey.com</a></p>
              <p>📍 <strong>Address:</strong> Bangalore, Karnataka, India</p>
              <p>📞 <strong>Phone:</strong> +91 98765 43210 (Mon-Fri, 9 AM - 6 PM IST)</p>
              <p>👤 <strong>Data Protection Officer:</strong> <a href="mailto:dpo@urbankey.com" className="text-rose-600 hover:underline">dpo@urbankey.com</a></p>
            </div>
          </section>

          {/* Section 15: Grievance Redressal */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Shield className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Grievance Redressal</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              In accordance with applicable laws, we have appointed a Grievance Officer to address any concerns or complaints:
            </p>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p><strong>Grievance Officer:</strong> [Name]</p>
              <p>📧 <strong>Email:</strong> <a href="mailto:grievance@urbankey.com" className="text-rose-600 hover:underline">grievance@urbankey.com</a></p>
              <p>⏰ <strong>Response Time:</strong> We will acknowledge your complaint within 24 hours and resolve it within 30 days.</p>
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
            href="/terms"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/cookies"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
              "border border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}