import { SignUp } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import styles from '../../Auth.module.css';

export default function LandlordRegisterPage() {
  return (
    <div className={cn(
      styles.authContainer, 
      "flex items-center justify-center p-4 min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50/50 to-pink-50/50"
    )}>
      
      {/* Decorative Background Shapes - Matching theme but with landlord colors */}
      <div className={cn(styles.floatingShape, styles.shape1, "pointer-events-none absolute bg-purple-200/20")} />
      <div className={cn(styles.floatingShape, styles.shape2, "pointer-events-none absolute bg-pink-200/20")} />
      <div className={cn(styles.floatingShape, styles.shape3, "pointer-events-none absolute bg-indigo-200/20")} />

      {/* Simple header text for context */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-0">
        <p className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          🏠 Join as a Landlord • List your properties
        </p>
      </div>

      {/* Clerk's Pre-built Sign Up Component */}
      <div className="relative z-10 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <SignUp 
          routing="hash"
          signInUrl="/auth/login"
          fallbackRedirectUrl="/onboarding/landlord"
          
          // Custom appearance to match your theme
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "border-0 bg-white/95 backdrop-blur-sm shadow-xl",
              headerTitle: "text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-2 hover:border-purple-300 hover:bg-purple-50 transition-all",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldInput: "border-2 focus:border-purple-400 focus:ring-purple-400 transition-all",
              formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 transition-all transform hover:scale-[1.02]",
              footerActionLink: "text-purple-600 hover:text-purple-700 font-medium",
              alert: "bg-red-50 border-red-200 text-red-700",
              alertText: "text-sm",
            }
          }}
        />
      </div>

      {/* Additional info for landlords */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-0">
        <p className="text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
          Already listing elsewhere? <span className="text-purple-600 font-medium">Import your properties</span>
        </p>
      </div>

    </div>
  );
}