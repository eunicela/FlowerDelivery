import { stripe } from '../../lib/stripe';
import { createServerSupabaseClient } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const supabase = createServerSupabaseClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      // Update order status to confirmed (preparing)
      const { error } = await supabase
        .from('orders')
        .update({ status: 'preparing' })
        .eq('stripe_session_id', session.id);

      if (error) {
        console.error('Failed to update order status:', error);
      } else {
        console.log('Order confirmed:', session.metadata?.orderNumber);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;

      // Delete the pending order if payment was not completed
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('stripe_session_id', session.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Failed to delete expired order:', error);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
