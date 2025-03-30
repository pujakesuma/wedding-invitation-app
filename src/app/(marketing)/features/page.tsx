// src/app/(marketing)/features/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Mail, Palette, Star, BarChart2, Settings, Send } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-50 to-rose-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Powerful Features for Your Special Day
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create beautiful digital wedding invitations and manage your
            RSVPs with ease.
          </p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Palette className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of professionally designed templates to perfectly match your
                wedding style. Customize colors, fonts, and messaging to make it uniquely yours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Guest Management</h3>
              <p className="text-gray-600">
                Easily manage your guest list in one place. Add, edit, and organize guests, track
                RSVPs, and collect meal preferences for a stress-free planning experience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Digital Delivery</h3>
              <p className="text-gray-600">
                Send beautiful digital invitations to your guests via email or share a custom link.
                Save on printing costs and make updates anytime without reprinting.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Event Management</h3>
              <p className="text-gray-600">
                Create and manage multiple events for your wedding day including ceremony,
                reception, and more. Share all the important details with your guests in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Send className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">RSVP Management</h3>
              <p className="text-gray-600">
                Collect and track RSVPs digitally with real-time updates. Allow guests to specify
                meal preferences and plus-ones all in one convenient system.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <BarChart2 className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Get insights into your guest responses with a comprehensive analytics dashboard.
                Track attendance, meal choices, and response rates at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <Star className="h-8 w-8 text-rose-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Domains</h3>
              <p className="text-gray-600 mb-4">
                Use your own custom domain for your wedding invitation for a more personalized
                touch. Create a memorable URL that guests will easily remember.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Custom URL for your invitation</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Professional email addresses</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Seamless domain setup</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <Settings className="h-8 w-8 text-rose-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Premium Templates</h3>
              <p className="text-gray-600 mb-4">
                Access exclusive premium templates designed by professional designers for a truly
                unique wedding invitation experience.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Exclusive premium designs</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Advanced customization options</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Professional design assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your wedding invitation?</h2>
          <p className="text-xl mb-8">
            Join thousands of happy couples who have made their wedding planning easier with our
            platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-rose-600 hover:bg-gray-100">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-rose-700"
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
