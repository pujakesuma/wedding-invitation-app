// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/types/database';
import { Calendar, Users, Mail, Clock, BarChart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Fetch user's wedding
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  // Fetch invitation
  const { data: invitation } = await supabase
    .from('invitations')
    .select('*')
    .eq('wedding_id', wedding?.id || '')
    .limit(1)
    .single();
  
  // Fetch guest count
  const { count: guestCount } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_id', wedding?.id || '');
  
  // Fetch RSVP stats
  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('attending')
    .eq('guest_id', supabase.rpc('get_guests_by_wedding_id', { wedding_id: wedding?.id }));
  
  // Calculate RSVP stats
  const rsvpStats = {
    confirmed: rsvps?.filter(r => r.attending === true).length || 0,
    declined: rsvps?.filter(r => r.attending === false).length || 0,
    pending: (guestCount || 0) - (rsvps?.length || 0)
  };
  
  // Calculate days until wedding
  const daysUntilWedding = wedding 
    ? Math.ceil((new Date(wedding.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wedding Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage your wedding details, guest list, and RSVPs all in one place.
        </p>
      </div>
      
      {!wedding ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Let&apos;s Get Started</h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t created your wedding yet. Let&apos;s set up your special day!
          </p>
          <Link href="/dashboard/settings">
            <Button size="lg">Create Your Wedding</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Wedding Overview */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{wedding.title}</h2>
                <p className="text-gray-600">
                  {new Date(wedding.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-600">{wedding.location}</p>
              </div>
              
              {daysUntilWedding !== null && (
                <div className="mt-4 md:mt-0 bg-rose-50 px-6 py-3 rounded-lg text-center">
                  <p className="text-sm text-rose-600">Days until your wedding</p>
                  <p className="text-3xl font-bold text-rose-600">{daysUntilWedding}</p>
                </div>
              )}
            </div>
            
            {invitation ? (
              <div className="bg-gray-50 p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="font-medium">Your invitation is ready to share!</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Send your guests this link:
                  </p>
                  <p className="text-blue-600 break-all">
                    {`${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-site.com'}/invitation/${invitation.slug}`}
                  </p>
                </div>
                <Link href={`/invitation/${invitation.slug}`} target="_blank">
                  <Button variant="outline" className="mt-4 sm:mt-0">
                    Preview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="font-medium text-amber-800">Your invitation is not yet set up</p>
                <p className="text-amber-700 text-sm mt-1">
                  Design your invitation to share with your guests.
                </p>
                <Link href="/dashboard/invitation">
                  <Button variant="outline" className="mt-2" size="sm">
                    Create Invitation
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Days Left
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{daysUntilWedding || '–'}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Total Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guestCount || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{rsvpStats.confirmed}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Pending RSVPs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{rsvpStats.pending}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Guests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Add, edit, or remove guests and track their RSVPs.
                </p>
                <Link href="/dashboard/guests">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Guest List
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wedding Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage your ceremony, reception, and other wedding events.
                </p>
                <Link href="/dashboard/events">
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>RSVP Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track responses and get insights into your guest&apos;s preferences.
                </p>
                <Link href="/dashboard/analytics">
                  <Button variant="outline" className="w-full">
                    <BarChart className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}