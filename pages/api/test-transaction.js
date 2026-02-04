import { stripe } from '../../lib/stripe';
import { createServerSupabaseClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Same auth as /api/orders
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate test order number
    const orderNumber = `TEST-${Date.now()}`;

    const supabase = createServerSupabaseClient();

    // Create minimal test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: 'Test Customer',
        customer_email: email,
        customer_phone: '555-TEST',
        delivery_method: 'pickup',
        delivery_address: 'Pickup',
        delivery_date: new Date().toISOString().split('T')[0],
        flower_color: 'red',
        total_cents: 100,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Supabase order error:', orderError);
      return res.status(500).json({ error: 'Failed to create test order' });
    }

    // Create Stripe checkout session for $1
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Transaction',
              description: 'Test transaction for email flow verification',
            },
            unit_amount: 100, // $1
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/admin`,
      customer_email: email,
      metadata: {
        orderNumber,
        flowerColor: 'red',
        customerName: 'Test Customer',
        customerPhone: '555-TEST',
        deliveryMethod: 'pickup',
        deliveryAddress: 'Pickup',
        deliveryDate: new Date().toISOString().split('T')[0],
        cardsJson: JSON.stringify([]),
      },
    });

    // Update order with stripe_session_id
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order with stripe_session_id:', updateError);
    }

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Test transaction error:', error);
    res.status(500).json({ error: 'Failed to create test transaction' });
  }
}
