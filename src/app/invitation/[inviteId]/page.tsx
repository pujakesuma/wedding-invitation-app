import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import InvitationCard from '@/components/invitation/InvitationCard';
import type { Database } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

interface InvitationPageProps {
  params: {
    inviteId: string;
  };
  searchParams: {
    guest?: string;
  };
}

export default async function InvitationPage({ params, searchParams }: InvitationPageProps) {
  const { inviteId } = params;
  const guestId = searchParams.guest;
  
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Fetch invitation details
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', inviteId)
    .single();
  
  if (invitationError || !invitation) {
    return notFound();
  }
  
  // Fetch wedding details
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', invitation.wedding_id)
    .single();
  
  if (weddingError || !wedding) {
    return notFound();
  }
  
  // Fetch events
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('date');
  
  if (eventsError) {
    console.error('Error fetching events:', eventsError.message);
  }
  
  // Fetch guest info if guest ID is provided
  let guest = null;
  if (guestId) {
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();
    
    if (!guestError) {
      guest = guestData;
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <InvitationCard
        invitation={invitation}
        wedding={wedding}
        events={events || []}
        guest={guest}
      />
    </div>
  );
} 