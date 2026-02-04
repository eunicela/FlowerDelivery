import { stripe } from '../../lib/stripe';
import { createServerSupabaseClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { flowerColor, cards, customerInfo, deliveryMethod, deliveryInfo, totalCents } = req.body;

    // Validate required fields
    if (!customerInfo?.email || !customerInfo?.name || !deliveryInfo?.date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!flowerColor) {
      return res.status(400).json({ error: 'Flower color is required' });
    }

    // Only require address for delivery, not pickup
    if (deliveryMethod === 'delivery' && (!deliveryInfo?.street || !deliveryInfo?.city || !deliveryInfo?.state || !deliveryInfo?.zip)) {
      return res.status(400).json({ error: 'Complete delivery address is required' });
    }

    // Generate order number
    const orderNumber = `VAL-2025-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Format delivery address (or null for pickup)
    const deliveryAddress = deliveryMethod === 'delivery'
      ? `${deliveryInfo.street}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zip}`
      : 'Pickup';

    const supabase = createServerSupabaseClient();

    // Save order to Supabase FIRST (before creating Stripe session)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress,
        delivery_date: deliveryInfo.date,
        flower_color: flowerColor,
        total_cents: totalCents,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Supabase order error:', orderError);
      return res.status(500).json({ error: 'Failed to create order. Please try again.' });
    }

    // Save cards if provided (proceed even if this fails, just log warning)
    if (cards && cards.length > 0) {
      const cardsToInsert = cards.map((card) => ({
        order_id: order.id,
        recipient_name: card.recipientName,
        message: card.message,
        sender_name: card.senderName,
        image_url: card.imageUrl,
      }));

      const { error: cardsError } = await supabase
        .from('order_cards')
        .insert(cardsToInsert);

      if (cardsError) {
        console.warn('Warning: Failed to save cards for order:', orderError);
      }
    }

    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${flowerColor.charAt(0).toUpperCase() + flowerColor.slice(1)} Rose Bouquet`,
            description: 'Beautiful Valentine\'s Day bouquet',
          },
          unit_amount: 9500, // $95
        },
        quantity: 1,
      },
    ];

    // Add cards to line items
    if (cards && cards.length > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Personalized Letter Card',
            description: `${cards.length} card(s) with your message`,
          },
          unit_amount: 500, // $5 per card
        },
        quantity: cards.length,
      });
    }

    // Add delivery fee if delivery is selected
    if (deliveryMethod === 'delivery') {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
            description: 'Local delivery service',
          },
          unit_amount: 3000, // $30
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session (only after order is saved)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        orderNumber,
        flowerColor,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        deliveryMethod,
        deliveryAddress,
        deliveryDate: deliveryInfo.date,
        cardsJson: JSON.stringify(cards),
      },
    });

    // Update order with stripe_session_id
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order with stripe_session_id:', updateError);
      // Continue anyway - the order exists and payment can proceed
    }

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
