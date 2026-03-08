import React from 'react';
import MenuClient from './MenuClient';
import { fetchPizzas, fetchExtras, fetchToppings } from '@/lib/api';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Menu | We Knead Pizza',
  description: 'Our full menu of hand-tossed pizzas, sides, and desserts. Freshly baked daily in Carona, Goa.',
};

export default async function MenuPage() {
  const [pizzas, extras, toppings] = await Promise.all([
    fetchPizzas(),
    fetchExtras(),
    fetchToppings()
  ]);
  
  return <MenuClient pizzas={pizzas} extras={extras} toppings={toppings} />;
}
