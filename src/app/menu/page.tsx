import React from 'react';
import MenuClient from './MenuClient';
import { fetchPizzas, fetchExtras, fetchToppings } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [pizzas, extras, toppings] = await Promise.all([
    fetchPizzas(),
    fetchExtras(),
    fetchToppings()
  ]);
  
  return <MenuClient pizzas={pizzas} extras={extras} toppings={toppings} />;
}
