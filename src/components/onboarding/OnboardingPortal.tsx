import { useState, useEffect, useCallback } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { PageGate } from './PageGate';
import { PageScan } from './PageScan';
import { PageContact } from './PageContact';
import { PageComplete } from './PageComplete';

export const OnboardingPortal = () => {
  const {
    user,
    loading,
    onboardingState,
    signInWithGoogle,
    initializeOnboarding,
    updatePage,
  } = useOnboarding();

  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle auth callback and page initialization
  useEffect(() => {
    if (loading) return;

    if (user && !isInitialized) {
      initializeOnboarding().then((page) => {
        if (page) {
          setCurrentPage(page);
        }
        setIsInitialized(true);
      });
    } else if (!user) {
      setCurrentPage(1);
      setIsInitialized(true);
    }
  }, [user, loading, isInitialized, initializeOnboarding]);

  // Sync with persisted state
  useEffect(() => {
    if (onboardingState && onboardingState.currentPage !== currentPage) {
      setCurrentPage(onboardingState.currentPage);
    }
  }, [onboardingState]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    updatePage(page);
  }, [updatePage]);

  const handleScanComplete = useCallback(() => {
    goToPage(3);
  }, [goToPage]);

  const handleContactComplete = useCallback(() => {
    goToPage(4);
  }, [goToPage]);

  // Show loading state
  if (loading || (!isInitialized && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground animate-fade-pulse">loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 1 && (
        <PageGate onSignIn={signInWithGoogle} />
      )}
      
      {currentPage === 2 && (
        <PageScan
          displayName={onboardingState?.displayName || null}
          avatarUrl={onboardingState?.avatarUrl || null}
          onComplete={handleScanComplete}
        />
      )}
      
      {currentPage === 3 && (
        <PageContact onComplete={handleContactComplete} />
      )}
      
      {currentPage === 4 && (
        <PageComplete />
      )}
    </div>
  );
};
