# Wedding Invitation App

A beautiful digital wedding invitation application built with Next.js and Supabase.

## Features

- Beautiful digital wedding invitations
- RSVP tracking and management
- Guest management
- Admin dashboard
- Authentication

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Project Structure

```
wedding-invitation-app/
├── src/                         # Source directory
│   ├── app/                     # Next.js App Router
│   │   ├── (marketing)/             # Landing page routes
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── features/page.tsx    # Features page
│   │   │   ├── pricing/page.tsx     # Pricing page
│   │   │   └── about/page.tsx       # About page
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── login/page.tsx       # Login page
│   │   │   ├── register/page.tsx    # Registration page
│   │   │   └── forgot-password/page.tsx
│   │   ├── dashboard/               # Admin dashboard
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── guests/page.tsx      # Guest management
│   │   │   ├── design/page.tsx      # Invitation design
│   │   │   ├── settings/page.tsx    # Account settings
│   │   │   └── analytics/page.tsx   # RSVP analytics
│   │   ├── invitation/          # Public invitation pages
│   │   │   └── [inviteId]/page.tsx  # Dynamic invitation page
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Auth endpoints
│   │   │   ├── guests/              # Guest management endpoints
│   │   │   ├── invitations/         # Invitation endpoints
│   │   │   └── rsvp/                # RSVP handling endpoints
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   │   ├── ui/                  # UI elements (buttons, inputs, etc.)
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── card.tsx         # Card component
│   │   │   ├── input.tsx        # Input component
│   │   │   ├── label.tsx        # Label component
│   │   │   ├── radio-group.tsx  # Radio group component
│   │   │   └── textarea.tsx     # Textarea component
│   │   └── invitation/          # Invitation components
│   │       └── InvitationCard.tsx # Invitation display component
│   ├── lib/                     # Utility functions, hooks, etc.
│   │   ├── supabase/            # Supabase client
│   │   │   └── auth.ts          # Authentication utilities
│   │   ├── types/               # TypeScript types/interfaces
│   │   │   └── database.ts      # Database types
│   │   └── utils/               # Helper functions
│   │       └── cn.ts            # Class name utility
├── public/                      # Static assets
├── middleware.ts                # Route protection middleware
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.mjs          # Tailwind configuration
└── next.config.ts               # Next.js configuration
```

## Authentication and Route Protection

The application uses Supabase for authentication. Protected routes are managed through middleware which checks for valid sessions:

- `/dashboard/*` routes require authentication
- `/login`, `/register` redirect to dashboard if already logged in

## Invitation Page

Invitations are accessed via a unique ID:
`/invitation/[inviteId]`

Each invitation displays:
- Wedding details
- Schedule of events
- RSVP form
- Personalized messages

## Development

To set up your development environment:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project and add environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment

The recommended way to deploy is with [Vercel](https://vercel.com).

## License

[MIT](LICENSE)
