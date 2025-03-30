'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, MapPin, Calendar, Trash2 } from 'lucide-react';
import type { Database } from '@/lib/types/database';

type Wedding = {
  id: string;
  title: string;
  date: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  end_date: string | null;
  location: string;
  description: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Get user session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

        // Fetch wedding
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('id, title, date')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (weddingError) {
          // No wedding found
          setLoading(false);
          return;
        }

        setWedding(weddingData);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('wedding_id', weddingData.id)
          .order('date');

        if (eventsError) throw eventsError;

        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wedding) return;

    setSaving(true);

    try {
      // Combine date and time
      const dateTime = eventForm.time
        ? `${eventForm.date}T${eventForm.time}:00`
        : `${eventForm.date}T00:00:00`;

      const { data, error } = await supabase
        .from('events')
        .insert({
          wedding_id: wedding.id,
          name: eventForm.name,
          date: dateTime,
          location: eventForm.location,
          description: eventForm.description || null,
        })
        .select();

      if (error) throw error;

      // Reset form
      setEventForm({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
      });

      setShowAddForm(false);

      // Update events list
      if (data) {
        setEvents([...events, data[0]]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);

      if (error) throw error;

      // Update events list
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!wedding) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Create Your Wedding First</h1>
        <p className="mb-6">You need to set up your wedding details before adding events.</p>
        <Button asChild>
          <a href="/dashboard/settings">Set Up Wedding</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Wedding Events</h1>
          <p className="text-gray-500 mt-1">Manage the schedule for your special day</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0"
          disabled={showAddForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <Label htmlFor="event_name">Event Name*</Label>
                <Input
                  id="event_name"
                  value={eventForm.name}
                  onChange={e => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g., Ceremony, Reception, Cocktail Hour"
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Date*</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="event_time">Time</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="event_location">Location*</Label>
                <Input
                  id="event_location"
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Venue name or address"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="event_description">Description (Optional)</Label>
                <Textarea
                  id="event_description"
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Add any additional details about this event"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!eventForm.name || !eventForm.date || !eventForm.location || saving}
                >
                  {saving ? 'Saving...' : 'Add Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Wedding Day Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Wedding Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-gray-700 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-rose-600" />
            <span>{formatDateTime(wedding.date).date}</span>
          </div>

          <p className="text-gray-600">
            Add events to create a schedule for your wedding day. These events will be displayed on
            your digital invitation.
          </p>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No Events Added Yet</h2>
          <p className="text-gray-600 mb-6">
            Start by adding key events like your ceremony and reception.
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Event
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Schedule</h2>

          <div className="space-y-4">
            {events.map(event => {
              const { date, time } = formatDateTime(event.date);

              return (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="bg-rose-100 p-4 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-rose-600" />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{event.name}</h3>
                          <p className="text-gray-700 text-sm flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                            {date} at {time}
                          </p>
                          <p className="text-gray-700 text-sm flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                            {event.location}
                          </p>

                          {event.description && (
                            <p className="mt-3 text-gray-600">{event.description}</p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
