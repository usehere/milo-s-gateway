import { useState, useEffect } from 'react';

interface PageScanProps {
  displayName: string | null;
  avatarUrl: string | null;
  onComplete: () => void;
}

const DATA_POINTS = [
  '◆ verifying identity...',
  '◆ checking email domain...',
  '◆ scanning patterns...',
  '◆ building profile...',
];

export const PageScan = ({ displayName, avatarUrl, onComplete }: PageScanProps) => {
  const [visiblePoints, setVisiblePoints] = useState<number>(0);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    // Show data points sequentially
    const pointIntervals: NodeJS.Timeout[] = [];
    
    DATA_POINTS.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisiblePoints(index + 1);
      }, 800 + (index * 600));
      pointIntervals.push(timeout);
    });

    // Complete scan after all points shown
    const completeTimeout = setTimeout(() => {
      setScanComplete(true);
    }, 800 + (DATA_POINTS.length * 600) + 500);

    // Auto-advance after completion
    const advanceTimeout = setTimeout(() => {
      onComplete();
    }, 800 + (DATA_POINTS.length * 600) + 1500);

    return () => {
      pointIntervals.forEach(clearTimeout);
      clearTimeout(completeTimeout);
      clearTimeout(advanceTimeout);
    };
  }, [onComplete]);

  const name = displayName || 'user';

  return (
    <div 
      id="page-scan" 
      className="flex min-h-screen items-center justify-center px-6 py-8 animate-page-fade-in"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-8">
        {/* Profile Container with Scan */}
        <div id="profile-pic" className="relative">
          {/* Pulsing ring */}
          <div className="absolute inset-[-8px] rounded-full border-2 border-accent animate-pulse-ring" />
          
          {/* Profile image */}
          <div className="w-[150px] h-[150px] rounded-full border-2 border-accent bg-background-secondary overflow-hidden relative">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Scan line */}
            {!scanComplete && (
              <div 
                className="scan-line absolute left-0 w-full h-[3px] animate-scan-line"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--accent)) 50%, transparent 100%)',
                }}
              />
            )}
          </div>
        </div>

        {/* Scan text */}
        <p 
          id="scan-text" 
          className={`text-base text-muted-foreground ${scanComplete ? '' : 'animate-fade-pulse'}`}
        >
          {scanComplete ? `${name} verified.` : `analyzing ${name}...`}
        </p>

        {/* Data points */}
        <div id="data-points" className="flex flex-col gap-2 w-full">
          {DATA_POINTS.map((point, index) => (
            <p
              key={index}
              className={`text-sm text-muted-foreground fade-in-sequential`}
              style={{
                animationDelay: `${index * 0.3}s`,
                opacity: visiblePoints > index ? 1 : 0,
              }}
            >
              {point}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
