import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Mail as MailIcon, 
  Users as UsersIcon, 
  Palette as PaletteIcon, 
  Star as StarIcon 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-rose-100 px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Beautiful Digital</span>{' '}
            <span className="block text-rose-600 xl:inline">Wedding Invitations</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Create stunning digital wedding invitations in minutes. Track RSVPs, manage your guest list, and share your love story with ease.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link href="/register">
              <Button className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <PaletteIcon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Templates</h3>
              <p className="text-gray-600">
                Choose from dozens of professionally designed templates to match your wedding style.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guest Management</h3>
              <p className="text-gray-600">
                Easily manage your guest list, track RSVPs, and organize seating arrangements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <MailIcon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Delivery</h3>
              <p className="text-gray-600">
                Send invitations via email or share a custom link with your guests.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Details</h3>
              <p className="text-gray-600">
                Share all the important details of your special day, including maps and schedules.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Photo Gallery</h3>
              <p className="text-gray-600">
                Share your favorite moments with guests through a beautiful photo gallery.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">RSVP Tracking</h3>
              <p className="text-gray-600">
                Real-time RSVP tracking and meal preference collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;We received so many compliments on our digital invitation. The RSVP feature made tracking guests effortless!&quot;
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Sarah & Michael</p>
                <p className="text-gray-500">June 2024</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Such a time-saver! Creating our wedding invitation was simple and the results were gorgeous.&quot;
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Emma & James</p>
                <p className="text-gray-500">April 2024</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;We saved so much on paper invitations and had better tracking of our RSVPs. Win-win!&quot;
              </p>
              <div className="font-medium">
                <p className="text-gray-900">David & Lisa</p>
                <p className="text-gray-500">August 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-rose-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to create your perfect wedding invitation?</h2>
          <p className="text-rose-100 mb-8 text-lg">
            Join thousands of happy couples who have simplified their wedding planning process.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-rose-600 bg-white hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 