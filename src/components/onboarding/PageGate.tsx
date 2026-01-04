import { useState, useCallback } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface PageGateProps {
  onSignIn: () => Promise<void>;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const PageGate = ({ onSignIn }: PageGateProps) => {
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTypingComplete = useCallback(() => {
    setShowButton(true);
  }, []);

  const { displayedText, isComplete } = useTypingEffect({
    text: "you've been selected.\n\ni need to verify it's really you.",
    speed: 40,
    onComplete: handleTypingComplete,
  });

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await onSignIn();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="page-gate" 
      className="flex min-h-screen items-center justify-center px-6 py-8 animate-page-fade-in"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-12">
        {/* Typing text container */}
        <div id="typing-text" className="min-h-[150px] w-full">
          <p className="text-lg md:text-xl font-light leading-relaxed whitespace-pre-line text-foreground">
            {displayedText}
            <span className={`inline-block ml-0.5 ${isComplete ? 'animate-blink' : ''}`}>▋</span>
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          id="btn-auth"
          onClick={handleSignIn}
          disabled={isLoading}
          className={`
            flex items-center justify-center gap-3 
            min-w-[250px] w-full max-w-[300px]
            px-8 py-4 
            bg-primary text-primary-foreground 
            rounded-lg font-medium
            transition-all duration-200 ease-out
            hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          style={{
            transition: showButton 
              ? 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.2s ease-out' 
              : 'none'
          }}
        >
          <GoogleIcon />
          <span>{isLoading ? 'connecting...' : 'sign up with google'}</span>
        </button>
      </div>
    </div>
  );
};
