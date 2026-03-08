import React from 'react';
import BuildClient from './BuildClient';
import { fetchToppings } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function BuildPage() {
  const toppings = await fetchToppings();
  
  return <BuildClient toppings={toppings} />;
}
