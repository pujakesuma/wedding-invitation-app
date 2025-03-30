// src/app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/lib/types/database';
import { 
  Home, 
  Users, 
  Settings, 
  Calendar,
  Mail,
  BarChart,
  LogOut
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link href="/dashboard" className="text-xl font-semibold text-rose-600">
              Wedding Planner
            </Link>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/guests" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Guests
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/invitation" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Invitation
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/events" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/analytics" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <BarChart className="w-5 h-5 mr-3" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold">
                {profile?.full_name?.charAt(0) || session.user.email?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
            <form action="/api/auth/signout" method="post">
              <button 
                type="submit"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="text-xl font-semibold text-rose-600">
            Wedding Planner
          </Link>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}