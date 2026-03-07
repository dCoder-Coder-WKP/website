'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import OrderModal from '@/components/order/OrderModal';

export default function OrderSummary() {
  const total = useCartStore((state) => state.total());
  const itemCount = useCartStore((state) => state.itemCount());
  const isEmpty = itemCount === 0;
  const [modalOpen, setModalOpen] = useState(false);

  // Static for now, can be calculated in future (e.g., free over 1000)
  const deliveryFee = isEmpty ? 0 : 50; 
  const grandTotal = total + deliveryFee;

  return (
    <div className="bg-[#111009] border border-[rgba(242,237,223,0.05)] rounded-2xl p-6 sticky top-[100px]">
      <h2 className="font-serif text-2xl text-[#F2EDDF] mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm mb-6">
        <div className="flex justify-between text-[#8C7E6A]">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="text-[#F2EDDF]">₹{total}</span>
        </div>
        
        <div className="flex justify-between text-[#8C7E6A]">
          <span>Delivery</span>
          {deliveryFee === 0 ? (
            <span className="text-green-500 font-medium">Free</span>
          ) : (
            <span className="text-[#F2EDDF]">₹{deliveryFee}</span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[rgba(242,237,223,0.1)] mb-8">
        <div className="flex justify-between items-end">
          <span className="text-[#F2EDDF] font-medium">Total</span>
          <div className="text-right">
            <span className="font-serif text-3xl text-[#C9933A]">₹{grandTotal}</span>
            <p className="text-[10px] text-[#8C7E6A] mt-1">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        disabled={isEmpty}
        title={isEmpty ? "Your cart is empty" : "Place Order"}
        className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
          isEmpty 
            ? 'opacity-40 cursor-not-allowed bg-[rgba(242,237,223,0.1)] text-[#8C7E6A]' 
            : 'bg-[#F2EDDF] text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(242,237,223,0.2)]'
        }`}
      >
        Place Order
      </button>

      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
