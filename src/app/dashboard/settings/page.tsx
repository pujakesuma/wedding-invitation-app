'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/types/database';

type User = {
  id: string;
  email: string;
  full_name: string | null;
};

type Wedding = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [userForm, setUserForm] = useState({
    full_name: '',
  });
  
  const [weddingForm, setWeddingForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError) throw userError;
        
        setUser(userData);
        setUserForm({
          full_name: userData.full_name || '',
        });
        
        // Fetch wedding if exists
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (weddingError && weddingError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is fine if no wedding exists
          throw weddingError;
        }
        
        if (weddingData) {
          setWedding(weddingData);
          setWeddingForm({
            title: weddingData.title,
            date: new Date(weddingData.date).toISOString().split('T')[0],
            location: weddingData.location,
            description: weddingData.description || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [supabase, router]);
  
  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: userForm.full_name,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        full_name: userForm.full_name,
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleWeddingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSaving(true);
    
    try {
      if (wedding) {
        // Update existing wedding
        const { error } = await supabase
          .from('weddings')
          .update({
            title: weddingForm.title,
            date: weddingForm.date,
            location: weddingForm.location,
            description: weddingForm.description || null,
          })
          .eq('id', wedding.id);
        
        if (error) throw error;
      } else {
        // Create new wedding
        const { data, error } = await supabase
          .from('weddings')
          .insert({
            user_id: user.id,
            title: weddingForm.title,
            date: weddingForm.date,
            location: weddingForm.location,
            description: weddingForm.description || null,
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setWedding(data[0]);
        }
      }
      
      alert('Wedding details saved successfully!');
      
      // Redirect to dashboard after creating new wedding
      if (!wedding) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving wedding details:', error);
      alert('Error saving wedding details. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and wedding details
        </p>
      </div>
      
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserUpdate} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your email cannot be changed
              </p>
            </div>
            
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Wedding Details */}
      <Card>
        <CardHeader>
          <CardTitle>{wedding ? 'Edit Wedding Details' : 'Create Your Wedding'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWeddingUpdate} className="space-y-4">
            <div>
              <Label htmlFor="wedding_title">Wedding Title</Label>
              <Input
                id="wedding_title"
                value={weddingForm.title}
                onChange={(e) => setWeddingForm({ ...weddingForm, title: e.target.value })}
                placeholder="e.g., John & Jane's Wedding"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="wedding_date">Wedding Date</Label>
              <Input
                id="wedding_date"
                type="date"
                value={weddingForm.date}
                onChange={(e) => setWeddingForm({ ...weddingForm, date: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="wedding_location">Location</Label>
              <Input
                id="wedding_location"
                value={weddingForm.location}
                onChange={(e) => setWeddingForm({ ...weddingForm, location: e.target.value })}
                placeholder="Venue name and address"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="wedding_description">Description (Optional)</Label>
              <Textarea
                id="wedding_description"
                value={weddingForm.description}
                onChange={(e) => setWeddingForm({ ...weddingForm, description: e.target.value })}
                placeholder="Add any additional details about your wedding"
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : wedding ? 'Update Wedding' : 'Create Wedding'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Need to leave? You can sign out of your account below.
            </p>
            
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}