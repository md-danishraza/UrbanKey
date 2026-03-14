import { SignUp } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import styles from '../../Auth.module.css';

export default function TenantRegisterPage() {
  return (
    <div className={cn(
      styles.authContainer, 
      "flex items-center justify-center p-4 min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-cyan-50/50"
    )}>
      
      {/* Decorative Background Shapes */}
      <div className={cn(styles.floatingShape, styles.shape1, "pointer-events-none absolute bg-blue-200/20")} />
      <div className={cn(styles.floatingShape, styles.shape2, "pointer-events-none absolute bg-cyan-200/20")} />
      <div className={cn(styles.floatingShape, styles.shape3, "pointer-events-none absolute bg-sky-200/20")} />

      {/* Simple header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-0">
        <p className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          🏠 Join as a Tenant • Find your perfect home
        </p>
      </div>

      {/* Clerk's Pre-built Sign Up Component */}
      <div className="relative z-10 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <SignUp 
          routing="hash"
          signInUrl="/auth/login"
          fallbackRedirectUrl="/onboarding/tenant"
          
          // Custom appearance to match your theme
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "border-0 bg-white/95 backdrop-blur-sm shadow-xl",
              headerTitle: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-2 hover:border-blue-300 hover:bg-blue-50 transition-all",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldInput: "border-2 focus:border-blue-400 focus:ring-blue-400 transition-all",
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 transition-all transform hover:scale-[1.02]",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
              footer: "bg-gray-50/50",
              alert: "bg-red-50 border-red-200 text-red-700",
              alertText: "text-sm",
            }
          }}
        />
      </div>

      {/* Additional info */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-0">
        <p className="text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
          Already have an account? <a href="/auth/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}