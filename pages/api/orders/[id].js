import { createServerSupabaseClient } from '../../../lib/supabase';
import { sendStatusUpdateEmail } from '../../../lib/email';

export default async function handler(req, res) {
  // Simple password protection - require env var, no default
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const supabase = createServerSupabaseClient();

  if (req.method === 'PATCH') {
    try {
      const { status } = req.body;

      if (!['pending', 'preparing', 'ready', 'delivered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Send status update email for 'ready' and 'delivered' statuses
      if (status === 'ready' || status === 'delivered') {
        try {
          await sendStatusUpdateEmail({
            customerEmail: data.customer_email,
            customerName: data.customer_name,
            orderNumber: data.order_number,
            flowerColor: data.flower_color,
            deliveryMethod: data.delivery_method,
            deliveryDate: data.delivery_date,
            deliveryAddress: data.delivery_address,
            status,
          });
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Failed to update order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  } else if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          cards:order_cards(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
