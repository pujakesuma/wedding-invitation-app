import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/lib/types/database';

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClientComponentClient<Database>();
  
  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) throw authError;
  
  // Create user record in our users table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
      });
    
    if (profileError) throw profileError;
  }
  
  return authData;
}

export async function signIn(email: string, password: string) {
  const supabase = createClientComponentClient<Database>();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
}

export async function signOut() {
  const supabase = createClientComponentClient<Database>();
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const supabase = createClientComponentClient<Database>();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
} 