import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface OnboardingState {
  currentPage: number;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
  completedAt: string | null;
}

export const useOnboarding = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchOnboardingState(session.user.id);
          }, 0);
        } else {
          setOnboardingState(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOnboardingState(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOnboardingState = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOnboardingState({
          currentPage: data.current_page,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          email: data.email,
          completedAt: data.completed_at,
        });
      } else {
        setOnboardingState(null);
      }
    } catch (error) {
      console.error('Error fetching onboarding state:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = useCallback(async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }, []);

  const initializeOnboarding = useCallback(async () => {
    if (!user) return;

    const userMeta = user.user_metadata;
    const displayName = userMeta?.full_name || userMeta?.name || user.email?.split('@')[0] || 'User';
    const avatarUrl = userMeta?.avatar_url || userMeta?.picture || null;
    const email = user.email || null;

    try {
      const { data: existing } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        setOnboardingState({
          currentPage: existing.current_page,
          displayName: existing.display_name,
          avatarUrl: existing.avatar_url,
          email: existing.email,
          completedAt: existing.completed_at,
        });
        return existing.current_page;
      }

      const { data, error } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: user.id,
          current_page: 2,
          display_name: displayName,
          avatar_url: avatarUrl,
          email: email,
        })
        .select()
        .single();

      if (error) throw error;

      setOnboardingState({
        currentPage: 2,
        displayName,
        avatarUrl,
        email,
        completedAt: null,
      });

      return 2;
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      return 2;
    }
  }, [user]);

  const updatePage = useCallback(async (page: number) => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = { current_page: page };
      
      if (page === 4) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_onboarding')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      setOnboardingState(prev => prev ? {
        ...prev,
        currentPage: page,
        completedAt: page === 4 ? new Date().toISOString() : prev.completedAt,
      } : null);
    } catch (error) {
      console.error('Error updating page:', error);
    }
  }, [user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setOnboardingState(null);
  }, []);

  return {
    user,
    session,
    loading,
    onboardingState,
    signInWithGoogle,
    initializeOnboarding,
    updatePage,
    signOut,
  };
};
