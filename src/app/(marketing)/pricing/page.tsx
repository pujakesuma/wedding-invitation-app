// src/app/(marketing)/pricing/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-50 to-rose-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your wedding needs.
          </p>
        </div>
      </header>

      {/* Pricing Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 bg-white">
                <h3 className="text-lg font-medium text-gray-900">Free</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Perfect for couples starting their wedding planning journey.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/wedding</span>
                </p>
                <Button asChild className="mt-8 w-full">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What&apos;s included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Basic invitation templates</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Up to 50 guests</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Basic RSVP tracking</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Event schedule</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute top-0 inset-x-0">
                <div className="h-1 bg-rose-500 w-full"></div>
              </div>
              <div className="absolute top-0 right-0 -mr-1 mt-4 transform rotate-45">
                <div className="w-36 bg-rose-500 text-white text-xs font-semibold py-1 text-center transform translate-x-6">
                  Popular
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-lg font-medium text-gray-900">Premium</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Everything you need for a perfect wedding experience.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$49</span>
                  <span className="text-base font-medium text-gray-500">/wedding</span>
                </p>
                <Button asChild className="mt-8 w-full bg-rose-600 hover:bg-rose-700">
                  <Link href="/register?plan=premium">Get Started</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What&apos;s included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">All basic templates</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Premium templates</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Unlimited guests</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Advanced analytics</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Email notifications</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Priority support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Luxury Plan */}
            <div className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 bg-white">
                <h3 className="text-lg font-medium text-gray-900">Luxury</h3>
                <p className="mt-4 text-sm text-gray-500">
                  The ultimate wedding planning experience with custom design.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$99</span>
                  <span className="text-base font-medium text-gray-500">/wedding</span>
                </p>
                <Button asChild className="mt-8 w-full">
                  <Link href="/register?plan=luxury">Get Started</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What&apos;s included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Everything in Premium</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Custom domain name</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">
                      Personalized design consultation
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">
                      Fully custom invitation design
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500">Dedicated account manager</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade from Free to Premium or Luxury at any time. Your existing data
                will be seamlessly transferred to your new plan.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                How long do I have access to my wedding invitation?
              </h3>
              <p className="text-gray-600">
                Your invitation will remain active for one year after your wedding date, giving you
                plenty of time to collect RSVPs and share information with your guests.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Can I export my guest list?</h3>
              <p className="text-gray-600">
                Yes, you can export your guest list and RSVP data at any time in CSV format, which
                can be opened in Excel or Google Sheets.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee. If you&apos;re not satisfied with your
                premium or luxury plan within 14 days of purchase, we&apos;ll provide a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can I try the premium features before purchasing?
              </h3>
              <p className="text-gray-600">
                We offer a preview of premium templates in the free plan, so you can see the quality
                and style before upgrading. However, premium features like unlimited guests and
                advanced analytics require an upgrade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to create beautiful wedding invitations?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with our free plan today and upgrade anytime as your needs grow.
          </p>
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/register">Get Started For Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
