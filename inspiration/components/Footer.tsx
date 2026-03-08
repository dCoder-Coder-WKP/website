export function Footer() {
  return (
    <footer className="bg-secondary text-foreground/70 py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif italic font-bold text-foreground mb-4">We Knead Pizza</h3>
            <p className="text-sm">Artisanal Goan wood-fired pizza since 2024</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Tue - Thu: 5pm - 11pm</li>
              <li>Fri - Sat: 5pm - 12am</li>
              <li>Sun: 5pm - 10pm</li>
              <li>Closed Mondays</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">Location</h4>
            <p className="text-sm">Fort, Goa 403001</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4">Contact</h4>
            <p className="text-sm">+91 832 2422 888</p>
            <p className="text-sm">hello@wekneadpizza.com</p>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm">
          <p>© 2024 We Knead Pizza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
