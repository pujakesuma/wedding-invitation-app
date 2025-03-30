// src/app/dashboard/guests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, PlusCircle, Mail, Trash2 } from 'lucide-react';
import type { Database } from '@/lib/types/database';

type Guest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  plus_one_allowed: boolean;
  group_id: string | null;
  invitation_sent: boolean;
};

type GuestWithRSVP = Guest & {
  rsvp: {
    attending: boolean | null;
    meal_choice: string | null;
    plus_one_name: string | null;
  } | null;
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestWithRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  
  // Form state for new guest
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    plus_one_allowed: false,
  });

  const supabase = createClientComponentClient<Database>();
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // First, get the wedding ID
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      // Get the user's wedding
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
      
      // Fetch guests with their RSVP status
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          rsvp:rsvps(attending, meal_choice, plus_one_name)
        `)
        .eq('wedding_id', wedding.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching guests:', error);
        setLoading(false);
        return;
      }
      
      const guestsWithRsvp = data.map(guest => ({
        ...guest,
        rsvp: guest.rsvp && guest.rsvp.length > 0 ? guest.rsvp[0] : null
      }));
      
      setGuests(guestsWithRsvp);
      setLoading(false);
    }
    
    fetchData();
  }, [supabase]);
  
  const handleAddGuest = async () => {
    if (!weddingId || !newGuest.name.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          wedding_id: weddingId,
          name: newGuest.name.trim(),
          email: newGuest.email.trim() || null,
          phone: newGuest.phone.trim() || null,
          plus_one_allowed: newGuest.plus_one_allowed,
        })
        .select();
      
      if (error) throw error;
      
      setGuests([...guests, { ...data[0], rsvp: null }]);
      
      // Reset form
      setNewGuest({
        name: '',
        email: '',
        phone: '',
        plus_one_allowed: false,
      });
      
      setShowAddGuest(false);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };
  
  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGuests(guests.filter(guest => guest.id !== id));
      setSelectedGuests(selectedGuests.filter(guestId => guestId !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };
  
  const handleToggleSelect = (id: string) => {
    if (selectedGuests.includes(id)) {
      setSelectedGuests(selectedGuests.filter(guestId => guestId !== id));
    } else {
      setSelectedGuests([...selectedGuests, id]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map(guest => guest.id));
    }
  };
  
  const handleMarkAsSent = async () => {
    if (selectedGuests.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .update({ invitation_sent: true })
        .in('id', selectedGuests);
      
      if (error) throw error;
      
      setGuests(guests.map(guest => 
        selectedGuests.includes(guest.id) 
          ? { ...guest, invitation_sent: true } 
          : guest
      ));
      
      setSelectedGuests([]);
    } catch (error) {
      console.error('Error marking invitations as sent:', error);
    }
  };
  
  // Filter guests by search query
  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Calculate RSVP stats
  const rsvpStats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvp?.attending === true).length,
    declined: guests.filter(g => g.rsvp?.attending === false).length,
    pending: guests.filter(g => g.rsvp === null).length
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Guest Management</h1>
          <p className="text-gray-500 mt-1">
            Add and manage your wedding guests
          </p>
        </div>
        <Button 
          onClick={() => setShowAddGuest(true)} 
          className="mt-4 sm:mt-0"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-gray-800">{rsvpStats.total}</div>
            <p className="text-sm text-gray-500">Total Guests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-green-600">{rsvpStats.attending}</div>
            <p className="text-sm text-gray-500">Attending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-red-600">{rsvpStats.declined}</div>
            <p className="text-sm text-gray-500">Declined</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-amber-600">{rsvpStats.pending}</div>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Guest Form */}
      {showAddGuest && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Add New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="mt-1"
                  placeholder="Full Name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  className="mt-1"
                  placeholder="Email Address"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  className="mt-1"
                  placeholder="Phone Number"
                />
              </div>
              
              <div className="flex items-center h-full pt-6">
                <Checkbox
                  id="plus-one"
                  checked={newGuest.plus_one_allowed}
                  onCheckedChange={(checked) => 
                    setNewGuest({ 
                      ...newGuest, 
                      plus_one_allowed: checked === true 
                    })
                  }
                />
                <Label htmlFor="plus-one" className="ml-2">
                  Allow Plus One
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddGuest(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddGuest}
                disabled={!newGuest.name.trim()}
              >
                Add Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search guests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {selectedGuests.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedGuests.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAsSent}
            >
              <Mail className="w-4 h-4 mr-2" />
              Mark as Sent
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedGuests([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>
      
      {/* Guest List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <Checkbox
                      checked={selectedGuests.length === guests.length && guests.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Plus One</th>
                  <th className="px-6 py-3">RSVP Status</th>
                  <th className="px-6 py-3">Invitation</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      Loading guests...
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      {searchQuery ? 'No guests matched your search.' : 'No guests added yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedGuests.includes(guest.id)}
                          onCheckedChange={() => handleToggleSelect(guest.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4">{guest.email || '-'}</td>
                      <td className="px-6 py-4">{guest.phone || '-'}</td>
                      <td className="px-6 py-4">
                        {guest.plus_one_allowed ? (
                          guest.rsvp?.plus_one_name ? guest.rsvp.plus_one_name : 'Yes'
                        ) : 'No'}
                      </td>
                      <td className="px-6 py-4">
                        {!guest.rsvp ? (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Pending
                          </span>
                        ) : guest.rsvp.attending ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Attending
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {guest.invitation_sent ? (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Sent
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Not Sent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
