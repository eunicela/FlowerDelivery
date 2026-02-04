import { createServerSupabaseClient } from '../../lib/supabase';

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

  const supabase = createServerSupabaseClient();

  if (req.method === 'GET') {
    try {
      // Fetch all orders with their cards, sorted by delivery date
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          cards:order_cards(*)
        `)
        .order('delivery_date', { ascending: true });

      if (error) throw error;

      res.status(200).json(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
