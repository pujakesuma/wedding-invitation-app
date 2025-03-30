'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Database } from '@/lib/types/database';

export default function RSVPAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRsvps: 0,
    attending: 0,
    notAttending: 0,
    pending: 0,
    mealChoices: [] as { name: string; value: number }[],
    rsvpTimeline: [] as { date: string; count: number }[],
  });
  const [weddingId, setWeddingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const supabase = createClientComponentClient<Database>();

        // Get user session and wedding
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch user's wedding
        const { data: wedding } = await supabase
          .from('weddings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!wedding) {
          setLoading(false);
          return;
        }

        setWeddingId(wedding.id);

        // Fetch all guests
        const { data: guests, count: totalGuests } = await supabase
          .from('guests')
          .select('*', { count: 'exact' })
          .eq('wedding_id', wedding.id);

        // Fetch RSVPs
        const { data: rsvpsData } = await supabase
          .from('rsvps')
          .select(
            `
            *,
            guest:guests(wedding_id)
          `
          )
          .eq('guest.wedding_id', wedding.id);

        // Filter valid RSVPs (those belonging to this wedding)
        const rsvps = rsvpsData?.filter(r => r.guest?.wedding_id === wedding.id) || [];

        // Process meal choices
        const mealChoiceCounts: Record<string, number> = {};
        rsvps.forEach(rsvp => {
          if (rsvp.meal_choice) {
            mealChoiceCounts[rsvp.meal_choice] = (mealChoiceCounts[rsvp.meal_choice] || 0) + 1;
          }
          if (rsvp.plus_one_meal_choice) {
            mealChoiceCounts[rsvp.plus_one_meal_choice] =
              (mealChoiceCounts[rsvp.plus_one_meal_choice] || 0) + 1;
          }
        });

        const mealChoices = Object.entries(mealChoiceCounts)
          .filter(([name]) => name) // Filter out null/empty values
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }));

        // Create a timeline of RSVP responses by date
        const rsvpsByDate: Record<string, number> = {};
        rsvps.forEach(rsvp => {
          const date = new Date(rsvp.created_at).toISOString().split('T')[0];
          rsvpsByDate[date] = (rsvpsByDate[date] || 0) + 1;
        });

        const rsvpTimeline = Object.entries(rsvpsByDate)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate stats
        const attending = rsvps.filter(r => r.attending === true).length || 0;
        const notAttending = rsvps.filter(r => r.attending === false).length || 0;
        const totalRsvps = rsvps.length || 0;

        setStats({
          totalGuests: totalGuests || 0,
          totalRsvps,
          attending,
          notAttending,
          pending: (totalGuests || 0) - totalRsvps,
          mealChoices,
          rsvpTimeline,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // RSVP Status colors
  const RSVP_COLORS = {
    attending: '#4ade80', // green
    notAttending: '#f87171', // red
    pending: '#fbbf24', // yellow
  };

  // Meal Choice colors
  const MEAL_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#af19ff', '#ff6384'];

  // Calculate response rate
  const responseRate =
    stats.totalGuests > 0 ? Math.round((stats.totalRsvps / stats.totalGuests) * 100) : 0;

  if (loading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!weddingId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Create Your Wedding First</h1>
        <p className="mb-6">You need to set up your wedding details before viewing analytics.</p>
        <a
          href="/dashboard/settings"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/0.9] h-10 py-2 px-4"
        >
          Set Up Wedding
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wedding Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <p className="text-xs text-gray-500">
              {stats.totalRsvps} of {stats.totalGuests} responded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
            <p className="text-xs text-gray-500">
              {stats.totalRsvps > 0 ? Math.round((stats.attending / stats.totalRsvps) * 100) : 0}%
              of responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Not Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.notAttending}</div>
            <p className="text-xs text-gray-500">
              {stats.totalRsvps > 0 ? Math.round((stats.notAttending / stats.totalRsvps) * 100) : 0}
              % of responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>RSVP Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Attending', value: stats.attending },
                    { name: 'Not Attending', value: stats.notAttending },
                    { name: 'Pending', value: stats.pending },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="attending" fill={RSVP_COLORS.attending} />
                  <Cell key="notAttending" fill={RSVP_COLORS.notAttending} />
                  <Cell key="pending" fill={RSVP_COLORS.pending} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meal Choices Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Preferences</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {stats.mealChoices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.mealChoices}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Guests" fill="#8884d8">
                    {stats.mealChoices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MEAL_COLORS[index % MEAL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No meal preferences recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RSVP Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>RSVP Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {stats.rsvpTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.rsvpTimeline}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Responses" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No RSVP timeline data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
