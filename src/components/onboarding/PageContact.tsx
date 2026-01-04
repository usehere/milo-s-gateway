import { useState } from 'react';
import { downloadVCard } from '@/lib/vcard';

interface PageContactProps {
  onComplete: () => void;
}

const CheckIcon = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-accent"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PageContact = ({ onComplete }: PageContactProps) => {
  const [contactSaved, setContactSaved] = useState(false);

  const handleSaveContact = () => {
    downloadVCard();
    setContactSaved(true);
  };

  return (
    <div 
      id="page-contact" 
      className="flex min-h-screen items-center justify-center px-6 py-8 animate-page-fade-in"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        {/* Check circle */}
        <div className="check-circle w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center animate-pop-in">
          <CheckIcon />
        </div>

        {/* Title */}
        <h2 className="contact-text text-2xl font-medium text-foreground mt-4">
          one last thing.
        </h2>

        {/* Subtitle */}
        <p className="contact-subtext text-base text-muted-foreground -mt-2">
          save my contact so you don't lose me.
        </p>

        {/* Save Contact Button */}
        <button
          id="btn-save-contact"
          onClick={handleSaveContact}
          disabled={contactSaved}
          className={`
            min-w-[250px] w-full max-w-[300px]
            px-8 py-4 
            bg-transparent text-foreground 
            border border-muted-foreground
            rounded-lg font-medium
            transition-all duration-200 ease-out
            hover:border-foreground hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-muted-foreground disabled:hover:shadow-none
            mt-4
          `}
        >
          {contactSaved ? 'contact saved ✓' : "save milo's contact"}
        </button>

        {/* Done Button */}
        <button
          id="btn-done"
          onClick={onComplete}
          className={`
            min-w-[250px] w-full max-w-[300px]
            px-8 py-4 
            bg-primary text-primary-foreground 
            rounded-lg font-medium
            transition-all duration-200 ease-out
            hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]
            ${contactSaved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          style={{
            transition: contactSaved 
              ? 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.2s ease-out' 
              : 'none'
          }}
        >
          i'm done
        </button>
      </div>
    </div>
  );
};
