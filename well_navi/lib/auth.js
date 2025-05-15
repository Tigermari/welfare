// lib/auth.js
import { supabase } from './supabaseClient';

// Sign Up Function
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Sign Up Error:', error.message);
  } else {
    console.log('Sign Up Success:', data);
  }
  return { data, error };
};

// Sign In Function
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Sign In Error:', error.message);
  } else {
    console.log('Sign In Success:', data);
  }
  return { data, error };
};
