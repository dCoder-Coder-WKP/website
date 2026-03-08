export default function Footer() {
  return (
    <footer className="bg-bg-base text-text-secondary py-16 border-t border-border-subtle relative overflow-hidden">
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-serif italic text-2xl text-text-primary mb-4">We Knead Pizza</h3>
            <p className="font-sans text-xs font-light tracking-wide text-text-muted leading-relaxed">
              Generational Goan Baked pizza. Gas-oven fired with fresh dough, healthy toppings, and amazing taste. Owned by Willie Fernandes.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-luxury text-accent-gold mb-6">Hours of Operation</h4>
            <ul className="space-y-3 font-sans text-xs font-light">
              <li className="flex justify-between">
                <span>Mon — Sun</span>
                <span className="text-text-primary">5:00 PM - 9:00 PM</span>
              </li>
              <li className="flex justify-between mt-4">
                <span className="text-accent-gold">Takeaway / Delivery / Dine-in</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-luxury text-accent-gold mb-6">Location</h4>
            <div className="font-sans text-xs font-light text-text-muted space-y-1">
              <p>Carona, Goa</p>
              <p>India</p>
            </div>
            <a 
              href="https://wa.me/918484802540" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-block font-sans text-[10px] uppercase tracking-luxury text-accent-gold hover:text-white transition-colors duration-medium border-b border-accent-gold/50 hover:border-accent-gold pb-1"
            >
              Get Directions
            </a>
          </div>
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-luxury text-accent-gold mb-6">Contact</h4>
            <p className="font-sans text-xs font-light text-text-muted mb-2">WhatsApp / Phone</p>
            <p className="font-serif italic text-lg text-text-primary mb-4">+91 84848 02540</p>
            <p className="font-sans text-[10px] uppercase tracking-luxury text-text-muted">FSSAI: 20621001001228</p>
          </div>
        </div>

        <div className="border-t border-border-refined pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-sans text-text-muted uppercase tracking-luxury">
          <p>© {new Date().getFullYear()} We Knead Pizza. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent-gold transition-colors duration-medium">Privacy</a>
            <a href="#" className="hover:text-accent-gold transition-colors duration-medium">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
