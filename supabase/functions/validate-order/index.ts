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

function getCorsHeaders(req: Request) {
  // Allow requests from all origins (localhost, vercel previews, etc) for checkout validation
  const origin = req.headers.get('Origin') ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

const MAX_ITEMS = 50;
const MAX_BODY_SIZE_BYTES = 16_384; // 16 KB

function errorResponse(message: string, req: Request, status = 400): Response {
  // Never expose internal details — just return a generic message in production.
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', req, 405);
  }

  // Guard against oversized payloads
  const contentLength = parseInt(req.headers.get('content-length') ?? '0', 10);
  if (contentLength > MAX_BODY_SIZE_BYTES) {
    return errorResponse('Request body too large', req, 413);
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Invalid JSON body', req, 400);
    }

    // Input validation
    if (
      typeof body !== 'object' ||
      body === null ||
      !Array.isArray((body as OrderRequest).items) ||
      typeof (body as OrderRequest).claimedTotal !== 'number'
    ) {
      return errorResponse('Invalid request shape', req, 400);
    }

    const { items, claimedTotal } = body as OrderRequest;

    if (items.length === 0) {
      return errorResponse('Order must contain at least one item', req, 400);
    }

    if (items.length > MAX_ITEMS) {
      return errorResponse('Order contains too many items', req, 400);
    }

    if (claimedTotal < 0) {
      return errorResponse('Invalid total', req, 400);
    }

    let calculatedTotal = 0;

    for (const item of items) {
      // Validate each item
      if (typeof item.name !== 'string' || item.name.length === 0 || item.name.length > 200) {
        return errorResponse('Invalid item name', req, 400);
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 20) {
        return errorResponse('Invalid item quantity', req, 400);
      }
      if (!['pizza', 'extra', 'topping'].includes(item.type)) {
        return errorResponse('Invalid item type', req, 400);
      }

      let dbPrice = 0;

      if (item.type === 'pizza') {
        if (!item.size || !['small', 'medium', 'large'].includes(item.size)) {
          return errorResponse('Pizza size is required', req, 400);
        }

        const { data, error } = await supabaseClient
          .from('pizzas')
          .select('price_small, price_medium, price_large')
          .eq('name', item.name)
          .eq('is_active', true)
          .single();

        if (error || !data) return errorResponse('Item not found', req, 404);

        if (item.size === 'small') dbPrice = data.price_small;
        else if (item.size === 'medium') dbPrice = data.price_medium;
        else dbPrice = data.price_large;

      } else if (item.type === 'extra' || item.type === 'topping') {
        const table = item.type === 'extra' ? 'extras' : 'toppings';
        const { data, error } = await supabaseClient
          .from(table)
          .select('price')
          .eq('name', item.name)
          .eq('is_active', true)
          .single();

        if (error || !data) return errorResponse('Item not found', req, 404);
        dbPrice = data.price;
      }

      calculatedTotal += dbPrice * item.quantity;
    }

    const finalCalculatedGrandTotal = calculatedTotal;
    const isValid = Math.abs(finalCalculatedGrandTotal - claimedTotal) < 0.01; // FP safe

    return new Response(
      JSON.stringify({
        isValid,
        calculatedTotal: finalCalculatedGrandTotal,
        claimedTotal,
        verified: true,
      }),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );

  } catch (_err) {
    // Do not expose internal error details in production
    console.error('[validate-order] Internal error:', _err);
    return errorResponse('Internal server error', req, 500);
  }
});
