import React, { useState, useEffect } from 'react';
import { 
  useNavigate, Navigate, useLocation 
} from 'react-router-dom';
import { supabase, logActivity } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const wasBlocked = location.state?.blocked === true;
  const registrationsOpen = localStorage.getItem('registrations_open') !== 'false';

  useEffect(() => {
    if (wasBlocked && user) {
      signOut();
    }
  }, [wasBlocked, user, signOut]);

  if (user && !wasBlocked) {
    return <Navigate to="/" replace />;
  }

  const handleSignUp = async (email: string, password: string) => {
    try {
      if (!registrationsOpen && !enrollmentCode.trim()) {
        setError('Registration is currently invite-only. Enter your enrollment code to sign up.');
        return;
      }

      if (enrollmentCode.trim()) {
        await supabase.rpc('use_enrollment_code', {
          p_code: enrollmentCode.trim(),
          p_user_id: '00000000-0000-0000-0000-000000000000' // Dummy ID for validation before signup
        });

        // We can't actually use the code yet because the user doesn't exist.
        // So we just validate it first.
        const { data: codeData, error: fetchError } = await supabase
          .from('enrollment_codes')
          .select('*')
          .eq('code', enrollmentCode.trim())
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError || !codeData) {
          setError('Invalid enrollment code');
          return;
        }

        if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
          setError('Enrollment code has expired');
          return;
        }

        if (codeData.uses_count >= codeData.max_uses) {
          setError('Code fully used');
          return;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data.user) {
        if (enrollmentCode.trim()) {
          // Now actually use the code
          await supabase.rpc('use_enrollment_code', {
            p_code: enrollmentCode.trim(),
            p_user_id: data.user.id
          });
        }

        await logActivity(data.user.id, 'signup', { email });
        setSuccess('Account created! You can now log in.');
      }
    } catch (err: any) {
      setError('Connection failed. Please try again.');
      console.error('SignUp error:', err);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data.session) {
        await logActivity(data.user.id, 'login', { email });
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If it's a recursion error or something else, we still log them in as a regular user
          // to prevent them from being completely stuck, but we log the error.
        }
        
        if (!profile && (!profileError || 
            profileError.code === 'PGRST116')) {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              email: data.user.email,
              display_name:
                data.user.email?.split('@')[0] || 'User',
              role: 'user',
            },
            { onConflict: 'id', ignoreDuplicates: true }
          );
        }
        
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError('Connection failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        await handleSignUp(email, password);
      } else {
        await handleLogin(email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 flex-col">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-white">
            N
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {isSignUp ? 'Sign up for NexusEdu' : 'Sign in to your NexusEdu account'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {wasBlocked && (
            <div className="rounded-lg bg-red-50 border 
                            border-red-200 p-4 text-sm 
                            text-red-700 mb-4">
              <strong>Account blocked.</strong>{' '}
              Your account has been blocked by an administrator.
              Contact support if you believe this is a mistake.
            </div>
          )}
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Enrollment Code {!registrationsOpen && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={!registrationsOpen}
                  value={enrollmentCode}
                  onChange={(e) => setEnrollmentCode(e.target.value)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Enrollment Code (if required)"
                />
                {!registrationsOpen && (
                  <p className="mt-1 text-xs text-text-secondary">
                    Registration is currently invite-only. Enter your enrollment code to sign up.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isSignUp ? 'Sign up' : 'Sign in'}
          </Button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
