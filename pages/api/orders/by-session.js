import { createServerSupabaseClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('order_number, status, flower_color, delivery_date, total_cents, created_at')
      .eq('stripe_session_id', session_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch order by session:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}
