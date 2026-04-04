import Link from 'next/link';
import { 
  Cookie, 
  ArrowLeft, 
  Shield, 
  Eye, 
  Settings, 
  Target, 
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CookiesPolicyPage() {
  const lastUpdated = "April, 2026";

  const cookieTypes = [
    {
      name: "Essential Cookies",
      icon: Shield,
      description: "These cookies are necessary for the website to function and cannot be switched off.",
      examples: ["Authentication", "Session management", "Security", "Load balancing"],
      duration: "Session / Persistent",
    },
    {
      name: "Functional Cookies",
      icon: Settings,
      description: "These cookies enable enhanced functionality and personalization.",
      examples: ["Language preferences", "Location settings", "Saved filters", "Wishlist"],
      duration: "1 year",
    },
    {
      name: "Analytics Cookies",
      icon: Eye,
      description: "These cookies help us understand how visitors interact with our website.",
      examples: ["Page views", "User behavior", "Search patterns", "Conversion tracking"],
      duration: "2 years",
    },
    {
      name: "Marketing Cookies",
      icon: Target,
      description: "These cookies track browsing habits to deliver targeted advertisements.",
      examples: ["Ad preferences", "Campaign effectiveness", "Retargeting", "Social media integration"],
      duration: "1 year",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <Cookie className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Cookies <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Learn how UrbanKey uses cookies to enhance your browsing experience and provide personalized services.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 space-y-12">
          
          {/* Section 1: What are Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Cookie className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">What are Cookies?</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently, as well as to provide information to the 
              owners of the site. Cookies help us provide you with a better experience by remembering your preferences 
              and understanding how you use our platform.
            </p>
          </section>

          {/* Section 2: How We Use Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Database className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">How UrbanKey Uses Cookies</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              UrbanKey uses cookies for various purposes to improve your experience on our platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>To remember your login status and keep you authenticated</li>
              <li>To save your preferences and settings (language, location, filters)</li>
              <li>To analyze how you use our platform and improve our services</li>
              <li>To personalize property recommendations based on your interests</li>
              <li>To prevent fraud and enhance platform security</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          {/* Section 3: Types of Cookies */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Settings className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Types of Cookies We Use</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => {
                const Icon = cookie.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{cookie.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{cookie.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Examples:</span> {cookie.examples.join(", ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Duration:</span> {cookie.duration}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Third-Party Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Target className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Third-Party Cookies</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We also use cookies from trusted third-party partners to enhance our services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong className="text-gray-800">Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong className="text-gray-800">Mapbox:</strong> For location-based services and property mapping</li>
              <li><strong className="text-gray-800">Clerk:</strong> For authentication and user management</li>
              <li><strong className="text-gray-800">WhatsApp:</strong> For communication features</li>
              <li><strong className="text-gray-800">Payment Gateways:</strong> For secure payment processing</li>
            </ul>
          </section>

          {/* Section 5: Managing Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Settings className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Managing Your Cookie Preferences</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              You can control and manage cookies in various ways. Please note that removing or blocking cookies may 
              impact your user experience and some features may no longer be available.
            </p>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">How to Manage Cookies:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings. You can set your browser to block or delete cookies.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Cookie Banner:</strong> You can manage non-essential cookie preferences through our cookie consent banner.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Opt-Out Tools:</strong> You can opt out of Google Analytics tracking using their <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">browser add-on</a>.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Cookie Duration */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <Database className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cookie Duration</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our cookies have varying lifespans:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong className="text-gray-800">Session Cookies:</strong> These are temporary and expire when you close your browser.</li>
              <li><strong className="text-gray-800">Persistent Cookies:</strong> These remain on your device until they expire or you delete them.</li>
              <li><strong className="text-gray-800">First-Party Cookies:</strong> Set by UrbanKey and typically last up to 1-2 years.</li>
              <li><strong className="text-gray-800">Third-Party Cookies:</strong> Duration varies based on the third party's policy.</li>
            </ul>
          </section>

          {/* Section 7: Updates to This Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <AlertCircle className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Updates to This Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookies Policy from time to time to reflect changes in our practices or for legal reasons. 
              We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We encourage you to review this page periodically to stay informed about how we use cookies.
            </p>
          </section>

          {/* Section 8: Contact Us */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our use of cookies or this policy, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>📧 <a href="mailto:privacy@urbankey.com" className="text-rose-600 hover:underline">privacy@urbankey.com</a></li>
              <li>📍 New Delhi, India</li>
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