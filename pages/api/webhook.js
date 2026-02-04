import { stripe } from '../../lib/stripe';
import { createServerSupabaseClient } from '../../lib/supabase';
import { sendOrderConfirmationEmail } from '../../lib/email';

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

      // Update order status to confirmed (preparing) and fetch order details
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status: 'preparing' })
        .eq('stripe_session_id', session.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update order status:', error);
        // Return 500 so Stripe will retry the webhook
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log('Order confirmed:', order.order_number);

      // Send confirmation email
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://piazzawholesale.com';
        await sendOrderConfirmationEmail({
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderNumber: order.order_number,
          flowerColor: order.flower_color,
          deliveryDate: order.delivery_date,
          deliveryAddress: order.delivery_address,
          totalCents: order.total_cents,
          confirmationUrl: `${baseUrl}/confirmation?session_id=${session.id}`,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the webhook if email fails - order is already updated
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
        // Return 500 so Stripe will retry
        return res.status(500).json({ error: 'Database delete failed' });
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;

      // Mark order as failed
      const { error } = await supabase
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('stripe_session_id', session.id);

      if (error) {
        console.error('Failed to mark order as payment_failed:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log('Payment failed for session:', session.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
