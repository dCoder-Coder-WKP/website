# We Knead Pizza - Website

> Cloud-Native Architecture version powered by Supabase PostgreSQL.

## System Architecture

The WKP Website is a Next.js 15 (App Router) application. Originally a fully static SPA, it has been upgraded to a hybrid cloud architecture.

### Data Flow
1. **Server Components**: Top-level routes (`app/menu/page.tsx`, `app/build/page.tsx`, `app/layout.tsx`) are Server Components. They securely query the Supabase PostgreSQL database during the server-side rendering phase using `@supabase/supabase-js`.
2. **Client Components**: The fetched data is passed as props down to purely interactive Client Components (`MenuClient.tsx`, `BuildClient.tsx`) which handle the GSAP 3D animations, Framer Motion transitions, and complex DOM manipulations.
3. **Resilience & Fallback**: All API calls (`lib/api.ts`) are wrapped in `try-catch` blocks. If the Supabase instance is unreachable, the application gracefully degrades by loading the legacy static data from `lib/menuData.ts`. This ensures 100% uptime for the customer-facing menu.

### State Management
- **Cart**: Zustand is used for persisted client-side cart management.
- **Pizza Builder**: Complex state transitions locally within the builder are handled via React `useReducer` (`lib/builderUtils.ts`), dynamically calculating prices based on server-injected base topping data.

## Developer & Engineer Guide

### Prerequisites
- Node.js 18.17+
- A Supabase Project (URL and Anon Key)

### Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Initializing the Database
The required database schema is located in `scripts/setup-db.ts`. Since this script requires a bypass-RLS Service Role Key (which should never be in the website source code), execute the raw SQL exported in `schemaSql` directly in the Supabase Dashboard SQL Editor.

### Local Development
```bash
npm install
npm run dev
```

### Testing
We enforce strict test-driven development. Any changes to pricing logic, API fetching, or component rendering must be accompanied by updated Vitest specs.
```bash
npm run test
```

### Extending the UI
The site uses styling powered by Tailwind CSS. Custom design tokens for the luxury restaurant feel (colors like `ember`, `gold`, `bg-raised`) are defined in `tailwind.config.ts`. Always utilize these semantic tokens instead of raw hex values when creating new components.
