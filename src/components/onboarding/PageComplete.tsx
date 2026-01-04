import { IMESSAGE_LINK } from '@/lib/vcard';

export const PageComplete = () => {
  return (
    <div 
      id="page-complete" 
      className="flex min-h-screen items-center justify-center px-6 py-8 animate-page-fade-in"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        {/* Complete icon */}
        <div className="complete-icon text-6xl text-accent animate-pop-in">
          ✓
        </div>

        {/* Complete text */}
        <h2 className="complete-text text-3xl font-semibold text-foreground mt-4">
          you're in.
        </h2>

        {/* Complete subtitle */}
        <p className="complete-subtext text-base text-muted-foreground -mt-2">
          go back to messages.
        </p>

        {/* Open Messages Button */}
        <a
          id="btn-messages"
          href={IMESSAGE_LINK}
          className={`
            inline-flex items-center justify-center
            min-w-[250px] w-full max-w-[300px]
            px-8 py-4 
            bg-primary text-primary-foreground 
            rounded-lg font-medium
            transition-all duration-200 ease-out
            hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]
            mt-4
            no-underline
          `}
        >
          open messages
        </a>
      </div>
    </div>
  );
};
