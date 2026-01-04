import { useState, useEffect, useCallback } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const useTypingEffect = ({ text, speed = 40, onComplete }: UseTypingEffectOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return { displayedText, isComplete };
};
