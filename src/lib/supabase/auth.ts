import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/lib/types/database';

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
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
