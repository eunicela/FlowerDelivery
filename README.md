# Valentine's Day Flower Delivery

A beautiful, handcrafted-feeling website for ordering Valentine's Day flower bouquets with personalized letters.

## Features

- **Landing Page**: Romantic hero section with call-to-action
- **Customization Screen**: Create personalized letters, upload photos, choose bouquet colors
- **Checkout Flow**: Secure payment via Stripe Checkout
- **Order Confirmation**: Thank you page with order status tracking
- **Admin Dashboard**: Florist dashboard to manage orders

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Styling**: Tailwind CSS with custom cursive fonts (Caveat, Dancing Script)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Checkout
- **State Management**: Zustand
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FlowerDelivery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- Supabase URL and keys from your Supabase project settings
- Stripe publishable and secret keys from your Stripe dashboard
- Set a secure admin password

4. Set up the database:
- Go to your Supabase project SQL editor
- Run the SQL from `supabase-schema.sql`
- Create a storage bucket named `card-images` (make it public)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Stripe Webhook Setup

For production, set up a webhook endpoint in Stripe:
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero section |
| `/customize` | Bouquet and letter customization |
| `/checkout` | Order summary and payment form |
| `/confirmation` | Order confirmation with status tracker |
| `/admin` | Password-protected florist dashboard |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/webhook` | POST | Handle Stripe webhooks |
| `/api/orders` | GET | Fetch all orders (admin) |
| `/api/orders/[id]` | PATCH | Update order status (admin) |
| `/api/upload` | POST | Upload images to Supabase storage |

## Pricing

- Base bouquet: $80
- Letter card with photo: $5 each

## Design

The design features:
- Wood grain textured background
- Handwritten cursive fonts (Caveat, Dancing Script)
- Warm, cozy color palette (deep red, soft pink, cream white)
- Rounded white cards with subtle shadows

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## License

Private project - All rights reserved
