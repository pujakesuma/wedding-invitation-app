'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type InvitationProps = {
  invitation: {
    id: string;
    custom_message: string | null;
    accent_color: string;
    font_choice: string;
  };
  wedding: {
    title: string;
    date: string;
    location: string;
    description: string | null;
  };
  events: Array<{
    id: string;
    name: string;
    date: string;
    end_date: string | null;
    location: string;
    description: string | null;
  }>;
  guest: {
    id: string;
    name: string;
    plus_one_allowed: boolean;
  } | null;
};

export default function InvitationCard({
  invitation,
  wedding,
  events,
  guest
}: InvitationProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [mealChoice, setMealChoice] = useState('');
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneMealChoice, setPlusOneMealChoice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClientComponentClient<Database>();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guest) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('rsvps')
        .upsert({
          guest_id: guest.id,
          attending: attending,
          meal_choice: mealChoice,
          plus_one_name: plusOneName,
          plus_one_meal_choice: plusOneMealChoice,
          notes: notes,
        });
      
      if (error) throw error;
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format the wedding date
  const weddingDate = new Date(wedding.date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg"
      style={{ 
        fontFamily: invitation.font_choice, 
        backgroundColor: '#fff',
        borderColor: invitation.accent_color,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div className="text-center mb-8">
        <h1 
          className="text-3xl font-semibold mb-4" 
          style={{ color: invitation.accent_color }}
        >
          {wedding.title}
        </h1>
        <p className="text-xl mb-2">{formattedDate}</p>
        <p className="text-lg">{wedding.location}</p>
        
        {wedding.description && (
          <p className="mt-4 italic">{wedding.description}</p>
        )}
      </div>
      
      {invitation.custom_message && (
        <div className="my-6 text-center">
          <p>{invitation.custom_message}</p>
        </div>
      )}
      
      {events.length > 0 && (
        <div className="my-8">
          <h2 
            className="text-xl font-medium mb-4 text-center"
            style={{ color: invitation.accent_color }}
          >
            Schedule of Events
          </h2>
          
          <div className="space-y-4">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const formattedEventTime = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });
              
              return (
                <div key={event.id} className="border-b pb-4">
                  <h3 className="font-medium">{event.name}</h3>
                  <p>{formattedEventTime} - {event.location}</p>
                  {event.description && <p className="text-sm mt-1">{event.description}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {guest && !submitted ? (
        <form onSubmit={handleSubmit} className="mt-8">
          <h2 
            className="text-xl font-medium mb-4 text-center"
            style={{ color: invitation.accent_color }}
          >
            RSVP
          </h2>
          
          <div className="mb-6">
            <p className="mb-2">Will you be attending?</p>
            <RadioGroup 
              value={attending === null ? undefined : attending.toString()} 
              onValueChange={(value: string) => setAttending(value === 'true')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="attending-yes" />
                <Label htmlFor="attending-yes">Yes, I&apos;ll be there</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="attending-no" />
                <Label htmlFor="attending-no">Unfortunately, I can&apos;t attend</Label>
              </div>
            </RadioGroup>
          </div>
          
          {attending && (
            <>
              <div className="mb-4">
                <Label htmlFor="meal-choice">Meal Preference</Label>
                <select
                  id="meal-choice"
                  value={mealChoice}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMealChoice(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Select an option</option>
                  <option value="beef">Beef</option>
                  <option value="chicken">Chicken</option>
                  <option value="fish">Fish</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              
              {guest.plus_one_allowed && (
                <>
                  <div className="mb-4">
                    <Label htmlFor="plus-one">Plus One Name (if attending)</Label>
                    <Input
                      id="plus-one"
                      value={plusOneName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlusOneName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {plusOneName && (
                    <div className="mb-4">
                      <Label htmlFor="plus-one-meal">Plus One Meal Preference</Label>
                      <select
                        id="plus-one-meal"
                        value={plusOneMealChoice}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlusOneMealChoice(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="">Select an option</option>
                        <option value="beef">Beef</option>
                        <option value="chicken">Chicken</option>
                        <option value="fish">Fish</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          <div className="mb-6">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={isSubmitting || attending === null}
            className="w-full"
            style={{ 
              backgroundColor: invitation.accent_color,
              color: '#fff'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </Button>
        </form>
      ) : submitted ? (
        <div className="text-center my-8 p-4 bg-green-50 rounded">
          <h3 className="text-xl font-medium mb-2" style={{ color: invitation.accent_color }}>
            Thank You!
          </h3>
          <p>Your RSVP has been submitted successfully.</p>
        </div>
      ) : (
        <div className="text-center my-8">
          <p>To RSVP, please use the link in your invitation email.</p>
        </div>
      )}
    </div>
  );
} 