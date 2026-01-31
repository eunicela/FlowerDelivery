import { stripe } from '../../lib/stripe';
import { createServerSupabaseClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { flowerColor, cards, customerInfo, deliveryInfo, totalCents } = req.body;

    // Validate required fields
    if (!customerInfo?.email || !customerInfo?.name || !deliveryInfo?.date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate order number
    const orderNumber = `VAL-2025-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Format delivery address
    const deliveryAddress = `${deliveryInfo.street}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zip}`;

    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${flowerColor.charAt(0).toUpperCase() + flowerColor.slice(1)} Rose Bouquet`,
            description: 'Beautiful Valentine\'s Day bouquet',
          },
          unit_amount: 8000, // $80
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

    // Create Stripe checkout session
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
        deliveryAddress,
        deliveryDate: deliveryInfo.date,
        cardsJson: JSON.stringify(cards),
      },
    });

    // Save order to Supabase (status: pending until payment confirmed)
    const supabase = createServerSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        delivery_address: deliveryAddress,
        delivery_date: deliveryInfo.date,
        flower_color: flowerColor,
        total_cents: totalCents,
        status: 'pending',
        stripe_session_id: session.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Supabase order error:', orderError);
      // Don't fail the checkout, just log the error
    }

    // Save cards if order was created
    if (order && cards && cards.length > 0) {
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
        console.error('Supabase cards error:', cardsError);
      }
    }

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
