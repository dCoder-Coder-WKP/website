import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

interface CartItem {
  id?: string;
  name: string;
  subTotal: number;
  quantity: number;
  type: string;
  size?: 'small' | 'medium' | 'large';
  base?: string;
}

interface OrderRequest {
  items: CartItem[];
  claimedTotal: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { items, claimedTotal } = (await req.json()) as OrderRequest;
    
    let calculatedTotal = 0;

    for (const item of items) {
       // Look up price from database depending on type
       let dbPrice = 0;

       if (item.type === 'pizza') {
          const { data, error } = await supabaseClient
            .from('pizzas')
            .select('price_small, price_medium, price_large')
            .eq('name', item.name)
            .single();
            
          if (error) throw new Error(`Pizza ${item.name} not found`);
          
          if (item.size === 'small') dbPrice = data.price_small;
          else if (item.size === 'medium') dbPrice = data.price_medium;
          else if (item.size === 'large') dbPrice = data.price_large;

       } else if (item.type === 'extra' || item.type === 'topping') {
          // Both extras and toppings have standard price column
          const table = item.type === 'extra' ? 'extras' : 'toppings';
          const { data, error } = await supabaseClient
            .from(table)
            .select('price')
            .eq('name', item.name)
            .single();
            
          if (error) throw new Error(`Item ${item.name} not found in ${table}`);
          dbPrice = data.price;
       }

       calculatedTotal += dbPrice * item.quantity;
    }

    // Add logistics fee logic
    const logisticsFee = items.length === 0 ? 0 : 50;
    const finalCalculatedGrandTotal = calculatedTotal + logisticsFee;

    const isValid = finalCalculatedGrandTotal === claimedTotal;

    return new Response(
      JSON.stringify({ 
        isValid, 
        calculatedTotal: finalCalculatedGrandTotal, 
         claimedTotal,
         verified: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
