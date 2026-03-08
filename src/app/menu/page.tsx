import React from 'react';
import MenuClient from './MenuClient';
import { fetchPizzas, fetchExtras, fetchToppings } from '@/lib/api';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Menu | We Knead Pizza - Premium Selection',
  description: 'Explore our curated selection of artisanal pizzas, decadent sides, and indulgent desserts. Crafted with fresh dough daily in Carona, Goa.',
};

export default async function MenuPage() {
  const [pizzas, extras, toppings] = await Promise.all([
    fetchPizzas(),
    fetchExtras(),
    fetchToppings()
  ]);
  
  return <MenuClient pizzas={pizzas} extras={extras} toppings={toppings} />;
}
